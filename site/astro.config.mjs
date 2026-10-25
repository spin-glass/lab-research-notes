// @ts-check
import { defineConfig, envField } from 'astro/config';
import vercel from '@astrojs/vercel';

// ページは静的に生成し、prerender = false の /api/feedback だけを Vercel Function で動かす。
export default defineConfig({
  site: 'https://notes.spin-glass.dev',
  adapter: vercel(),
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
