import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// 正本は リポジトリ直下の notes/。複製せず glob loader で直接読む。
// id はファイル名から .md を除いたもの（= ノートの slug）。
const notes = defineCollection({
  loader: glob({
    pattern: ['*.md', '!_*', '!README*'],
    base: '../notes',
    generateId: ({ entry }) => entry.replace(/\.md$/, ''),
  }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    topics: z.array(z.string()),
    status: z.enum(['active', 'superseded', 'archived']),
    question: z.string(),
    sources: z.array(z.string()).optional(),
    // 本人の非公開 Notion へのリンク。受け入れるがサイトには出さない
    record: z.string().nullish(),
    superseded_by: z.string().nullish(),
  }),
});

export const collections = { notes };
