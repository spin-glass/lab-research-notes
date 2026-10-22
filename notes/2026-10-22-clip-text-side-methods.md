---
title: CLIPのテキスト側を使う精度改善手法の地図
date: 2026-10-22
topics: [ml, vision, clip, classification, ood-detection]
status: active
question: 画像側の埋め込み＋線形ヘッドで運用している CLIP 分類器に、テキストエンコーダをどう使えば精度が上がるか
sources:
  - https://cvpr2023.thecvf.com/virtual/2023/poster/21016
  - https://openaccess.thecvf.com/content/CVPR2022/html/Wortsman_Robust_Fine-Tuning_of_Zero-Shot_Models_CVPR_2022_paper.html
  - https://proceedings.neurips.cc/paper_files/paper/2023/hash/123a18dfd821c8b440f42a00a27648d6-Abstract.html
record: https://app.notion.com/p/3fe600398c0381269eb1e9a090bb0ff4
---

## 結論

- テキストが効く経路は3つ：(1) 希少な型の決定境界をテキストで補う（少数ショット領域）(2) 多数ショットでも損失・重みにテキストを入れて分布内精度と頑健性を上げる (3) ラベルのない母集団にテキスト分類器で擬似ラベルを付け、視覚側を微調整する。
- 「多数ショットではテキスト系は効かない」は誤り。WiSE-FT は ImageNet 分布内+1.6pt・転移7データセットで+0.8〜3.3pt、FLYP は全量で LP-FT 比 分布内・分布外とも+1pt超。少数ショット向け手法（LP++・CLAP・Cross-modal adaptation）は、全体は多数ショットでも「残る誤りが希少な型」なら当たる。
- 語を「点数」に使う手法（NegLabel 系：EOE・AdaNeg・LoCoOp）は語の選定に支配され、誤棄却との交換比で詰まりやすい。語を「検索」に使ってラベルを集める方が採用のハードルが低い。検証は費用ゼロの T0（プロンプト言語の比較、重みの補間、テキスト錨の線形プローブ、テキスト標本の追加）→T1（属性ヘッドのテキスト学習、擬似ラベルで投影層の微調整、検索ラベリング）→T2（対照損失での微調整）の順で、各段で希少型のリコールと交換比が改善した系統だけ次へ進める。

## 根拠

| 系統 | 手法 | テキストの使い方 | 報告された効果（領域） | 費用 |
|---|---|---|---|---|
| 重みの合成 | WiSE-FT（CVPR 2022） | ゼロショット重みと学習済み重みを線形補間 | 分布内+1.6pt、分布シフト+4〜6pt。追加計算なし | ゼロ |
| テキスト錨の線形プローブ | LP++／CLAP（CVPR 2024） | ヘッドの重みをテキスト埋め込みの関数に／原型からの乖離を罰する | 1〜16ショットで強い（1ショット平均63.4%） | 低 |
| テキストを訓練標本に | Cross-modal adaptation（CVPR 2023） | クラス名のテキスト埋め込みを追加標本に | 「2ショット＋テキスト＞3ショット」。決定境界を正則化 | 低 |
| テキストだけで多ラベル学習 | TaI-DPT（CVPR 2023） | 文章を画像の代わりにプロンプト学習 | 画像なしで CoOp 16ショットに匹敵、画像と併用でさらに向上 | 低〜中 |
| ラベル無しの微調整 | LaFTer（NeurIPS 2023） | LLM 説明文でテキスト分類器→擬似ラベル→視覚側を PEFT | ゼロショット比 平均+3.8%（最大+11.7%） | GPU 小〜中 |
| 対照損失での微調整 | FLYP（CVPR 2023） | クラス定義文との対照損失で両エンコーダを微調整 | LP-FT 比+1pt超、標準 FT 比で分布外+4.2pt。交差エントロピーを足すと劣化 | GPU 中 |
| 説明文での微調整 | VeCLIP／LaCLIP／FashionCLIP | VLM・LLM の説明文を正例テキストに。ドメインの対で微調整 | 検索で最大+25%、ドメイン内ゼロショット向上。短い合成説明文の方が効く（CLIPS） | GPU 中 |
| 言語の選択 | Babel-ImageNet（ACL 2024） | 多言語 CLIP を100言語で評価 | 英語と高リソース言語の間にも大差。プロンプトは英語と対象言語を併用 | ゼロ |
| 属性検出の限界 | OVAD（CVPR 2023） | テキストで属性を検出 | CLIP 系 mAP 16〜17 対 教師あり48。テキストだけの属性検出は弱い | — |
| 概念ボトルネック | LaBo（CVPR 2023） | 概念文のスコアを線形結合 | 1ショットで+11.7%、全量では線形プローブをやや下回る | 低 |
| 合成データ | ALIA／He ら（2023） | 言語誘導で学習画像を生成・編集 | 効果は実画像が増えると薄れる。公式リポジトリでも従来拡張に逆転された例 | GPU 中 |
| 多数ショットの一般則 | ELEVATER（NeurIPS 2022） | — | 微調整は20ショット超で線形プローブを上回り、5ショットでは下回る | — |

- テキスト側を使う手法はどれも、画像特徴が投影後の共有空間（L2 正規化）にあることが前提。ヘッドの入力が投影前なら配管の変更が要る。
- プロンプトのアンサンブル（CLIP 原論文で+3.5%）は全案の前提。記述文の効き目の大半はアンサンブル由来（WaffleCLIP）。

## 適用条件

- 残る誤りが希少な見た目の型に偏るなら、少数ショット向け手法をその型の補助ヘッドに当てる。全体精度は多数ショットなので微調整系が本命。
- 属性（容器・包装・棚など）の検出はテキストだけで済ませず、VLM の投票ラベルと併用する。
- 評価は画像集合を固定し、ラベルは規則版＋スナップショット ID で指定。対照は線形プローブと WiSE-FT。

## 未確認

- 効果量はすべて英語 CLIP・公開ベンチマーク。多言語 ViT-H と実務画像で同じかは未検証。
- FLYP の LoRA 版は自前実装。ViT-H 級の微調整費用は要見積もり。

## 出典

- FLYP: https://cvpr2023.thecvf.com/virtual/2023/poster/21016
- WiSE-FT: https://openaccess.thecvf.com/content/CVPR2022/html/Wortsman_Robust_Fine-Tuning_of_Zero-Shot_Models_CVPR_2022_paper.html
- LP++: https://openaccess.thecvf.com/content/CVPR2024/html/Huang_LP_A_Surprisingly_Strong_Linear_Probe_for_Few-Shot_CLIP_CVPR_2024_paper.html ／ CLAP: https://arxiv.org/abs/2312.12730
- Cross-Modal Few-Shot Learning: https://openaccess.thecvf.com/content/CVPR2023/html/Lin_Multimodality_Helps_Unimodality_Cross-Modal_Few-Shot_Learning_With_Multimodal_Models_CVPR_2023_paper.html
- TaI-DPT: https://arxiv.org/pdf/2211.12739
- LaFTer: https://proceedings.neurips.cc/paper_files/paper/2023/hash/123a18dfd821c8b440f42a00a27648d6-Abstract.html
- VeCLIP: https://mlanthology.org/eccv/2024/lai2024eccv-veclip ／ FashionCLIP: https://arxiv.org/pdf/2204.03972 ／ CLIPS: https://arxiv.org/html/2411.16828v1
- Babel-ImageNet: https://arxiv.org/html/2306.08658v1
- OVAD: https://cvpr.thecvf.com/media/cvpr-2023/Slides/21647.pdf
- LaBo: https://arxiv.org/pdf/2211.11158
- ALIA: https://neurips.cc/virtual/2023/poster/72570 ／ Is synthetic data ready?: https://arxiv.org/pdf/2210.07574
- ELEVATER: https://arxiv.org/pdf/2204.08790
- NegLabel: https://arxiv.org/abs/2403.20078 ／ EOE: https://proceedings.mlr.press/v235/cao24d.html ／ AdaNeg: https://proceedings.neurips.cc/paper_files/paper/2024/hash/4462db5eee6823b2abad0d1f955e187a-Abstract.html
- CLIP 原論文: https://arxiv.org/abs/2103.00020 ／ WaffleCLIP: https://arxiv.org/abs/2306.07282
