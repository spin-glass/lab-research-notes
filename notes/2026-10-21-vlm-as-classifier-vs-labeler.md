---
title: VLMを分類器の置き換えに使わない理由と使いどころ
date: 2026-10-21
topics: [ml, vision, vlm, clip, classification, labeling]
status: active
question: 大型 VLM（PaliGemma・Gemma 系）は CLIP＋線形ヘッドの分類器を置き換えられるか
sources:
  - https://arxiv.org/abs/2405.18415
  - https://huggingface.co/google/gemma-4-31B
---

## 結論

- VLM は CLIP を画像エンコーダに使っていても、ImageNet 等の標準的な画像分類で CLIP に大きく劣る（NeurIPS 2024）。主因はデータ（クラスに触れた回数）で、分類データを十分に学習させれば並ぶが、推論費用は CLIP＋線形ヘッドの桁違い。
- 使いどころは分類器の置き換えではなく、(1) 検索で引いた候補画像のラベラー (2) 難例の委譲先 (3) 曖昧画像の上位判定。ラベラーと委譲先を同系統にしない。
- モデル選定で見るのは、非英語の記述力・ライセンス・配備先（自前のクラウドプロジェクト内に置けるか）・画像トークン予算（低予算は分類向き、高予算は OCR 向き）。2026年時点では Gemma 4（Apache 2.0、140言語超、Vertex AI Model Garden から配備可）が PaliGemma 2（Gemma 2 世代、非英語が弱い）より適する。

## 根拠

- Why are Visually-Grounded Language Models Bad at Image Classification?（NeurIPS 2024）：VLM の分類性能は CLIP に劣り、原因は主に学習データ。分類データで学習させると差が縮む。
- Gemma 4 の画像トークン予算は 70・140・280・560・1120 から選べ、Google のモデルカードは低予算を分類・キャプション・動画向き、高予算を OCR・文書の読み取り向きとしている。ライセンスは Apache 2.0、140言語超で事前学習。
- Gemma 4 は Vertex AI Model Garden から自前のエンドポイントへ配備できる（Google の開発者フォーラムの手順記事、2026-04-02）。

## 適用条件

- VLM をラベラーに使うときは、既存のラベラー（別系統の LLM）と同一手順（画像あたり複数回、クラスごとに yes/maybe/no、定義文）で監査標本の一致率を測ってから使う。
- 対象画像を外部 API に送れるかは別途の確認事項。自前プロジェクト内に配備できるモデルなら、この確認が軽くなる。

## 未確認

- 日本語×画像のラベル精度、スループット、1枚あたり費用は未実測。

## 出典

- Why are Visually-Grounded Language Models Bad at Image Classification?: https://arxiv.org/abs/2405.18415
- Gemma 4 のモデルカード（Google、Hugging Face）: https://huggingface.co/google/gemma-4-31B
- Gemma 4 の画像の扱い（Google 公式）: https://ai.google.dev/gemma/docs/capabilities/vision
- End-to-end guide: Fine-tuning and serving Gemma 4 on Vertex AI: https://discuss.google.dev/t/end-to-end-guide-fine-tuning-and-serving-gemma-4-on-vertex-ai/345865
