# CLAUDE.md — lab-research-notes

調査で分かったこと（手法・根拠・適用条件・判断基準）を残すリポジトリ。コードは置かない。
詳細な経緯や案件固有の数値は Notion 記録DB にあり、ここには一般化した知見だけを書く。

## 絶対制約

- 案件固有の情報を書かない：顧客名・サービス名・内部の数値（精度・件数・費用）・画像・データ・社内のタスクID。必要なら「ある画像分類器」「数百枚規模」のように一般化する
- 秘密情報（APIキー・トークン付きURL・個人情報）を書かない
- 出典は実在のURLだけ。記憶で補わない。確認できない数値は「未確認」と書く
- 既存ノートの結論を黙って書き換えない。覆すときは `## 追記 YYYY-MM-DD` に理由を書き、必要なら `status: superseded` と `superseded_by:` を付ける
- 本人のタスクを作らない（TODO・期限・「次回やること」を書かない）。未解決は `## 未確認` に事実として残す

## ノートの型

- パス：`notes/YYYY-MM-DD-<slug>.md`。slug は lowercase kebab-case の英語、5語以内
- frontmatter（必須）：`title` `date` `topics` `status` `question`。任意：`sources` `record` `superseded_by`
  - `status` は active / superseded / archived
  - `date` はファイル名の日付と一致させる
- 見出しは次の順で、要らないものは省く：`## 結論` `## 根拠` `## 適用条件` `## 未確認` `## 出典`
- 結論は先頭に3項目以内。根拠は事実と出典を行ごとに対応させる。推奨は1つに絞り、落とした候補と理由を残す
- 表は手法の比較に使う。列は「系統／手法／何をするか／報告された効果（領域）／費用」を基本にする
- 同じ問いの続きは新規ノートにせず、既存ノートへ `## 追記 YYYY-MM-DD`
- title に `[` `]` を使わない（索引のリンクが壊れる）

## 作業手順

1. 既存ノートを `grep -ril <キーワード> notes/` で探し、あれば追記
2. 新規なら `templates/note.md` を複製
3. `python3 scripts/build_index.py --check` を通し、`python3 scripts/build_index.py` で INDEX.md を更新
4. main に直接コミット。1ノート1コミット。メッセージは `note: <title>` または `update: <title>`
5. push は本人の指示があるときだけ

## topics の語彙

小文字英語。既存の語を優先し、新語は INDEX.md で単独にならないか確認してから使う。
例：ml, vision, clip, vlm, llm, classification, ood-detection, cascade, human-in-the-loop, labeling, weak-supervision, xai, evaluation, mlops, dev-environment, security, notion, writing
