// `npm run build` が出力した Vercel Function を、Vercel と同じく関数ディレクトリだけを取り出して読み込む。
// site/node_modules に解決が逃げないよう、リポジトリ外の一時ディレクトリにコピーしてから import する。
import { strict as assert } from 'node:assert';
import { cpSync, existsSync, mkdtempSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, before, describe, test } from 'node:test';
import { fileURLToPath, pathToFileURL } from 'node:url';

const FUNC_DIR = fileURLToPath(new URL('../.vercel/output/functions/_render.func/', import.meta.url));
const ENTRY = '.vercel/output/server/entry.mjs';
// 本番の処理に要らないビルド用の依存。同梱されていたら起動時に落ちうる
const BUILD_ONLY = ['rolldown', '@rolldown', 'vite', '@vercel/nft', 'esbuild'];
const SECRETS = ['TURNSTILE_SECRET_KEY', 'GITHUB_APP_ID', 'GITHUB_APP_INSTALLATION_ID', 'GITHUB_APP_PRIVATE_KEY', 'FEEDBACK_INBOX_REPO'];
const ORIGIN = 'https://notes.spin-glass.dev';

let workDir: string;
let handler: { fetch: (req: Request) => Promise<Response> };

function packages(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((name) =>
    name.startsWith('@') ? [name, ...readdirSync(join(dir, name)).map((n) => `${name}/${n}`)] : [name],
  );
}

before(async () => {
  assert.ok(existsSync(join(FUNC_DIR, ENTRY)), '先に npm run build を実行する（関数の出力がない）');
  for (const k of SECRETS) delete process.env[k];
  workDir = mkdtempSync(join(tmpdir(), 'notes-func-'));
  cpSync(FUNC_DIR, workDir, { recursive: true });
  handler = (await import(pathToFileURL(join(workDir, ENTRY)).href)).default;
});

after(() => {
  if (workDir) rmSync(workDir, { recursive: true, force: true });
});

describe('Vercel Function（_render.func）', () => {
  test('ビルド用の依存（rolldown・vite など）を同梱していない', () => {
    const bundled = packages(join(FUNC_DIR, 'node_modules'));
    const found = bundled.filter((p) => BUILD_ONLY.some((b) => p === b || p.startsWith(`${b}/`)));
    assert.deepEqual(found, []);
  });

  test('秘密情報がない状態で POST /api/feedback は 503', async () => {
    const form = new FormData();
    form.set('slug', '2026-10-21-ai-labeling-revision-loop');
    form.set('body', 'テスト');
    const res = await handler.fetch(new Request(`${ORIGIN}/api/feedback`, { method: 'POST', body: form, headers: { origin: ORIGIN } }));
    assert.equal(res.status, 503);
    assert.deepEqual(await res.json(), { ok: false, message: '現在送信できません' });
  });

  test('存在しないパスは 404', async () => {
    const res = await handler.fetch(new Request(`${ORIGIN}/no-such-path/`));
    assert.equal(res.status, 404);
  });
});
