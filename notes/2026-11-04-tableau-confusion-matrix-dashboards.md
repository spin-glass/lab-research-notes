---
title: Tableauで混同行列と分類指標を可視化した公開作例の一覧
date: 2026-11-04
topics: [evaluation, classification]
status: active
question: Tableau で分類モデルの混同行列・Precision・Recall・F1 を可視化した公開作例にはどれがあり、それぞれ何を表示し、元のワークブックは入手できるか
sources:
  - https://github.com/dvotsis-data/Predictive-Maintenance-ML-Classification
  - https://public.tableau.com/app/profile/dimitris.votsis/viz/Predictive_Maintenance_Full_Dashboard/PredictiveMaintenanceModelEvaluationThresholdAnalysis
  - https://www.dataplusscience.com/VizConfusion.html
  - https://github.com/longenbach/Tableau-Interactive-Confusion-Matrix
  - https://powerbiseminar.com/2025/09/25/tableau-machine-learning/
---

## 結論

- 2026-11-04 時点の Web 検索（英語・日本語、計 11 回）で、題名か説明に混同行列を含む Tableau の公開作例は 7 件、作例のない作り方の記事が 2 件、BI 製品に組み込まれた機能の解説が 1 件見つかった。
- 7 件のうち、混同行列と Precision／Recall／F1 などの指標を同じ画面に置くと確認できたものは 2 件（Votsis は README とスクリーンショット一覧、Kerber は題名のみ）。元のワークブックへのリンクがあるものは 3 件（Votsis は .twbx、Data + Science は .twb、longenbach は .twbx）。3 クラス以上の混同行列は 2 件（longenbach は 4 クラス、dickholm は 3 クラス）。
- 二値分類の指標を Tableau の計算フィールドだけで出す定義（しきい値パラメータ → TP／FP／TN／FN → Precision／Recall／F1）は、2025-09 の日本語記事に一式がある。

## 根拠

### 一覧

| 作例 | 公開 | 分類 | 混同行列 | 指標の表示 | 元ファイル | 確認した範囲 |
|---|---|---|---|---|---|---|
| Votsis「Predictive Maintenance – Model Evaluation and Threshold Analysis」 | 未確認 | 二値 | テストセットの 2×2 | Precision・Recall・F1、検証データでのしきい値比較 | `Predictive_Maintenance_Full_Dashboard.twbx`（README の構成図に記載） | README 全文とスクリーンショット一覧 |
| Kerber「ConfusionMatrix-Precision-Recall」 | 2019-07-14 | 未確認 | 題名による | Precision・Recall（題名による） | 未確認 | 検索結果の題名・公開日のみ |
| Namavari & Shaffer「Visualizing a Confusion Matrix」（Data + Science） | 2017-01 | 二値（連続スコア＋cut-off） | 2×2。スコア分布のヒストグラムと TP／FP／FN／TN の色を揃える | 記事本文で Accuracy・Sensitivity・Specificity・Precision を定義。viz 上の指標表示は未確認。cut-off を変えられる | `.twb`（397,856 byte、取得可能） | 記事全文、ワークブックと Tableau Public へのリンクの応答 |
| longenbach「Tableau Interactive Confusion Matrix」 | 2020 年頃（未確認） | 4 クラス（テキスト分類） | 4×4。各セルの中に 1 サンプル＝1 点を置き、ツールチップで本文を読む | なし | `Confusion_Matrix_copy.twbx`・CSV・Colab ノートブック（README のリンク） | README 全文 |
| dickholm「Effective use of Colors, Shapes, and Confusion Matrix」 | 未確認 | 3 クラス（Iris を k-means で分類） | あり（説明文による） | 未確認 | 未確認 | 検索結果の説明文のみ |
| Liu Zhang「Understanding Confusion Matrix」 | 未確認 | 未確認 | あり（説明文による。手で動かして理解する教材型） | 未確認 | 未確認 | 検索結果の説明文のみ |
| Jay Trivedi「Confusion Matrix」 | 2023 年頃 | — | 説明文はレイアウトコンテナの使い方で、モデル評価の作例ではない | — | — | 検索結果の説明文のみ |
| powerbiseminar「Tableau × 機械学習 実務ロードマップ」 | 2025-09-25 | 二値 | 作例なし | 計算フィールドの定義一式 | — | 記事全文 |
| The Data School AU「Classification Model Deployment in Tableau」 | 未確認 | 二値（Titanic） | 作例なし。正解と予測を並べた表 | Accuracy | — | 記事の要約 |
| Mehta「Confusion Matrix and ROC in Salesforce Tableau」 | 2021 年頃 | 二値 | Einstein Discovery の Threshold Evaluation ページに組み込み | Accuracy・Recall・Precision・F1・MCC など | — | 記事の要約 |

### 各作例

- Votsis：産業設備のセンサーデータ（約 124,000 行、1,169 台、故障 106 件＝約 0.085%）を Random Forest で二値分類した個人プロジェクト。Tableau のダッシュボードは 2 枚で、「Model Evaluation and Threshold Analysis」がテストセットの混同行列・Precision・Recall・F1・検証データでのしきい値比較を表示する。README の構成図では `03_Tableau/Predictive_Maintenance_Full_Dashboard.twbx` と、`05_Output/` に `confusion_matrix_results.csv`・`threshold_comparison.csv`・`model_evaluation_metrics.csv` が置かれている。しきい値 0.10 でのテスト結果として Precision 1.96%、Recall 16.67%、F1 3.51%、TP 3・FP 150・TN 24,736・FN 15 が README に記載されている（[GitHub README](https://github.com/dvotsis-data/Predictive-Maintenance-ML-Classification)、[Tableau Public](https://public.tableau.com/app/profile/dimitris.votsis/viz/Predictive_Maintenance_Full_Dashboard/PredictiveMaintenanceModelEvaluationThresholdAnalysis)）。
- Kerber：Tableau Public の検索結果に題名「ConfusionMatrix-Precision-Recall」、First Published Date 2019-07-14 と表示される（[Tableau Public](https://public.tableau.com/app/profile/thuha.kerber/viz/ConfusionMatrix-Precision-Recall/Dashboard)）。
- Namavari & Shaffer：連続スコアを cut-off で二値化する場面を対象にし、R でサンプルデータを生成して CSV に書き出し、Tableau で 2×2 の混同行列とスコア分布のヒストグラムを同じ色分け（TP＝濃い橙、FN＝薄い橙、FP＝濃い青、TN＝薄い青）で並べる。cut-off を下げると FP 率が上がり FN 率が下がる挙動を Tableau Public 上で動かせる。本文は Accuracy だけで評価しない理由（不正検知で陽性 3% のとき全件を陰性と判定しても Accuracy 97%）を挙げている。記事内のリンク先は [Tableau Public の viz](https://public.tableau.com/views/VizTheConfusion/VizTheConfusion)（作者プロフィール `hamed` の `VizTheConfusion` へ転送）と [ワークブック .twb](https://public.tableau.com/workbooks/VizTheConfusion.twb)（content-type `application/x-twb`、397,856 byte）で、2026-11-04 にどちらも HTTP 200 を返した（[記事](https://www.dataplusscience.com/VizConfusion.html)）。
- longenbach：Google のテキスト投稿にコードのタグ（Python・C・Java・HTML）を付ける 4 クラス分類。各投稿に LabelEncoder で整数ラベルを付け、真ラベルと予測ラベルを基準にしたランダムな (x, y) 座標を与えて CSV に書き出し、Tableau の混同行列の各セル内に 1 投稿＝1 点として配置する。誤分類されたテキストをツールチップで読めるようにする構成で、指標の表示は README に記載がない。README は Colab ノートブック・CSV・`Confusion_Matrix_copy.twbx` へのリンクを置く（[GitHub](https://github.com/longenbach/Tableau-Interactive-Confusion-Matrix)）。
- dickholm：説明文は「Bora Berin の R の kmeans() による Fisher の Iris 分類を作り直し、色と形を改善して混同行列を導入した」とする（[Tableau Public](https://public.tableau.com/app/profile/dickholm/viz/Distinctivecolorsfordiscretemeasures/EffectiveuseofColorShapeandConfusionMatrix)）。
- Liu Zhang：説明文は「混同行列は紛らわしいので、手を動かして理解する構成」とする（[Tableau Public](https://public.tableau.com/app/profile/liu.zhang/viz/UnderstandingConfusionMatrix/PublicPage)）。
- Jay Trivedi：説明文は Tableau のコンテナの使い方に関するもので、ハッシュタグに machinelearning・confusionmatrix を含むが、モデル評価の作例であることを示す記述はない（[Tableau Public](https://public.tableau.com/app/profile/jay.trivedi/viz/ConfusionMatrix_16939167028290/ConfusionMatrix)）。
- powerbiseminar（2025-09-25）：作例ではなく設計の解説。二値分類の計算フィールドとして、しきい値をパラメータにし、予測クラス＝確率 ≥ しきい値、TP／FP／TN／FN＝予測クラスと実績の組み合わせを INT() で 0/1 にしたもの、Precision＝SUM(TP)/(SUM(TP)+SUM(FP))、Recall＝SUM(TP)/(SUM(TP)+SUM(FN))、F1＝2PR/(P+R) を、分母 0 のとき Null を返す IIF で囲む形で定義している。実装パターンは A（バッチ推論の結果テーブルを DWH に置き Tableau は参照のみ）、B（Analytics Extensions＝TabPy 等でセミリアルタイム推論）、C（書き込み拡張で人の判断を加える）の 3 つに分け、A を推奨としている。同記事は、しきい値を固定すると実態とずれ続けるため、パラメータ化して Precision／Recall を見ながら調整することも挙げている（[記事](https://powerbiseminar.com/2025/09/25/tableau-machine-learning/)）。
- The Data School AU：TabPy で Titanic の決定木をデプロイし、Passenger Id ごとに正解の Survived と予測の Survived_prediction を並べた表と Accuracy を Tableau で表示する（[記事](https://www.thedataschool.com.au/blogs/part-2-classification-model-deployment-in-tableau/)）。
- Mehta：Salesforce Tableau（Einstein Discovery）の Threshold Evaluation ページに混同行列・しきい値・ROC 曲線が組み込まれており、Accuracy・TPR（Recall）・Precision・F1・MCC・Informedness・Markedness を計算例付きで解説する（[記事](https://sanjeev-mehta.medium.com/how-confusion-matrix-and-roc-in-salesforce-tableau-help-analyze-predictions-f7db816a2cd9)）。

### 検索の範囲

- 検索語（英語）：Tableau Public confusion matrix dashboard／machine learning model evaluation dashboard precision recall confusion matrix／how to build confusion matrix in Tableau heatmap calculated field／public.tableau.com confusion matrix viz／model performance monitoring dashboard classification metrics／"confusion matrix" Tableau Public workbook／HighVizAbility confusion matrix cut-off／"confusion matrix" heatmap classification model accuracy／"model evaluation" dashboard classification precision recall F1 viz
- 検索語（日本語）：Tableau 混同行列 可視化 ダッシュボード／Tableau 混同行列 作り方／Tableau 機械学習 分類モデル 評価 ダッシュボード 混同行列 Precision Recall 可視化
- 日本語の検索では Tableau の作例は見つからず、相関行列の作り方（note・個人ブログ）と上記 powerbiseminar の記事が該当した。

## 適用条件

- Votsis・powerbiseminar・Data + Science の方式は二値分類で、Tableau 側に「1 行＝1 サンプル（実績ラベルと予測確率または予測ラベル）」の縦持ちデータか、集計済みの TP／FP／TN／FN が要る。しきい値をパラメータで動かす作り（Data + Science、powerbiseminar）は予測確率などの連続スコアの列が前提。
- longenbach の方式は多クラスで、サンプルごとに真ラベル・予測ラベルの整数値とセル内の座標を事前に計算して CSV に持たせる。
- Mehta の記事が扱う混同行列・ROC は Salesforce Tableau（Einstein Discovery）の機能で、Tableau Desktop／Public のワークブックではない。

## 未確認

- Kerber・dickholm・Liu Zhang・Jay Trivedi の Tableau Public ページは JavaScript で描画され、本文を取得できなかった。表示内容・シート構成・ワークブックのダウンロード可否は検索結果の題名と説明文以外で確認していない。
- Votsis の Tableau Public 側の公開日、`.twbx` の実在と中身（GitHub のファイル一覧は取得できず、README の記載による）。
- longenbach の `.twbx`・CSV の実在（README のリンクによる。ファイルの直接取得は未実施）。GitHub リポジトリの作成日。
- 各ワークブックが現行の Tableau Desktop／Public で開けるか。Data + Science の `.twb` は 2017 年公開で、取得はできたが開いていない。
- 検索は 2026-11-04 の計 11 回で、Tableau Public 内の検索機能は使っていない。網羅していない。

## 出典

- https://github.com/dvotsis-data/Predictive-Maintenance-ML-Classification
- https://public.tableau.com/app/profile/dimitris.votsis/viz/Predictive_Maintenance_Full_Dashboard/PredictiveMaintenanceModelEvaluationThresholdAnalysis
- https://public.tableau.com/app/profile/thuha.kerber/viz/ConfusionMatrix-Precision-Recall/Dashboard
- https://www.dataplusscience.com/VizConfusion.html
- https://public.tableau.com/views/VizTheConfusion/VizTheConfusion
- https://public.tableau.com/workbooks/VizTheConfusion.twb
- https://github.com/longenbach/Tableau-Interactive-Confusion-Matrix
- https://public.tableau.com/app/profile/dickholm/viz/Distinctivecolorsfordiscretemeasures/EffectiveuseofColorShapeandConfusionMatrix
- https://public.tableau.com/app/profile/liu.zhang/viz/UnderstandingConfusionMatrix/PublicPage
- https://public.tableau.com/app/profile/jay.trivedi/viz/ConfusionMatrix_16939167028290/ConfusionMatrix
- https://powerbiseminar.com/2025/09/25/tableau-machine-learning/
- https://www.thedataschool.com.au/blogs/part-2-classification-model-deployment-in-tableau/
- https://sanjeev-mehta.medium.com/how-confusion-matrix-and-roc-in-salesforce-tableau-help-analyze-predictions-f7db816a2cd9
