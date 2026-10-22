# lab-research-notes

調査の知見を残すためだけのリポジトリ。対象は多岐にわたる（ML・MLOps・ラベリング・開発環境・セキュリティ・運用…）。
コードは置かない。置くのは「調べて分かったこと」と「その根拠」だけ。

## 何を書くか

- 1調査 = 1ノート（`notes/YYYY-MM-DD-<slug>.md`）
- 書くのは手法・根拠・適用条件・判断基準。あとで調べ直さなくて済む粒度
- 書かないのは案件固有の数値・固有名詞・データ。それらは Notion 記録DB に置き、ノートからは `record:` でリンクだけ張る

## 構成

```
notes/        ノート本体（フラット。分類は frontmatter の topics）
templates/    ノートの雛形
scripts/      INDEX.md の生成とチェック（標準ライブラリのみ）
INDEX.md      自動生成の索引（topic 別・日付順）。手で編集しない
CLAUDE.md     Claude Code で書くときの規約
```

## ノートを足す

1. `templates/note.md` を `notes/YYYY-MM-DD-<slug>.md` にコピーして書く
2. `make check && make index`
3. commit

## 命名

GitHub リポジトリ命名規約（lowercase kebab-case、`^(lab|tool|post|ref)-[a-z0-9]+(-[a-z0-9]+)*$`）に従い、
`lab-`（検証・実験）を付与。ローカルは `~/dev/lab/` 配下。
GitHub に置く場合は非公開。topics: `research-notes` `knowledge-base` `machine-learning` `literature-review`
