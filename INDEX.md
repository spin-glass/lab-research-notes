# INDEX

自動生成（`python3 scripts/build_index.py`）。手で編集しない。ノート 5 件。

## topic 別

### cascade（1）

- 2026-10-21 — [難例を上位モデルや人に委譲する実例と引き金の設計](notes/2026-10-21-deferral-to-stronger-model.md) — 安い判定器が苦手な入力だけを高精度モデルや人に回す仕組みは、どこで使われ、何を引き金にしているか

### classification（3）

- 2026-10-22 — [CLIPのテキスト側を使う精度改善手法の地図](notes/2026-10-22-clip-text-side-methods.md) — 画像側の埋め込み＋線形ヘッドで運用している CLIP 分類器に、テキストエンコーダをどう使えば精度が上がるか
- 2026-10-21 — [難例を上位モデルや人に委譲する実例と引き金の設計](notes/2026-10-21-deferral-to-stronger-model.md) — 安い判定器が苦手な入力だけを高精度モデルや人に回す仕組みは、どこで使われ、何を引き金にしているか
- 2026-10-21 — [VLMを分類器の置き換えに使わない理由と使いどころ](notes/2026-10-21-vlm-as-classifier-vs-labeler.md) — 大型 VLM（PaliGemma・Gemma 系）は CLIP＋線形ヘッドの分類器を置き換えられるか

### clip（3）

- 2026-10-22 — [CLIPのテキスト側を使う精度改善手法の地図](notes/2026-10-22-clip-text-side-methods.md) — 画像側の埋め込み＋線形ヘッドで運用している CLIP 分類器に、テキストエンコーダをどう使えば精度が上がるか
- 2026-10-21 — [VLMを分類器の置き換えに使わない理由と使いどころ](notes/2026-10-21-vlm-as-classifier-vs-labeler.md) — 大型 VLM（PaliGemma・Gemma 系）は CLIP＋線形ヘッドの分類器を置き換えられるか
- 2026-10-21 — [CLIP系分類器の誤り分析にXAIを使う条件](notes/2026-10-21-xai-for-clip-error-analysis.md) — 分類器が誤る画像の原因調査に説明可能AI（XAI）は有効か。どの手法を選ぶか

### evaluation（1）

- 2026-10-21 — [AIラベリングで修正をループに組み込む設計](notes/2026-10-21-ai-labeling-revision-loop.md) — ラベルをある時点で固定せず、曖昧画像・基準変更・誤り修正を繰り返す前提で、何をどう記録し学習・評価するか

### human-in-the-loop（1）

- 2026-10-21 — [難例を上位モデルや人に委譲する実例と引き金の設計](notes/2026-10-21-deferral-to-stronger-model.md) — 安い判定器が苦手な入力だけを高精度モデルや人に回す仕組みは、どこで使われ、何を引き金にしているか

### labeling（2）

- 2026-10-21 — [AIラベリングで修正をループに組み込む設計](notes/2026-10-21-ai-labeling-revision-loop.md) — ラベルをある時点で固定せず、曖昧画像・基準変更・誤り修正を繰り返す前提で、何をどう記録し学習・評価するか
- 2026-10-21 — [VLMを分類器の置き換えに使わない理由と使いどころ](notes/2026-10-21-vlm-as-classifier-vs-labeler.md) — 大型 VLM（PaliGemma・Gemma 系）は CLIP＋線形ヘッドの分類器を置き換えられるか

### llm（2）

- 2026-10-21 — [AIラベリングで修正をループに組み込む設計](notes/2026-10-21-ai-labeling-revision-loop.md) — ラベルをある時点で固定せず、曖昧画像・基準変更・誤り修正を繰り返す前提で、何をどう記録し学習・評価するか
- 2026-10-21 — [難例を上位モデルや人に委譲する実例と引き金の設計](notes/2026-10-21-deferral-to-stronger-model.md) — 安い判定器が苦手な入力だけを高精度モデルや人に回す仕組みは、どこで使われ、何を引き金にしているか

### ml（5）

- 2026-10-22 — [CLIPのテキスト側を使う精度改善手法の地図](notes/2026-10-22-clip-text-side-methods.md) — 画像側の埋め込み＋線形ヘッドで運用している CLIP 分類器に、テキストエンコーダをどう使えば精度が上がるか
- 2026-10-21 — [AIラベリングで修正をループに組み込む設計](notes/2026-10-21-ai-labeling-revision-loop.md) — ラベルをある時点で固定せず、曖昧画像・基準変更・誤り修正を繰り返す前提で、何をどう記録し学習・評価するか
- 2026-10-21 — [難例を上位モデルや人に委譲する実例と引き金の設計](notes/2026-10-21-deferral-to-stronger-model.md) — 安い判定器が苦手な入力だけを高精度モデルや人に回す仕組みは、どこで使われ、何を引き金にしているか
- 2026-10-21 — [VLMを分類器の置き換えに使わない理由と使いどころ](notes/2026-10-21-vlm-as-classifier-vs-labeler.md) — 大型 VLM（PaliGemma・Gemma 系）は CLIP＋線形ヘッドの分類器を置き換えられるか
- 2026-10-21 — [CLIP系分類器の誤り分析にXAIを使う条件](notes/2026-10-21-xai-for-clip-error-analysis.md) — 分類器が誤る画像の原因調査に説明可能AI（XAI）は有効か。どの手法を選ぶか

### ood-detection（1）

- 2026-10-22 — [CLIPのテキスト側を使う精度改善手法の地図](notes/2026-10-22-clip-text-side-methods.md) — 画像側の埋め込み＋線形ヘッドで運用している CLIP 分類器に、テキストエンコーダをどう使えば精度が上がるか

### vision（3）

- 2026-10-22 — [CLIPのテキスト側を使う精度改善手法の地図](notes/2026-10-22-clip-text-side-methods.md) — 画像側の埋め込み＋線形ヘッドで運用している CLIP 分類器に、テキストエンコーダをどう使えば精度が上がるか
- 2026-10-21 — [VLMを分類器の置き換えに使わない理由と使いどころ](notes/2026-10-21-vlm-as-classifier-vs-labeler.md) — 大型 VLM（PaliGemma・Gemma 系）は CLIP＋線形ヘッドの分類器を置き換えられるか
- 2026-10-21 — [CLIP系分類器の誤り分析にXAIを使う条件](notes/2026-10-21-xai-for-clip-error-analysis.md) — 分類器が誤る画像の原因調査に説明可能AI（XAI）は有効か。どの手法を選ぶか

### vlm（1）

- 2026-10-21 — [VLMを分類器の置き換えに使わない理由と使いどころ](notes/2026-10-21-vlm-as-classifier-vs-labeler.md) — 大型 VLM（PaliGemma・Gemma 系）は CLIP＋線形ヘッドの分類器を置き換えられるか

### weak-supervision（1）

- 2026-10-21 — [AIラベリングで修正をループに組み込む設計](notes/2026-10-21-ai-labeling-revision-loop.md) — ラベルをある時点で固定せず、曖昧画像・基準変更・誤り修正を繰り返す前提で、何をどう記録し学習・評価するか

### xai（1）

- 2026-10-21 — [CLIP系分類器の誤り分析にXAIを使う条件](notes/2026-10-21-xai-for-clip-error-analysis.md) — 分類器が誤る画像の原因調査に説明可能AI（XAI）は有効か。どの手法を選ぶか

## 日付順

- 2026-10-22 — [CLIPのテキスト側を使う精度改善手法の地図](notes/2026-10-22-clip-text-side-methods.md) — 画像側の埋め込み＋線形ヘッドで運用している CLIP 分類器に、テキストエンコーダをどう使えば精度が上がるか — topics: ml, vision, clip, classification, ood-detection
- 2026-10-21 — [AIラベリングで修正をループに組み込む設計](notes/2026-10-21-ai-labeling-revision-loop.md) — ラベルをある時点で固定せず、曖昧画像・基準変更・誤り修正を繰り返す前提で、何をどう記録し学習・評価するか — topics: ml, labeling, weak-supervision, evaluation, llm
- 2026-10-21 — [難例を上位モデルや人に委譲する実例と引き金の設計](notes/2026-10-21-deferral-to-stronger-model.md) — 安い判定器が苦手な入力だけを高精度モデルや人に回す仕組みは、どこで使われ、何を引き金にしているか — topics: ml, classification, cascade, human-in-the-loop, llm
- 2026-10-21 — [VLMを分類器の置き換えに使わない理由と使いどころ](notes/2026-10-21-vlm-as-classifier-vs-labeler.md) — 大型 VLM（PaliGemma・Gemma 系）は CLIP＋線形ヘッドの分類器を置き換えられるか — topics: ml, vision, vlm, clip, classification, labeling
- 2026-10-21 — [CLIP系分類器の誤り分析にXAIを使う条件](notes/2026-10-21-xai-for-clip-error-analysis.md) — 分類器が誤る画像の原因調査に説明可能AI（XAI）は有効か。どの手法を選ぶか — topics: ml, vision, clip, xai
