import { getCollection, type CollectionEntry } from 'astro:content';

export type Note = CollectionEntry<'notes'>;

export function formatDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export async function getNotes(): Promise<Note[]> {
  const notes = await getCollection('notes');
  return notes.sort((a, b) => b.data.date.getTime() - a.data.date.getTime() || a.id.localeCompare(b.id));
}

export function notesByTopic(notes: Note[]): [string, Note[]][] {
  const map = new Map<string, Note[]>();
  for (const n of notes) {
    for (const t of n.data.topics) {
      if (!map.has(t)) map.set(t, []);
      map.get(t)!.push(n);
    }
  }
  return [...map.entries()].sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
}

export function noteHref(slug: string): string {
  return `/notes/${slug}/`;
}

/** superseded_by は slug・ファイル名・notes/ 付きパスのどれでも受ける */
export function supersededHref(value: string): string {
  if (/^https?:\/\//.test(value)) return value;
  const slug = value.replace(/^\.?\/?(notes\/)?/, '').replace(/\.md$/, '');
  return noteHref(slug);
}
