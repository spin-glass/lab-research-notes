// /api/feedback の本体を、GitHub と Turnstile への通信をモックして確かめる。
import { strict as assert } from 'node:assert';
import { createVerify, generateKeyPairSync } from 'node:crypto';
import { beforeEach, describe, test } from 'node:test';
import {
  DAILY_LIMIT,
  createAppJwt,
  formatJst,
  handleFeedback,
  startOfJstDay,
  submissionMarker,
  type FeedbackEnv,
} from '../src/lib/feedback.ts';

const { privateKey, publicKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
const PEM = privateKey.export({ type: 'pkcs1', format: 'pem' }).toString();
const SLUG = '2026-10-21-ai-labeling-revision-loop';
const NOW = new Date('2026-10-25T03:00:00Z'); // 12:00 JST
const ID = '0b6f3c2e-8f4a-4d3b-9a51-2f6c1d7e9a10';

const ENV: FeedbackEnv = {
  // Cloudflare 公式のテスト用シークレット（常に成功）を模したもの。通信はモックする
  TURNSTILE_SECRET_KEY: '1x0000000000000000000000000000000AA',
  GITHUB_APP_ID: '123456',
  GITHUB_APP_INSTALLATION_ID: '7890',
  // Vercel に1行で入れた形（\n をエスケープ）でも読めること
  GITHUB_APP_PRIVATE_KEY: PEM.replace(/\n/g, '\\n'),
  FEEDBACK_INBOX_REPO: 'spin-glass/tool-notes-inbox',
};

interface Call {
  url: string;
  method: string;
  headers: Record<string, string>;
  body: unknown;
}

let calls: Call[];
let turnstileOk: boolean;
let existing: { body: string; created_at: string; pull_request?: unknown }[];

const mockFetch: typeof fetch = async (input, init) => {
  const url = String(input);
  const method = init?.method ?? 'GET';
  const headers = Object.fromEntries(Object.entries((init?.headers ?? {}) as Record<string, string>).map(([k, v]) => [k.toLowerCase(), v]));
  const body = typeof init?.body === 'string' ? JSON.parse(init.body) : undefined;
  calls.push({ url, method, headers, body });
  const reply = (status: number, data: unknown) =>
    new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json' } });

  if (url === 'https://challenges.cloudflare.com/turnstile/v0/siteverify') {
    return reply(200, turnstileOk ? { success: true } : { success: false, 'error-codes': ['invalid-input-response'] });
  }
  if (url === 'https://api.github.com/app/installations/7890/access_tokens' && method === 'POST') {
    return reply(201, { token: 'test-installation-token' });
  }
  if (url.startsWith('https://api.github.com/repos/spin-glass/tool-notes-inbox/issues?') && method === 'GET') {
    return reply(200, existing);
  }
  if (url === 'https://api.github.com/repos/spin-glass/tool-notes-inbox/issues' && method === 'POST') {
    return reply(201, { number: 1 });
  }
  return reply(404, { message: `unexpected ${method} ${url}` });
};

function post(fields: Record<string, string>): Request {
  const form = new FormData();
  for (const [k, v] of Object.entries(fields)) form.set(k, v);
  return new Request('https://notes.spin-glass.dev/api/feedback', { method: 'POST', body: form });
}

const valid = (over: Record<string, string> = {}) => ({
  slug: SLUG,
  submission_id: ID,
  body: 'ラベル修正の手順に @someone 宛ての誤りがあります',
  location: '根拠の表の2行目',
  website: '',
  'cf-turnstile-response': 'XXXX.DUMMY.TOKEN.XXXX',
  ...over,
});

async function send(fields: Record<string, string>, env: FeedbackEnv = ENV) {
  const res = await handleFeedback(post(fields), {
    env,
    slugs: new Set([SLUG]),
    siteUrl: 'https://notes.spin-glass.dev',
    fetch: mockFetch,
    now: () => NOW,
  });
  return { status: res.status, data: (await res.json()) as { ok: boolean; message: string } };
}

const created = () => calls.filter((c) => c.method === 'POST' && c.url.endsWith('/tool-notes-inbox/issues'));

beforeEach(() => {
  calls = [];
  turnstileOk = true;
  existing = [];
});

describe('正常系', () => {
  test('Issue を1件作る（title・body・label）', async () => {
    const { status, data } = await send(valid());
    assert.equal(status, 201);
    assert.equal(data.ok, true);
    assert.equal(created().length, 1);
    const issue = created()[0];
    assert.equal(issue.headers.authorization, 'Bearer test-installation-token');
    const { title, body, labels } = issue.body as { title: string; body: string; labels: string[] };
    assert.equal(title, `[feedback] ${SLUG}`);
    assert.deepEqual(labels, ['feedback']);
    assert.match(body, new RegExp(`https://notes\\.spin-glass\\.dev/notes/${SLUG}/`));
    assert.match(body, /根拠の表の2行目/);
    assert.match(body, /ラベル修正の手順に/);
    assert.match(body, new RegExp(ID));
    assert.match(body, /2026-10-25 12:00:00 JST/);
    assert.ok(body.includes(submissionMarker(ID)));
    // 本文はコードブロックに入れ、@メンションを展開させない
    assert.match(body, /```text\nラベル修正の手順に @someone/);
  });

  test('installation token は受信箱だけ・issues:write に絞って取る。JWT は App の鍵で署名', async () => {
    await send(valid());
    const tok = calls.find((c) => c.url.endsWith('/access_tokens'))!;
    assert.deepEqual(tok.body, { repositories: ['tool-notes-inbox'], permissions: { issues: 'write' } });
    const jwt = tok.headers.authorization.replace(/^Bearer /, '');
    const [h, p, s] = jwt.split('.');
    const verifier = createVerify('RSA-SHA256');
    verifier.update(`${h}.${p}`);
    assert.ok(verifier.verify(publicKey, Buffer.from(s, 'base64url')));
    const payload = JSON.parse(Buffer.from(p, 'base64url').toString());
    assert.equal(payload.iss, '123456');
    assert.ok(payload.exp - payload.iat <= 600);
  });

  test('Turnstile はシークレットと送信 ID を付けてサーバー側で検証する', async () => {
    await send(valid());
    const v = calls.find((c) => c.url.includes('siteverify'))!;
    assert.deepEqual(v.body, { secret: ENV.TURNSTILE_SECRET_KEY, response: 'XXXX.DUMMY.TOKEN.XXXX', idempotency_key: ID });
  });

  test('該当箇所は任意', async () => {
    const { status } = await send(valid({ location: '' }));
    assert.equal(status, 201);
    assert.match((created()[0].body as { body: string }).body, /（指定なし）/);
  });
});

describe('拒否（Issue を作らない）', () => {
  test('Turnstile 失敗は 403', async () => {
    turnstileOk = false;
    const { status } = await send(valid());
    assert.equal(status, 403);
    assert.equal(created().length, 0);
  });

  test('Turnstile トークンなしは 400（検証も呼ばない）', async () => {
    const { status } = await send(valid({ 'cf-turnstile-response': '' }));
    assert.equal(status, 400);
    assert.equal(calls.length, 0);
  });

  test('ハニーポットに値があれば 400', async () => {
    const { status } = await send(valid({ website: 'https://spam.example' }));
    assert.equal(status, 400);
    assert.equal(calls.length, 0);
  });

  test('本文が 4,000 字を超えると 413、ちょうど 4,000 字は通る', async () => {
    assert.equal((await send(valid({ body: 'あ'.repeat(4001) }))).status, 413);
    assert.equal(created().length, 0);
    assert.equal((await send(valid({ body: '𠮷'.repeat(4000) }))).status, 201);
  });

  test('本文が空は 400', async () => {
    assert.equal((await send(valid({ body: '  \n ' }))).status, 400);
    assert.equal(calls.length, 0);
  });

  test('存在しない slug は 400', async () => {
    const { status } = await send(valid({ slug: '2026-01-01-no-such-note' }));
    assert.equal(status, 400);
    assert.equal(calls.length, 0);
  });

  test('送信 ID が UUID でなければ 400', async () => {
    assert.equal((await send(valid({ submission_id: 'abc' }))).status, 400);
    assert.equal(calls.length, 0);
  });
});

describe('再送と上限', () => {
  test('同じ送信 ID の再送では作成しない（200 で受付済み）', async () => {
    existing = [{ body: `...\n${submissionMarker(ID)}\n`, created_at: '2026-10-25T01:00:00Z' }];
    const { status, data } = await send(valid());
    assert.equal(status, 200);
    assert.equal(data.ok, true);
    assert.equal(created().length, 0);
  });

  test('当日（JST）の作成数が上限に達していたら 429', async () => {
    existing = Array.from({ length: DAILY_LIMIT }, (_, i) => ({ body: `#${i}`, created_at: '2026-10-24T15:30:00Z' }));
    const { status } = await send(valid());
    assert.equal(status, 429);
    assert.equal(created().length, 0);
  });

  test('前日（JST）分と PR は上限に数えない', async () => {
    existing = [
      ...Array.from({ length: DAILY_LIMIT }, (_, i) => ({ body: `#${i}`, created_at: '2026-10-24T14:59:59Z' })),
      { body: 'pr', created_at: '2026-10-25T01:00:00Z', pull_request: {} },
    ];
    assert.equal((await send(valid())).status, 201);
  });

  test('一覧は前日 0 時（JST）以降・feedback ラベルで取る', async () => {
    await send(valid());
    const list = new URL(calls.find((c) => c.method === 'GET')!.url);
    assert.equal(list.searchParams.get('labels'), 'feedback');
    assert.equal(list.searchParams.get('state'), 'all');
    assert.equal(list.searchParams.get('since'), '2026-10-23T15:00:00.000Z');
  });
});

describe('設定不足と上流の失敗', () => {
  for (const key of Object.keys(ENV) as (keyof FeedbackEnv)[]) {
    test(`${key} がなければ 503「現在送信できません」`, async () => {
      const { status, data } = await send(valid(), { ...ENV, [key]: undefined });
      assert.equal(status, 503);
      assert.equal(data.message, '現在送信できません');
      assert.equal(calls.length, 0);
    });
  }

  test('秘密情報が1つもなければ 503', async () => {
    assert.equal((await send(valid(), {})).status, 503);
  });

  test('GitHub が失敗したら 502', async () => {
    const res = await handleFeedback(post(valid()), {
      env: ENV,
      slugs: new Set([SLUG]),
      siteUrl: 'https://notes.spin-glass.dev',
      fetch: async (input, init) =>
        String(input).includes('siteverify') ? mockFetch(input, init) : new Response('{}', { status: 500 }),
      now: () => NOW,
    });
    assert.equal(res.status, 502);
  });
});

describe('補助関数', () => {
  test('JST の表示と日の境目', () => {
    assert.equal(formatJst(new Date('2026-10-24T15:00:00Z')), '2026-10-25 00:00:00 JST');
    assert.equal(startOfJstDay(new Date('2026-10-24T15:00:00Z')).toISOString(), '2026-10-24T15:00:00.000Z');
    assert.equal(startOfJstDay(new Date('2026-10-24T14:59:59Z')).toISOString(), '2026-10-23T15:00:00.000Z');
  });

  test('JWT の iat は60秒戻す', () => {
    const jwt = createAppJwt('1', PEM, new Date('2026-10-25T00:00:00Z'));
    const payload = JSON.parse(Buffer.from(jwt.split('.')[1], 'base64url').toString());
    assert.equal(payload.iat, Math.floor(Date.parse('2026-10-25T00:00:00Z') / 1000) - 60);
  });
});
