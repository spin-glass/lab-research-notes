import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import {
  FEEDBACK_INBOX_REPO,
  GITHUB_APP_ID,
  GITHUB_APP_INSTALLATION_ID,
  GITHUB_APP_PRIVATE_KEY,
  TURNSTILE_SECRET_KEY,
} from 'astro:env/server';
import { handleFeedback } from '../../lib/feedback.ts';

export const prerender = false;

export const POST: APIRoute = async ({ request, site }) => {
  const slugs = new Set((await getCollection('notes')).map((n) => n.id));
  return handleFeedback(request, {
    env: { TURNSTILE_SECRET_KEY, GITHUB_APP_ID, GITHUB_APP_INSTALLATION_ID, GITHUB_APP_PRIVATE_KEY, FEEDBACK_INBOX_REPO },
    slugs,
    siteUrl: (site ?? new URL(request.url)).origin,
  });
};
