# INDEX

自動生成（`python3 scripts/build_index.py`）。手で編集しない。ノート 9 件。

## topic 別

### cascade（1）

- 2026-10-21 — [難例を上位モデルや人に委譲する実例と引き金の設計](notes/2026-10-21-deferral-to-stronger-model.md) — 安い判定器が苦手な入力だけを高精度モデルや人に回す仕組みは、どこで使われ、何を引き金にしているか

### classification（4）

- 2026-10-27 — [LLMセキュリティの分類とCLIP画像分類器への当てはめ](notes/2026-10-27-llm-security-risks-for-clip-classifier.md) — OWASP LLM Top 10 2026 などで分類されるセキュリティ問題のうち、CLIP＋線形ヘッドの画像分類器（VLM をラベラー・難例の委譲先に使う構成）に関係するものはどれか
- 2026-10-22 — [CLIPのテキスト側を使う精度改善手法の地図](notes/2026-10-22-clip-text-side-methods.md) — 画像側の埋め込み＋線形ヘッドで運用している CLIP 分類器に、テキストエンコーダをどう使えば精度が上がるか
- 2026-10-21 — [難例を上位モデルや人に委譲する実例と引き金の設計](notes/2026-10-21-deferral-to-stronger-model.md) — 安い判定器が苦手な入力だけを高精度モデルや人に回す仕組みは、どこで使われ、何を引き金にしているか
- 2026-10-21 — [VLMを分類器の置き換えに使わない理由と使いどころ](notes/2026-10-21-vlm-as-classifier-vs-labeler.md) — 大型 VLM（PaliGemma・Gemma 系）は CLIP＋線形ヘッドの分類器を置き換えられるか

### clip（4）

- 2026-10-27 — [LLMセキュリティの分類とCLIP画像分類器への当てはめ](notes/2026-10-27-llm-security-risks-for-clip-classifier.md) — OWASP LLM Top 10 2026 などで分類されるセキュリティ問題のうち、CLIP＋線形ヘッドの画像分類器（VLM をラベラー・難例の委譲先に使う構成）に関係するものはどれか
- 2026-10-22 — [CLIPのテキスト側を使う精度改善手法の地図](notes/2026-10-22-clip-text-side-methods.md) — 画像側の埋め込み＋線形ヘッドで運用している CLIP 分類器に、テキストエンコーダをどう使えば精度が上がるか
- 2026-10-21 — [VLMを分類器の置き換えに使わない理由と使いどころ](notes/2026-10-21-vlm-as-classifier-vs-labeler.md) — 大型 VLM（PaliGemma・Gemma 系）は CLIP＋線形ヘッドの分類器を置き換えられるか
- 2026-10-21 — [CLIP系分類器の誤り分析にXAIを使う条件](notes/2026-10-21-xai-for-clip-error-analysis.md) — 分類器が誤る画像の原因調査に説明可能AI（XAI）は有効か。どの手法を選ぶか

### evaluation（4）

- 2026-10-29 — [少数の人ラベルでAIラベルの推定を補正するPPI・DSL・CDI](notes/2026-10-29-ppi-dsl-cdi-corrected-inference.md) — LLM/VLM が全件に付けたラベルから精度や比率などの数字を出すとき、少数の人ラベルで推定の偏りを取り除き、妥当な信頼区間を得る方法（PPI・DSL・CDI）はどう働き、何を前提にし、どれを使うか
- 2026-10-27 — [AIで作るスライドの冗長さは指示でなく仕組みで抑える](notes/2026-10-27-ai-slides-verbosity-structure.md) — LLM に作らせたスライドが冗長・枚数過多・読み手不在になるのはなぜか。指示・モデル・仕組みのどれで防げるか
- 2026-10-27 — [曖昧な画像のラベルの持ち方とAIラベルの監査](notes/2026-10-27-ambiguous-labels-ai-audit.md) — 複数のクラスが当てはまる画像や判定できない画像のラベルをどう持つか。LLM/VLM でラベルを付けて人手を最小にするとき、人は何を見て、評価の数字をどう出すか
- 2026-10-21 — [AIラベリングで修正をループに組み込む設計](notes/2026-10-21-ai-labeling-revision-loop.md) — ラベルをある時点で固定せず、曖昧画像・基準変更・誤り修正を繰り返す前提で、何をどう記録し学習・評価するか

### human-in-the-loop（3）

- 2026-10-29 — [少数の人ラベルでAIラベルの推定を補正するPPI・DSL・CDI](notes/2026-10-29-ppi-dsl-cdi-corrected-inference.md) — LLM/VLM が全件に付けたラベルから精度や比率などの数字を出すとき、少数の人ラベルで推定の偏りを取り除き、妥当な信頼区間を得る方法（PPI・DSL・CDI）はどう働き、何を前提にし、どれを使うか
- 2026-10-27 — [曖昧な画像のラベルの持ち方とAIラベルの監査](notes/2026-10-27-ambiguous-labels-ai-audit.md) — 複数のクラスが当てはまる画像や判定できない画像のラベルをどう持つか。LLM/VLM でラベルを付けて人手を最小にするとき、人は何を見て、評価の数字をどう出すか
- 2026-10-21 — [難例を上位モデルや人に委譲する実例と引き金の設計](notes/2026-10-21-deferral-to-stronger-model.md) — 安い判定器が苦手な入力だけを高精度モデルや人に回す仕組みは、どこで使われ、何を引き金にしているか

### labeling（5）

- 2026-10-29 — [少数の人ラベルでAIラベルの推定を補正するPPI・DSL・CDI](notes/2026-10-29-ppi-dsl-cdi-corrected-inference.md) — LLM/VLM が全件に付けたラベルから精度や比率などの数字を出すとき、少数の人ラベルで推定の偏りを取り除き、妥当な信頼区間を得る方法（PPI・DSL・CDI）はどう働き、何を前提にし、どれを使うか
- 2026-10-27 — [曖昧な画像のラベルの持ち方とAIラベルの監査](notes/2026-10-27-ambiguous-labels-ai-audit.md) — 複数のクラスが当てはまる画像や判定できない画像のラベルをどう持つか。LLM/VLM でラベルを付けて人手を最小にするとき、人は何を見て、評価の数字をどう出すか
- 2026-10-27 — [LLMセキュリティの分類とCLIP画像分類器への当てはめ](notes/2026-10-27-llm-security-risks-for-clip-classifier.md) — OWASP LLM Top 10 2026 などで分類されるセキュリティ問題のうち、CLIP＋線形ヘッドの画像分類器（VLM をラベラー・難例の委譲先に使う構成）に関係するものはどれか
- 2026-10-21 — [AIラベリングで修正をループに組み込む設計](notes/2026-10-21-ai-labeling-revision-loop.md) — ラベルをある時点で固定せず、曖昧画像・基準変更・誤り修正を繰り返す前提で、何をどう記録し学習・評価するか
- 2026-10-21 — [VLMを分類器の置き換えに使わない理由と使いどころ](notes/2026-10-21-vlm-as-classifier-vs-labeler.md) — 大型 VLM（PaliGemma・Gemma 系）は CLIP＋線形ヘッドの分類器を置き換えられるか

### llm（5）

- 2026-10-29 — [少数の人ラベルでAIラベルの推定を補正するPPI・DSL・CDI](notes/2026-10-29-ppi-dsl-cdi-corrected-inference.md) — LLM/VLM が全件に付けたラベルから精度や比率などの数字を出すとき、少数の人ラベルで推定の偏りを取り除き、妥当な信頼区間を得る方法（PPI・DSL・CDI）はどう働き、何を前提にし、どれを使うか
- 2026-10-27 — [AIで作るスライドの冗長さは指示でなく仕組みで抑える](notes/2026-10-27-ai-slides-verbosity-structure.md) — LLM に作らせたスライドが冗長・枚数過多・読み手不在になるのはなぜか。指示・モデル・仕組みのどれで防げるか
- 2026-10-27 — [曖昧な画像のラベルの持ち方とAIラベルの監査](notes/2026-10-27-ambiguous-labels-ai-audit.md) — 複数のクラスが当てはまる画像や判定できない画像のラベルをどう持つか。LLM/VLM でラベルを付けて人手を最小にするとき、人は何を見て、評価の数字をどう出すか
- 2026-10-21 — [AIラベリングで修正をループに組み込む設計](notes/2026-10-21-ai-labeling-revision-loop.md) — ラベルをある時点で固定せず、曖昧画像・基準変更・誤り修正を繰り返す前提で、何をどう記録し学習・評価するか
- 2026-10-21 — [難例を上位モデルや人に委譲する実例と引き金の設計](notes/2026-10-21-deferral-to-stronger-model.md) — 安い判定器が苦手な入力だけを高精度モデルや人に回す仕組みは、どこで使われ、何を引き金にしているか

### ml（8）

- 2026-10-29 — [少数の人ラベルでAIラベルの推定を補正するPPI・DSL・CDI](notes/2026-10-29-ppi-dsl-cdi-corrected-inference.md) — LLM/VLM が全件に付けたラベルから精度や比率などの数字を出すとき、少数の人ラベルで推定の偏りを取り除き、妥当な信頼区間を得る方法（PPI・DSL・CDI）はどう働き、何を前提にし、どれを使うか
- 2026-10-27 — [曖昧な画像のラベルの持ち方とAIラベルの監査](notes/2026-10-27-ambiguous-labels-ai-audit.md) — 複数のクラスが当てはまる画像や判定できない画像のラベルをどう持つか。LLM/VLM でラベルを付けて人手を最小にするとき、人は何を見て、評価の数字をどう出すか
- 2026-10-27 — [LLMセキュリティの分類とCLIP画像分類器への当てはめ](notes/2026-10-27-llm-security-risks-for-clip-classifier.md) — OWASP LLM Top 10 2026 などで分類されるセキュリティ問題のうち、CLIP＋線形ヘッドの画像分類器（VLM をラベラー・難例の委譲先に使う構成）に関係するものはどれか
- 2026-10-22 — [CLIPのテキスト側を使う精度改善手法の地図](notes/2026-10-22-clip-text-side-methods.md) — 画像側の埋め込み＋線形ヘッドで運用している CLIP 分類器に、テキストエンコーダをどう使えば精度が上がるか
- 2026-10-21 — [AIラベリングで修正をループに組み込む設計](notes/2026-10-21-ai-labeling-revision-loop.md) — ラベルをある時点で固定せず、曖昧画像・基準変更・誤り修正を繰り返す前提で、何をどう記録し学習・評価するか
- 2026-10-21 — [難例を上位モデルや人に委譲する実例と引き金の設計](notes/2026-10-21-deferral-to-stronger-model.md) — 安い判定器が苦手な入力だけを高精度モデルや人に回す仕組みは、どこで使われ、何を引き金にしているか
- 2026-10-21 — [VLMを分類器の置き換えに使わない理由と使いどころ](notes/2026-10-21-vlm-as-classifier-vs-labeler.md) — 大型 VLM（PaliGemma・Gemma 系）は CLIP＋線形ヘッドの分類器を置き換えられるか
- 2026-10-21 — [CLIP系分類器の誤り分析にXAIを使う条件](notes/2026-10-21-xai-for-clip-error-analysis.md) — 分類器が誤る画像の原因調査に説明可能AI（XAI）は有効か。どの手法を選ぶか

### ood-detection（1）

- 2026-10-22 — [CLIPのテキスト側を使う精度改善手法の地図](notes/2026-10-22-clip-text-side-methods.md) — 画像側の埋め込み＋線形ヘッドで運用している CLIP 分類器に、テキストエンコーダをどう使えば精度が上がるか

### security（1）

- 2026-10-27 — [LLMセキュリティの分類とCLIP画像分類器への当てはめ](notes/2026-10-27-llm-security-risks-for-clip-classifier.md) — OWASP LLM Top 10 2026 などで分類されるセキュリティ問題のうち、CLIP＋線形ヘッドの画像分類器（VLM をラベラー・難例の委譲先に使う構成）に関係するものはどれか

### vision（5）

- 2026-10-27 — [曖昧な画像のラベルの持ち方とAIラベルの監査](notes/2026-10-27-ambiguous-labels-ai-audit.md) — 複数のクラスが当てはまる画像や判定できない画像のラベルをどう持つか。LLM/VLM でラベルを付けて人手を最小にするとき、人は何を見て、評価の数字をどう出すか
- 2026-10-27 — [LLMセキュリティの分類とCLIP画像分類器への当てはめ](notes/2026-10-27-llm-security-risks-for-clip-classifier.md) — OWASP LLM Top 10 2026 などで分類されるセキュリティ問題のうち、CLIP＋線形ヘッドの画像分類器（VLM をラベラー・難例の委譲先に使う構成）に関係するものはどれか
- 2026-10-22 — [CLIPのテキスト側を使う精度改善手法の地図](notes/2026-10-22-clip-text-side-methods.md) — 画像側の埋め込み＋線形ヘッドで運用している CLIP 分類器に、テキストエンコーダをどう使えば精度が上がるか
- 2026-10-21 — [VLMを分類器の置き換えに使わない理由と使いどころ](notes/2026-10-21-vlm-as-classifier-vs-labeler.md) — 大型 VLM（PaliGemma・Gemma 系）は CLIP＋線形ヘッドの分類器を置き換えられるか
- 2026-10-21 — [CLIP系分類器の誤り分析にXAIを使う条件](notes/2026-10-21-xai-for-clip-error-analysis.md) — 分類器が誤る画像の原因調査に説明可能AI（XAI）は有効か。どの手法を選ぶか

### vlm（2）

- 2026-10-27 — [LLMセキュリティの分類とCLIP画像分類器への当てはめ](notes/2026-10-27-llm-security-risks-for-clip-classifier.md) — OWASP LLM Top 10 2026 などで分類されるセキュリティ問題のうち、CLIP＋線形ヘッドの画像分類器（VLM をラベラー・難例の委譲先に使う構成）に関係するものはどれか
- 2026-10-21 — [VLMを分類器の置き換えに使わない理由と使いどころ](notes/2026-10-21-vlm-as-classifier-vs-labeler.md) — 大型 VLM（PaliGemma・Gemma 系）は CLIP＋線形ヘッドの分類器を置き換えられるか

### weak-supervision（1）

- 2026-10-21 — [AIラベリングで修正をループに組み込む設計](notes/2026-10-21-ai-labeling-revision-loop.md) — ラベルをある時点で固定せず、曖昧画像・基準変更・誤り修正を繰り返す前提で、何をどう記録し学習・評価するか

### writing（1）

- 2026-10-27 — [AIで作るスライドの冗長さは指示でなく仕組みで抑える](notes/2026-10-27-ai-slides-verbosity-structure.md) — LLM に作らせたスライドが冗長・枚数過多・読み手不在になるのはなぜか。指示・モデル・仕組みのどれで防げるか

### xai（1）

- 2026-10-21 — [CLIP系分類器の誤り分析にXAIを使う条件](notes/2026-10-21-xai-for-clip-error-analysis.md) — 分類器が誤る画像の原因調査に説明可能AI（XAI）は有効か。どの手法を選ぶか

## 日付順

- 2026-10-29 — [少数の人ラベルでAIラベルの推定を補正するPPI・DSL・CDI](notes/2026-10-29-ppi-dsl-cdi-corrected-inference.md) — LLM/VLM が全件に付けたラベルから精度や比率などの数字を出すとき、少数の人ラベルで推定の偏りを取り除き、妥当な信頼区間を得る方法（PPI・DSL・CDI）はどう働き、何を前提にし、どれを使うか — topics: ml, labeling, evaluation, llm, human-in-the-loop
- 2026-10-27 — [AIで作るスライドの冗長さは指示でなく仕組みで抑える](notes/2026-10-27-ai-slides-verbosity-structure.md) — LLM に作らせたスライドが冗長・枚数過多・読み手不在になるのはなぜか。指示・モデル・仕組みのどれで防げるか — topics: llm, writing, evaluation
- 2026-10-27 — [曖昧な画像のラベルの持ち方とAIラベルの監査](notes/2026-10-27-ambiguous-labels-ai-audit.md) — 複数のクラスが当てはまる画像や判定できない画像のラベルをどう持つか。LLM/VLM でラベルを付けて人手を最小にするとき、人は何を見て、評価の数字をどう出すか — topics: ml, vision, labeling, evaluation, llm, human-in-the-loop
- 2026-10-27 — [LLMセキュリティの分類とCLIP画像分類器への当てはめ](notes/2026-10-27-llm-security-risks-for-clip-classifier.md) — OWASP LLM Top 10 2026 などで分類されるセキュリティ問題のうち、CLIP＋線形ヘッドの画像分類器（VLM をラベラー・難例の委譲先に使う構成）に関係するものはどれか — topics: security, ml, vision, clip, vlm, classification, labeling
- 2026-10-22 — [CLIPのテキスト側を使う精度改善手法の地図](notes/2026-10-22-clip-text-side-methods.md) — 画像側の埋め込み＋線形ヘッドで運用している CLIP 分類器に、テキストエンコーダをどう使えば精度が上がるか — topics: ml, vision, clip, classification, ood-detection
- 2026-10-21 — [AIラベリングで修正をループに組み込む設計](notes/2026-10-21-ai-labeling-revision-loop.md) — ラベルをある時点で固定せず、曖昧画像・基準変更・誤り修正を繰り返す前提で、何をどう記録し学習・評価するか — topics: ml, labeling, weak-supervision, evaluation, llm
- 2026-10-21 — [難例を上位モデルや人に委譲する実例と引き金の設計](notes/2026-10-21-deferral-to-stronger-model.md) — 安い判定器が苦手な入力だけを高精度モデルや人に回す仕組みは、どこで使われ、何を引き金にしているか — topics: ml, classification, cascade, human-in-the-loop, llm
- 2026-10-21 — [VLMを分類器の置き換えに使わない理由と使いどころ](notes/2026-10-21-vlm-as-classifier-vs-labeler.md) — 大型 VLM（PaliGemma・Gemma 系）は CLIP＋線形ヘッドの分類器を置き換えられるか — topics: ml, vision, vlm, clip, classification, labeling
- 2026-10-21 — [CLIP系分類器の誤り分析にXAIを使う条件](notes/2026-10-21-xai-for-clip-error-analysis.md) — 分類器が誤る画像の原因調査に説明可能AI（XAI）は有効か。どの手法を選ぶか — topics: ml, vision, clip, xai
