import type { APIRoute } from 'astro';
import {
  FEEDBACK_INBOX_REPO,
  GITHUB_APP_ID,
  GITHUB_APP_INSTALLATION_ID,
  GITHUB_APP_PRIVATE_KEY,
  TURNSTILE_SECRET_KEY,
} from 'astro:env/server';
import noteSlugs from 'virtual:note-slugs';
import { handleFeedback } from '../../lib/feedback.ts';

export const prerender = false;

// 本番の関数では content collection を読まない。slug 一覧はビルド時に埋め込んだ定数
const slugs: ReadonlySet<string> = new Set(noteSlugs);

export const POST: APIRoute = async ({ request, site }) =>
  handleFeedback(request, {
    env: { TURNSTILE_SECRET_KEY, GITHUB_APP_ID, GITHUB_APP_INSTALLATION_ID, GITHUB_APP_PRIVATE_KEY, FEEDBACK_INBOX_REPO },
    slugs,
    siteUrl: (site ?? new URL(request.url)).origin,
  });
