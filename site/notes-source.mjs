// notes/ の読み込み規則。content collection（src/content.config.ts）と、
// /api/feedback に渡す slug 一覧（astro.config.mjs の virtual:note-slugs）の両方がここを使う。
import { readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

/** site/ から見た notes/ の位置（glob loader の base） */
export const NOTES_BASE = '../notes';
export const NOTES_PATTERN = ['*.md', '!_*', '!README*'];

/** ファイル名 → slug（= collection の id） */
export function noteSlug(fileName) {
  return fileName.replace(/\.md$/, '');
}

/** ビルド時に notes/ を読み、NOTES_PATTERN に当たるノートの slug を返す */
export function listNoteSlugs() {
  const dir = fileURLToPath(new URL(`${NOTES_BASE}/`, import.meta.url));
  return readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isFile() && e.name.endsWith('.md') && !/^(\.|_|README)/.test(e.name))
    .map((e) => noteSlug(e.name))
    .sort();
}
