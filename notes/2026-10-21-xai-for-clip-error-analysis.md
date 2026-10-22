---
title: CLIP系分類器の誤り分析にXAIを使う条件
date: 2026-10-21
topics: [ml, vision, clip, xai]
status: active
question: 分類器が誤る画像の原因調査に説明可能AI（XAI）は有効か。どの手法を選ぶか
sources:
  - https://proceedings.neurips.cc/paper_files/paper/2024/hash/996bef37d8a638f37bdfcac2789e835d-Abstract.html
  - https://iclr.cc/virtual/2022/oral/6149
  - https://research.google/pubs/sanity-checks-for-saliency-maps/
record: https://app.notion.com/p/400600398c0381f2ae98fac081358b45
---

## 結論

- 有効なのは、目的を「埋め込みの問題かヘッドの問題かの切り分け」と「次の作業に渡せる単語の取得」に絞ったとき。画素単位のヒートマップは後回し。
- 「CLIP埋め込み＋線形ヘッド」の誤りは2択：(A) 埋め込みは区別しているがヘッドが境界を学んでいない（ラベルで直る）(B) 埋め込み自体が混同している（ラベルもテキスト側も効かず、別エンコーダか上位モデルが要る）。ヒートマップはどちらでも同じ領域を光らせるので2択を分けられない。
- 推奨は概念単位のXAI：SpLiCE でヘッドの重みと誤り画像を概念語に分解し、Domino で誤りスライスを自動発見する。出力が単語なので検索クエリや委譲器の特徴量にそのまま使える。

## 根拠

- SpLiCE（NeurIPS 2024）：CLIP表現を人が読める概念の疎な非負線形結合に変換。学習不要・タスク非依存で、擬似相関の検出とモデル編集に使える。
- Domino（ICLR 2022）：クロスモーダル埋め込みと誤りを考慮した混合モデルで系統的誤りのスライスを発見し自然言語で説明。1,235設定で36%のスライスを特定（従来比+12pt）、35%でスライス名を正確に生成。
- TextSpan（ICLR 2024）：CLIP画像表現をパッチ・層・アテンションヘッドに分解しテキストで解釈。擬似特徴の除去に使える。
- ヒートマップの信頼性：Sanity Checks（NeurIPS 2018）は一部のサリエンシー法がモデルにもデータにも依存しないことを示した（勾配・Grad-CAM は合格、Guided 系は不合格）。CLIP では生の特徴マップが前景より背景を好む（ECLIP）。
- CLIP 向けヒートマップ法は存在する：LeGrad（ICCV 2025、OpenCLIP のラッパーとして pip 導入可）、Grad-ECLIP（ICML 2024）。

## 適用条件

1. 先に分離度：誤り画像と正解画像で、埋め込み上の線形プローブの交差検証 AUROC を出す。高ければ (A)、低ければ (B)。
2. SpLiCE：対象ドメインの概念語彙（名詞。日本語と英語）をその CLIP のテキストエンコーダで埋め込み直し、ヘッドの重みベクトルと誤り画像の平均埋め込みを分解。両方に強く出る概念が擬似相関。
3. Domino：評価セットの埋め込み・正解・予測確率から誤りスライスを列挙し、手で見つけた型で尽きているか確認。
4. ヒートマップ（LeGrad）は「蓋を見ているのか中身を見ているのか」のように位置の仮説が具体的に立ったときだけ。

## 未確認

- SpLiCE の公開語彙と前処理（中心化）は OpenAI CLIP 向け。多言語 CLIP では語彙の再埋め込みと中心化のやり直しが要り、日本語語彙での分解品質は未検証。
- Domino の発見率は約36%。見つからないスライスが「ない」証明にはならない。

## 出典

- SpLiCE: https://proceedings.neurips.cc/paper_files/paper/2024/hash/996bef37d8a638f37bdfcac2789e835d-Abstract.html
- Domino: https://iclr.cc/virtual/2022/oral/6149 ／ 紹介: https://hazyresearch.stanford.edu/blog/2022-04-02-domino
- TextSpan: https://proceedings.iclr.cc/paper_files/paper/2024/hash/5085a2b8c298edeadc46b9ffe6df5f64-Abstract-Conference.html
- Sanity Checks for Saliency Maps: https://research.google/pubs/sanity-checks-for-saliency-maps/
- ECLIP: https://arxiv.org/abs/2209.07046v2
- LeGrad: https://openaccess.thecvf.com/content/ICCV2025/html/Bousselham_LeGrad_An_Explainability_Method_for_Vision_Transformers_via_Feature_Formation_ICCV_2025_paper.html
- Grad-ECLIP: https://proceedings.mlr.press/v235/zhao24p.html
