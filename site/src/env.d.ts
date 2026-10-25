declare module 'virtual:note-slugs' {
  /** ビルド時に notes/ から得たノートの slug（astro.config.mjs の noteSlugs プラグイン） */
  const slugs: readonly string[];
  export default slugs;
}
