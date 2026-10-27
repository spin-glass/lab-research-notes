---
title: AIラベリングで修正をループに組み込む設計
date: 2026-10-21
topics: [ml, labeling, weak-supervision, evaluation, llm]
status: active
question: ラベルをある時点で固定せず、曖昧画像・基準変更・誤り修正を繰り返す前提で、何をどう記録し学習・評価するか
sources:
  - https://arxiv.org/abs/1711.10160
  - https://dspace.mit.edu/entities/publication/39b0f8e0-b673-42c6-99f6-0af829bef7f5
  - https://aclanthology.org/2022.emnlp-main.731
---

## 結論

- ラベルを「観測」と「判定」の2層に分ける。観測＝何が写っているかのマルチラベル投票（LLM/VLM に複数回、属性ごとに yes/maybe/no、主要被写体、1文の理由）。判定＝版付きの規則で観測から機械的に導く最終カテゴリ。基準変更は規則の版上げと再導出で済み、再問い合わせは観測項目を足したときだけ（Snorkel のラベル関数と同じ構造）。
- ラベルは上書きせず、追記専用の出来事として残す（投票・モデル版・プロンプトのハッシュ・規則版・発火した規則ID・理由・親イベント）。「現在のラベル」は指定した規則版での最新イベントというビュー。
- 曖昧はクラスではなく状態。投票分布をそのまま教師（ソフトラベル）に使い、上位ラベラーに一度だけ挙げ、残った曖昧群はクラスタ化して規則追加の候補にする。固定するのはラベルではなく「画像集合ID＋規則版＋スナップショットID」で、モデルの予測を保存しておけば新しいスナップショットで過去モデルも推論なしに再採点できる。

## 根拠

- ラベル関数からプログラム的にラベルを導く型（Snorkel, VLDB 2017）：専門家のラベル関数は手ラベルに匹敵し、大規模な手ラベル集合との差は平均3.6%。
- モデルの予測確率とラベルの食い違いからラベル誤りを見つける confident learning（JAIR 2021, cleanlab）。モダリティ・モデル非依存、マルチラベル対応。
- 人のラベル分布で学習すると分布外への汎化と頑健性が上がる（CIFAR-10H, ICCV 2019）。ラベルのばらつきはノイズでなく信号で、投票分布をそのまま使う単純な方法が複雑な手法を上回る（Plank EMNLP 2022；Uma ら JAIR 2021）。
- 同じ LLM サービスでも版が変わると振る舞いが短期間で大きく変わり再現が難しい（GPT-4 の2023年3月版と6月版）。
- 理由を先に説明させてから付けさせる explain-then-annotate はラベル品質を上げる（AnnoLLM）。LLM のラベルと説明を検証器が採点し低点だけ再ラベルする協調型（CHI 2024）。
- 曖昧ラベルの標準：許容ラベル集合（ImageNet ReaL 方式。生票 yes/maybe/no を保存し、しきい値で集合化）。品質不能・対象外は別フラグで評価の分母から外し件数報告。集合が階層ノードに一致すればノード名で記録。
- AI ラベルの下流統計は壊れやすい（LLM hacking：最上位モデルでも約31%の仮説で結論が誤る）。少数の人ラベル＋全件の AI ラベルを PPI／DSL で補正すれば妥当な区間が出る。
- LLM 判定者は同系統の出力を高く評価する（自己選好・preference leakage）。本番の委譲先とラベラーを同系統にしない。

## 適用条件

- 4つの引き金：基準変更（規則編集→全件再導出→影響レポート）／誤り検出（cleanlab の候補＋ランダム監査で誤り率推定）／ラベラーの版更新（固定の校正標本で新旧の一致率を測ってから切替。全件付け直しはしない）／曖昧の解消（クラスタ→規則案）。
- 人手は3箇所だけ：層化ランダムの監査標本、票が割れた画像の調停（対立候補を見せ、推奨1つは見せない）、規則の採否。
- 評価は「曖昧でない部分集合の厳密精度」「全件の許容集合精度」「曖昧率」に、希少型のリコールと交換比を足す。精度の区間は PPI／DSL。
- やらないこと：最終ラベルだけを保存する。ラベラーに基準を暗黙に適用させる（基準変更のたびに全件再ラベリングになる）。maybe をノイズとして捨てる。

## 未確認

- ソフトラベル学習の効果は人の投票で示されたもの。LLM の少数票で同じかは未検証。
- 「主要被写体」の判断は観測と判定の境界にあり、基準の影響を完全には逃れない。

## 出典

- Snorkel: https://arxiv.org/abs/1711.10160
- Confident Learning（cleanlab）: https://dspace.mit.edu/entities/publication/39b0f8e0-b673-42c6-99f6-0af829bef7f5
- CIFAR-10H: https://pixl.cs.princeton.edu/pubs/Peterson_2019_HUM/index.php
- The "Problem" of Human Label Variation: https://aclanthology.org/2022.emnlp-main.731
- Learning from Disagreement（survey）: https://jair.org/index.php/jair/article/view/12752
- How Is ChatGPT's Behavior Changing over Time?: https://arxiv.org/abs/2307.09009v1
- AnnoLLM: https://arxiv.org/html/2303.16854v2
- Human-LLM Collaborative Annotation（CHI 2024）: https://megagon.ai/publications/human-llm-collaborative-annotation-through-effective-verification-of-llm-labels/
- ImageNet ReaL: https://arxiv.org/abs/2006.07159 ／ https://github.com/google-research/reassessed-imagenet
- LLM hacking: https://arxiv.org/pdf/2509.08825
- PPI++: https://arxiv.org/abs/2311.01453v2 ／ DSL: https://proceedings.neurips.cc/paper_files/paper/2023/hash/d862f7f5445255090de13b825b880d59-Abstract.html
- Preference leakage（自己選好）: https://arxiv.org/pdf/2502.01534
