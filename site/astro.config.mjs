// @ts-check
import { defineConfig, envField } from 'astro/config';
import vercel from '@astrojs/vercel';
import { listNoteSlugs } from './notes-source.mjs';

/**
 * /api/feedback が使う slug 一覧を、ビルド時に定数として埋め込む（virtual:note-slugs）。
 * 本番の関数から content collection（getCollection）を呼ばず、ノート本文のデータストアを同梱しないため。
 * @returns {import('vite').Plugin}
 */
function noteSlugs() {
  const id = 'virtual:note-slugs';
  return {
    name: 'note-slugs',
    resolveId: (source) => (source === id ? `\0${id}` : null),
    load: (resolved) => (resolved === `\0${id}` ? `export default ${JSON.stringify(listNoteSlugs())};` : null),
  };
}

/**
 * @astrojs/vercel 11.0.13 の実行時エントリ（dist/serverless/entrypoint.js）は定数を ../index.js
 * （ビルド時のインテグレーション本体）から読むため、そこにある rolldown などの import が副作用付きの
 * 外部 import として関数のエントリに残る。関数はそれを読み込んで、rolldown のネイティブバインディングが
 * 見つからず起動時に落ちる。11.0.14 で constants.js に分離されたが、公開から14日たつまでは上げない。
 * ここでは、アダプタのビルド用モジュールからの import を「副作用なし」として解決させ、使われない import を
 * 落とす。実際に使われる import はそのまま残る。
 * @returns {import('vite').Plugin}
 */
function dropAdapterBuildOnlyImports() {
  const BUILD_ONLY = new Set(['rolldown', '@vercel/routing-utils', '@vercel/nft', 'tinyglobby', '@astrojs/internal-helpers/fs']);
  return {
    name: 'drop-adapter-build-only-imports',
    enforce: 'pre',
    apply: 'build',
    resolveId(source, importer) {
      if (!BUILD_ONLY.has(source) || !importer?.replaceAll('\\', '/').includes('/@astrojs/vercel/dist/')) return null;
      return { id: source, external: true, moduleSideEffects: false };
    },
  };
}

// ページは静的に生成し、prerender = false の /api/feedback だけを Vercel Function で動かす。
export default defineConfig({
  site: 'https://notes.spin-glass.dev',
  adapter: vercel(),
  vite: {
    plugins: [noteSlugs(), dropAdapterBuildOnlyImports()],
  },
  env: {
    schema: {
      PUBLIC_TURNSTILE_SITE_KEY: envField.string({ context: 'client', access: 'public', optional: true }),
      TURNSTILE_SECRET_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      GITHUB_APP_ID: envField.string({ context: 'server', access: 'secret', optional: true }),
      GITHUB_APP_INSTALLATION_ID: envField.string({ context: 'server', access: 'secret', optional: true }),
      GITHUB_APP_PRIVATE_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      FEEDBACK_INBOX_REPO: envField.string({ context: 'server', access: 'secret', optional: true }),
    },
  },
});
