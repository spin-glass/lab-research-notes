# lab-research-notes

調査の知見を残すためだけのリポジトリ。対象は多岐にわたる（ML・MLOps・ラベリング・開発環境・セキュリティ・運用…）。
置くのは「調べて分かったこと」と「その根拠」。コードはノートを配信する `site/` と索引用の `scripts/` だけ。

## 何を書くか

- 1調査 = 1ノート（`notes/YYYY-MM-DD-<slug>.md`）
- 書くのは手法・根拠・適用条件・判断基準。あとで調べ直さなくて済む粒度
- 書かないのは案件固有の数値・固有名詞・データ
- ノートは公開される。非公開の資料（Notion など）へのリンクも、「詳細は記録に」のような参照も置かない。根拠は公開されている出典だけで示す

## 構成

```
notes/        ノート本体（フラット。分類は frontmatter の topics）
templates/    ノートの雛形
site/         notes/ を配信する Astro サイトとフィードバック API（Vercel）
scripts/      INDEX.md の生成とチェック（標準ライブラリのみ）
INDEX.md      自動生成の索引（topic 別・日付順）。手で編集しない
CLAUDE.md     Claude Code で書くときの規約
```

## site/

`site/` は `notes/*.md` をそのまま読み込んで https://notes.spin-glass.dev に静的サイトとして配信する Astro プロジェクト（Vercel、Root Directory は `site`）。ノートの正本は `notes/` のままで、`site/` には複製しない。各ノートの末尾にはフィードバック用のフォームがあり、`/api/feedback`（このエンドポイントだけサーバー側で動く）が Turnstile で確認したうえで、非公開の受信箱リポジトリに Issue を作る。手元では `cd site && npm ci && npm run build`。`npm test` はビルドしてから、API のモックテストと、出力された Vercel Function の起動・応答（503・404）・同梱物を確かめる。依存は `site/package.json` で完結し、リポジトリ直下には Node の設定を置かない。

## ノートを足す

1. `templates/note.md` を `notes/YYYY-MM-DD-<slug>.md` にコピーして書く
2. `make check && make index`
3. commit

## 命名

GitHub リポジトリ命名規約（lowercase kebab-case、`^(lab|tool|post|ref)-[a-z0-9]+(-[a-z0-9]+)*$`）に従い、
`lab-`（検証・実験）を付与。ローカルは `~/dev/lab/` 配下。
GitHub では公開（[spin-glass/lab-research-notes](https://github.com/spin-glass/lab-research-notes)）。公開前提のため、案件固有の情報と秘密情報は書かない（CLAUDE.md の絶対制約）。topics: `research-notes` `knowledge-base` `machine-learning` `literature-review`
