---
title: 難例を上位モデルや人に委譲する実例と引き金の設計
date: 2026-10-21
topics: [ml, classification, cascade, human-in-the-loop, llm]
status: active
question: 安い判定器が苦手な入力だけを高精度モデルや人に回す仕組みは、どこで使われ、何を引き金にしているか
sources:
  - https://neurips.cc/virtual/2023/poster/72864
  - https://deepmind.google/blog/codoc-developing-reliable-ai-tools-for-healthcare/
  - https://lmsys.org/blog/2024-07-01-routellm/
record: https://app.notion.com/p/400600398c03812dae70f255586d8543
---

## 結論

- 「安い判定器が大半を処理し、一部だけ上位に回す」は対話AI・画像分類・モデレーション・医療で定番。引き金は3種：(a) 信頼度しきい値 (b) 学習した委譲器 (c) モデル間の不一致。
- 信頼度しきい値は、下流が特定の入力でだけ強い「専門家型」のとき・ラベルノイズ・分布シフトで失敗する（NeurIPS 2023）。残る誤りが「自信を持って間違う」型なら、しきい値をどこに置いても届かず、校正でも直らない。
- その場合の手は委譲器を別に学習すること。最適な委譲規則は「上位が当たる確率 − 下位が当たる確率」で決まり、下位の確信度はその片側の近似にすぎない。

## 根拠

| 分野 | 事例 | 安い側 → 委譲先 | 引き金 | 報告された結果 |
|---|---|---|---|---|
| 対話AI | GPT-5（2025-08） | 速いモデル → 深い推論モデル | リアルタイムの router。利用者のモデル切替・選好・正答で継続学習 | 本番稼働（数値非公開） |
| LLM | FrugalGPT（2023） | 安いLLMから順に → 高いLLM | 各段の回答を採点器が判定し、不合格なら次段へ | 最大98%の費用削減でGPT-4同等 |
| LLM | RouteLLM（ICLR 2025） | 弱いモデル → 強いモデル | 選好データで学習した router。しきい値は目標委譲率から校正 | 費用85%減・品質95%維持（強い側へ14%） |
| LLM | Hybrid LLM（ICLR 2024） | 小 → 大 | 品質差を予測する router | 大モデル呼出し最大40%減で品質低下なし |
| 画像分類 | CascadeVLM（EMNLP 2024） | CLIP → 大型VLM | CLIPのエントロピーしきい値 | 効き目はCLIPが不確実な画像に集中 |
| 画像分類 | Wisdom of Committees（ICLR 2022） | 小さいモデル → 大きい同系 | 信頼度で早期終了 | 同精度で5.4倍高速（EfficientNet-B7比） |
| 人への委譲 | Amazon A2I | ML予測 → 人のレビュー | 信頼度の業務規則＋ランダム標本の監査 | 製品として稼働 |
| 医療 | MASAI試験（2023–2026） | AIリスク点数 → 二重読影 | 点数の最上位だけ二重読影 | 読影作業44%減（中間解析） |
| 医療 | CoDoC（Nature Medicine 2023） | 予測AI → 臨床医 | AIの信頼度・臨床判断・正解だけから学習した委譲AI（画像不要） | 見逃しゼロで偽陽性25%減 |
| 理論 | Learning to defer（ICML 2020） | 分類器 → 専門家 | 分類器と棄却器を同時学習 | 学習型委譲の基礎 |

- 信頼度委譲の失敗条件と、事後に学習する委譲規則の優位：When Does Confidence-Based Cascade Deferral Suffice?（NeurIPS 2023）。小さなMLPでも過学習し得ると報告。
- スコア型の規則は「自信を持って間違う」予測を拾えない。アンサンブルの合意を引き金にする安全な委譲規則なら、カスケードは大きいモデル単体と精度で競合する（Agreement-Based Cascading, 2024）。

## 適用条件

- 残る誤りが「不確実な帯」にあるなら信頼度しきい値で足りる。「高信頼の誤り」なら委譲器を学習する。
- 委譲器の最小構成：下位モデルの埋め込み＋クラス確率と派生（最大値・マージン・エントロピー）＋予測クラス、できれば別系統の判定との不一致フラグを入力にした L2 正則化ロジスティック回帰。教師は「上位が正しく下位が誤る」。グループ分割（店舗・日付など）の交差検証で正則化を決め、しきい値は委譲率の予算（1／2／5／10%）で校正する。
- 評価は予算ごとの「正味の改善件数」と、誤って巻き込む件数との交換比。信頼度しきい値を必ず対照に置く。
- 上位が LLM/VLM なら、ラベラーと上位を同系統にしない（自己選好で評価が甘くなる）。

## 未確認

- 正例（上位が救える誤り）が少ないときに学習できる信号があるかは、データごとに試すしかない。
- LLM router の数値は対話品質のベンチマーク。画像分類とは評価軸が違う。

## 出典

- GPT-5 System Card — OpenAI: https://openai.com/index/gpt-5-system-card
- RouteLLM — LMSYS: https://lmsys.org/blog/2024-07-01-routellm/
- FrugalGPT: https://arxiv.org/abs/2305.05176
- Hybrid LLM（ICLR 2024）: https://proceedings.iclr.cc/paper_files/paper/2024/hash/b47d93c99fa22ac0b377578af0a1f63a-Abstract-Conference.html
- CascadeVLM: https://arxiv.org/abs/2405.11301
- Wisdom of Committees: https://arxiv.org/abs/2012.01988
- Amazon A2I: https://docs.aws.amazon.com/sagemaker/latest/dg/a2i-use-augmented-ai-a2i-human-review-loops.md
- MASAI（MDedge）: https://mdedge.com/content/ai-supported-breast-screens-may-reduce-radiologist-workload
- CoDoC — DeepMind: https://deepmind.google/blog/codoc-developing-reliable-ai-tools-for-healthcare/
- When Does Confidence-Based Cascade Deferral Suffice?（NeurIPS 2023）: https://neurips.cc/virtual/2023/poster/72864
- Agreement-Based Cascading: https://arxiv.org/pdf/2407.02348
- Learning to Defer（ICML 2020）: https://icml.cc/virtual/2020/poster/6448
