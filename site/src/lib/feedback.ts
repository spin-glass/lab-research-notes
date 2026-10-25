// /api/feedback の本体。Astro に依存させず、node --test から直接呼べるようにしている。
import { createSign } from 'node:crypto';

export const MAX_BODY_CHARS = 4000;
export const MAX_LOCATION_CHARS = 200;
export const DAILY_LIMIT = 50;
export const FEEDBACK_LABEL = 'feedback';
export const UNAVAILABLE_MESSAGE = '現在送信できません';

const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const GITHUB_API = 'https://api.github.com';
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const REPO_RE = /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/;
const JST_OFFSET_MS = 9 * 60 * 60 * 1000;

export interface FeedbackEnv {
  TURNSTILE_SECRET_KEY?: string;
  GITHUB_APP_ID?: string;
  GITHUB_APP_INSTALLATION_ID?: string;
  GITHUB_APP_PRIVATE_KEY?: string;
  FEEDBACK_INBOX_REPO?: string;
}

export interface FeedbackDeps {
  env: FeedbackEnv;
  /** 存在するノートの slug */
  slugs: ReadonlySet<string>;
  /** ノート URL の起点（例 https://notes.spin-glass.dev） */
  siteUrl: string;
  fetch?: typeof fetch;
  now?: () => Date;
}

interface Config {
  turnstileSecret: string;
  appId: string;
  installationId: string;
  privateKey: string;
  owner: string;
  repo: string;
}

function json(status: number, ok: boolean, message: string): Response {
  return new Response(JSON.stringify({ ok, message }), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });
}

function readConfig(env: FeedbackEnv): Config | null {
  const turnstileSecret = env.TURNSTILE_SECRET_KEY?.trim();
  const appId = env.GITHUB_APP_ID?.trim();
  const installationId = env.GITHUB_APP_INSTALLATION_ID?.trim();
  // Vercel の環境変数に1行で入れた場合の \n を改行に戻す
  const privateKey = env.GITHUB_APP_PRIVATE_KEY?.replace(/\\n/g, '\n').trim();
  const inbox = env.FEEDBACK_INBOX_REPO?.trim();
  if (!turnstileSecret || !appId || !installationId || !privateKey || !inbox || !REPO_RE.test(inbox)) return null;
  const [owner, repo] = inbox.split('/');
  return { turnstileSecret, appId, installationId, privateKey, owner, repo };
}

function field(form: FormData, name: string): string {
  const v = form.get(name);
  return typeof v === 'string' ? v : '';
}

function charLength(s: string): number {
  return [...s].length;
}

/** 受信日時の表示（JST） */
export function formatJst(d: Date): string {
  return new Date(d.getTime() + JST_OFFSET_MS).toISOString().replace('T', ' ').slice(0, 19) + ' JST';
}

/** 当日（JST）0時の UTC 時刻 */
export function startOfJstDay(d: Date): Date {
  const jst = new Date(d.getTime() + JST_OFFSET_MS);
  jst.setUTCHours(0, 0, 0, 0);
  return new Date(jst.getTime() - JST_OFFSET_MS);
}

/** 利用者の文字列をコードブロックに入れる。@メンションや画像・リンクを展開させないため */
function fenced(text: string): string {
  const longest = Math.max(2, ...[...text.matchAll(/`+/g)].map((m) => m[0].length));
  const fence = '`'.repeat(longest + 1);
  return `${fence}text\n${text}\n${fence}`;
}

export function submissionMarker(id: string): string {
  return `<!-- feedback-submission-id: ${id} -->`;
}

export function buildIssue(p: { slug: string; noteUrl: string; location: string; body: string; id: string; receivedAt: Date }) {
  return {
    title: `[feedback] ${p.slug}`,
    body: [
      `- ノート: ${p.noteUrl}`,
      `- 送信 ID: \`${p.id}\``,
      `- 受信日時: ${formatJst(p.receivedAt)}`,
      '',
      '### 該当箇所',
      '',
      p.location ? fenced(p.location) : '（指定なし）',
      '',
      '### 本文',
      '',
      fenced(p.body),
      '',
      submissionMarker(p.id),
      '',
    ].join('\n'),
    labels: [FEEDBACK_LABEL],
  };
}

function base64url(input: string | Buffer): string {
  return Buffer.from(input).toString('base64url');
}

/** GitHub App の JWT（RS256）。iat は時計ずれに備えて60秒戻す */
export function createAppJwt(appId: string, privateKey: string, now: Date): string {
  const iat = Math.floor(now.getTime() / 1000) - 60;
  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const payload = base64url(JSON.stringify({ iat, exp: iat + 600, iss: appId }));
  const signer = createSign('RSA-SHA256');
  signer.update(`${header}.${payload}`);
  return `${header}.${payload}.${signer.sign(privateKey).toString('base64url')}`;
}

class UpstreamError extends Error {}

async function verifyTurnstile(f: typeof fetch, secret: string, token: string, id: string): Promise<boolean> {
  const res = await f(TURNSTILE_VERIFY_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ secret, response: token, idempotency_key: id }),
  });
  if (!res.ok) throw new UpstreamError(`turnstile ${res.status}`);
  const data = (await res.json()) as { success?: boolean };
  return data.success === true;
}

function ghHeaders(token: string): Record<string, string> {
  return {
    accept: 'application/vnd.github+json',
    authorization: `Bearer ${token}`,
    'x-github-api-version': '2022-11-28',
    'user-agent': 'lab-research-notes-feedback',
  };
}

async function getInstallationToken(f: typeof fetch, c: Config, now: Date): Promise<string> {
  const jwt = createAppJwt(c.appId, c.privateKey, now);
  const res = await f(`${GITHUB_API}/app/installations/${encodeURIComponent(c.installationId)}/access_tokens`, {
    method: 'POST',
    headers: { ...ghHeaders(jwt), 'content-type': 'application/json' },
    // 受信箱リポジトリの Issues だけに絞ったトークンを取る
    body: JSON.stringify({ repositories: [c.repo], permissions: { issues: 'write' } }),
  });
  if (!res.ok) throw new UpstreamError(`installation token ${res.status}`);
  const data = (await res.json()) as { token?: string };
  if (!data.token) throw new UpstreamError('installation token missing');
  return data.token;
}

interface GhIssue {
  body?: string | null;
  created_at: string;
  pull_request?: unknown;
}

/**
 * 前日 0 時（JST）以降に更新された feedback Issue を取る。
 * 検索 API は索引の反映が遅れるので、即時に整合する一覧 API を使う。
 */
async function listRecentFeedback(f: typeof fetch, token: string, c: Config, since: Date): Promise<GhIssue[]> {
  const out: GhIssue[] = [];
  for (let page = 1; page <= 5; page++) {
    const q = new URLSearchParams({
      labels: FEEDBACK_LABEL,
      state: 'all',
      since: since.toISOString(),
      per_page: '100',
      page: String(page),
    });
    const res = await f(`${GITHUB_API}/repos/${c.owner}/${c.repo}/issues?${q}`, { headers: ghHeaders(token) });
    if (!res.ok) throw new UpstreamError(`list issues ${res.status}`);
    const items = (await res.json()) as GhIssue[];
    out.push(...items.filter((i) => !i.pull_request));
    if (items.length < 100) break;
  }
  return out;
}

async function createIssue(f: typeof fetch, token: string, c: Config, issue: ReturnType<typeof buildIssue>): Promise<void> {
  const res = await f(`${GITHUB_API}/repos/${c.owner}/${c.repo}/issues`, {
    method: 'POST',
    headers: { ...ghHeaders(token), 'content-type': 'application/json' },
    body: JSON.stringify(issue),
  });
  if (!res.ok) throw new UpstreamError(`create issue ${res.status}`);
}

export async function handleFeedback(request: Request, deps: FeedbackDeps): Promise<Response> {
  const config = readConfig(deps.env);
  if (!config) return json(503, false, UNAVAILABLE_MESSAGE);
  const f = deps.fetch ?? fetch;
  const now = deps.now?.() ?? new Date();

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json(400, false, '送信内容を読み取れませんでした');
  }

  // ハニーポット：人には見えない欄に値があれば機械的な送信とみなす
  if (field(form, 'website') !== '') return json(400, false, '送信できませんでした');

  const slug = field(form, 'slug');
  if (!deps.slugs.has(slug)) return json(400, false, '対象のノートが見つかりません');

  const id = field(form, 'submission_id').trim().toLowerCase();
  if (!UUID_RE.test(id)) return json(400, false, '送信 ID が不正です。ページを再読み込みしてください');

  const body = field(form, 'body').replace(/\r\n?/g, '\n').trim();
  if (!body) return json(400, false, '本文を入力してください');
  if (charLength(body) > MAX_BODY_CHARS) return json(413, false, `本文は ${MAX_BODY_CHARS.toLocaleString('en-US')} 字以内にしてください`);

  const location = field(form, 'location').replace(/\s+/g, ' ').trim();
  if (charLength(location) > MAX_LOCATION_CHARS) return json(400, false, `該当箇所は ${MAX_LOCATION_CHARS} 字以内にしてください`);

  const turnstileToken = field(form, 'cf-turnstile-response');
  if (!turnstileToken) return json(400, false, '確認（Turnstile）が完了していません');

  try {
    if (!(await verifyTurnstile(f, config.turnstileSecret, turnstileToken, id))) {
      return json(403, false, '確認（Turnstile）に失敗しました。もう一度お試しください');
    }

    const token = await getInstallationToken(f, config, now);
    const dayStart = startOfJstDay(now);
    const recent = await listRecentFeedback(f, token, config, new Date(dayStart.getTime() - 24 * 60 * 60 * 1000));

    // 同じ送信 ID の再送は作成せず成功として返す
    const marker = submissionMarker(id);
    if (recent.some((i) => i.body?.includes(marker))) return json(200, true, '送信しました（受付済み）');

    const today = recent.filter((i) => new Date(i.created_at).getTime() >= dayStart.getTime()).length;
    if (today >= DAILY_LIMIT) return json(429, false, '本日の受付上限に達しました。明日以降にお試しください');

    const noteUrl = new URL(`/notes/${slug}/`, deps.siteUrl).toString();
    await createIssue(f, token, config, buildIssue({ slug, noteUrl, location, body, id, receivedAt: now }));
    return json(201, true, '送信しました。ありがとうございます');
  } catch (e) {
    console.error('feedback upstream error:', e instanceof Error ? e.message : e);
    return json(502, false, '送信に失敗しました。時間をおいてお試しください');
  }
}
