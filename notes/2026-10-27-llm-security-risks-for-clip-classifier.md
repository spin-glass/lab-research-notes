---
title: LLMセキュリティの分類とCLIP画像分類器への当てはめ
date: 2026-10-27
topics: [security, ml, vision, clip, vlm, classification, labeling]
status: active
question: OWASP LLM Top 10 2026 などで分類されるセキュリティ問題のうち、CLIP＋線形ヘッドの画像分類器（VLM をラベラー・難例の委譲先に使う構成）に関係するものはどれか
sources:
  - https://genai.owasp.org/resource/owasp-genai-llm-top-10-2026/
  - https://nvlpubs.nist.gov/nistpubs/ai/nist.ai.100-2e2025.pdf
  - https://arxiv.org/abs/2106.09667
---

## 結論

- 分類の軸は2つ要る。OWASP LLM Top 10 2026 は「LLM をアプリの部品に組み込んだとき」の10リスクで、CLIP 分類器そのものには半分しか当たらない。CLIP 側は NIST AI 100-2 E2025 の予測AI向け3区分（回避・汚染・プライバシー）で見る。両方を当てると、CLIP＋VLM 構成で実際に効く問題は5つに絞れる：①事前学習モデルの供給網（LLM04）②投稿画像による回避（文字入り画像・敵対的摂動。OWASP の枠外、NIST の evasion）③学習ループへの汚染（LLM05）④VLM ラベラー・委譲先への画像経由プロンプトインジェクション（LLM01）⑤埋め込みの保存によるプライバシー（LLM09）。
- 優先順位は「投稿画像を直接読む段」が上。①と②は利用者が投稿した画像だけで成立し、追加の権限が要らない。VLM へのインジェクション（④）は、VLM にツールも外部送信もさせず出力を構造化して受けるなら、被害は「誤ラベル1件」に収まる。
- 推奨は1つ：モデルを騙されない前提で守らず、段ごとに入力の信頼度と出力の到達範囲を区切る（OWASP 2026 の冒頭が全項目に置いた姿勢）。具体的には、事前学習モデルはハッシュ固定＋安全な直列化形式で読み、VLM は道具なし・構造化出力・結果は監査対象のラベルとして扱い、投稿画像で学習するヘッドは再学習前に汚染検査を入れる。落とした候補：入力フィルタで回避を防ぐ（文字検出だけでは敵対的摂動に効かない）、VLM の指示文で「画像内の指示は無視」と書く（OWASP は指示文のみの防御を部分的と評価）。

## 根拠

- OWASP Top 10 for LLM Applications 2026（表紙 2026-08-04、v1.0）は、実インシデント 7,714 件を分類器で分類したうえで実務者投票 3/4・データ 1/4 の重みで順位を決めた。冒頭の方針は「騙されないモデルを作ろうとするのをやめ、騙されても重要なものが壊れないよう周囲を作る」。本リストはモデルがアプリの部品であるときの範囲で、ツール・記憶・下流への作用を持つ場合は Agentic Top 10 と併読する。
- 同文書の LLM01 は、画像・音声に埋め込んだ指示によるクロスモーダル攻撃を 2026 版で取り込んだ。対策の1番目（指示文で役割と能力を縛る）を「部分的な対策」と明記し、権限側の対策（資格情報と状態変更はアプリ側に置く、Rule of Two）を負荷の中心に置いている。
- 同文書の LLM09 は、CLIP や ColPali のようなクロスモーダルエンコーダを名指しし、画像1枚で文字クエリに近い埋め込みを作る「多モーダル埋め込み汚染」を挙げている（MM-PoisonRAG、One Pic is All it Takes を引用）。文字ベースの検査では画像の中身は見えないと述べる。
- 同文書の LLM04・LLM05 は、公開ハブの事前学習モデル・LoRA・変換ボット・名前空間の再利用・pickle 直列化・ONNX の計算グラフに埋めたバックドア（ShadowLogic）を供給網の攻撃面として挙げ、署名は由来の証明であって安全の証明ではないとする。
- NIST AI 100-2 E2025（2025-03）は、予測AI向けの攻撃を回避（evasion）・汚染（poisoning）・プライバシー侵害の3区分、生成AI向けを別区分で整理している。CLIP 分類器は前者で扱う。
- Carlini & Terzis（ICLR 2022）：CLIP 型の対照学習では、学習データの 0.01%（Conceptual Captions 300万件中約300枚）を汚染すればパッチで誤分類させるバックドアが入り、標的型の汚染は 0.0001%（3枚）で成立する。Web 収集データで学習した公開モデルは、この検査を使う側ができない。
- 文字入り画像による回避（typographic attack）：ゼロショット頑健性のベンチマーク（arXiv 2403.10499）では、画像に別クラスの文字を載せるだけで CLIP の平均精度が 34.74% 下がり、ImageNet-T の ViT-B/32 で 75.03%→45.06%。Dyslexify（ICLR 2026）は CLIP 後半層の文字を読むアテンションヘッドを止める学習不要の防御で、typographic ImageNet-100 の精度を最大 22.06 ポイント回復し、通常精度の低下は 1% 未満。
- 敵対的摂動：同ベンチマークで ℓ∞ ε=8/255 のブラックボックス攻撃（NES）に対し、CLIP の ViT-B/16 は 42.80%（標準モデル 75.50%）。
- VLM への画像経由の指示：Clusmann ら（Nature Communications 2025、腫瘍画像）は画像内に埋めた指示で複数の視覚言語モデルの出力を変えた。OWASP LLM01 のシナリオ #6 が「人の目に見えない閾値以下の埋め込み」として引用。
- CLIP の学習データ漏えい：LeakyCLIP（arXiv 2508.00756）は文字から学習画像を復元する手法で、高忠実度の復元は LAION 部分集合で 4.2%、顔画像で 5.68%、学習データに含まれていたかの推定は 83〜91%。画像埋め込みを外に出すことは、元画像を出すのと同等とみなす根拠になる。
- 推論費用の攻撃：OWASP LLM06 は視覚言語モデルへの敵対的画像入力で出力トークンを膨らませる攻撃（Gao ら 2025）をシナリオに含める。VLM を投稿画像に対して大量に回す構成では費用上限の制御が要る。

## 適用条件

想定する構成：公開ハブの事前学習 CLIP を凍結し、画像側の埋め込み＋線形ヘッドで分類。VLM（外部 API または自前配備）をラベラーと難例の委譲先に使い、ラベルの修正をループで回す。利用者が投稿した画像を分類し、埋め込みを保存する。

| 段 | 入力の信頼度 | 当たる区分 | 関係の強さ | 効く対策 |
|---|---|---|---|---|
| 事前学習モデルの取得 | ハブの第三者 | LLM04 供給網／LLM05 汚染（NIST poisoning） | 強。0.01% の汚染で入るバックドアは使う側で検出できない | ハッシュ固定・safetensors 以外を読まない・署名と由来の確認・変換ボットを経由しない。バックドアは消せない前提で、パッチ付き画像の挙動を監査標本で見る |
| ゼロショット／線形ヘッドで分類 | 投稿画像（非信頼） | NIST evasion（OWASP の枠外） | 強。文字入り画像だけで誤分類する | 文字を読む回路の無効化（Dyslexify 型）か、文字検出で別経路へ。敵対的摂動は分類の閾値だけでは止まらないので、誤分類の損失が大きい用途だけ対策 |
| VLM ラベラー・難例の委譲 | 投稿画像（非信頼） | LLM01 プロンプトインジェクション（画像経由） | 中。VLM に道具と外部送信がなければ被害は誤ラベルに限定 | 道具を与えない・構造化出力で受ける・結果を監査対象のラベルとして扱い確定ラベルにしない。指示文の「画像内の指示は無視」は補助 |
| ラベルの修正ループ・ヘッドの再学習 | 投稿画像＋AI ラベル | LLM05 汚染（学習ループ） | 中。投稿画像で学習するなら少数の画像で標的型の汚染が可能 | 再学習の入力に異常検知と出所の記録、学習に使う画像の出所を分ける、監査標本の精度を再学習ごとに比較 |
| 埋め込みの保存・共有 | 自社データ | LLM09／LLM02（NIST privacy） | 中。埋め込みは元画像と同等に扱う | 埋め込みの保管を元画像と同じ機密区分に、外部へ出さない、削除時に埋め込みも消す |
| VLM の推論費用 | 投稿画像 | LLM06 無制限の消費 | 弱〜中。大量実行時のみ | 画像あたりのトークン上限と総額上限 |
| VLM の指示文・ツール定義 | 自社 | LLM08 隠しコンテキスト | 弱 | 秘密を指示文に入れない |
| VLM の出力の受け取り | VLM | LLM10 出力処理 | 弱 | JSON スキーマ検証、shell・SQL に渡さない |
| 道具を持つエージェント | — | LLM03 過剰な権限 | 分類器では該当なし | 開発環境のコーディングエージェント側の問題として別に扱う |

- OWASP LLM02（機微情報の開示）のうち「外部 API に画像を送ること」は、組織の一般的なデータ提供の問題でありここでは扱わない。扱うのは埋め込み・ログ・推論痕跡から元データが戻る経路。
- 「観覧車が料理に分類される」ような自然な分布外の誤りは、攻撃でなく頑健性の問題。ただし同じ経路を攻撃者が意図的に使えば回避攻撃になるため、分布外検出の対策と回避の対策は同じ場所に置ける。

## 未確認

- 本ノートの「関係の強さ」は OWASP と NIST の区分に公開研究を当てた判断で、実運用の画像で回避や汚染を再現してはいない。
- Dyslexify の公開モデルが日本語の文字入り画像に効くかは未確認（論文は英語の ImageNet-100 で評価）。
- Clusmann らの論文本文は取得できず（出版社サイトが拒否）、OWASP の引用と二次資料に依拠。
- LeakyCLIP は学習データの復元であり、保存した画像埋め込みから元画像を復元する攻撃の成功率は本ノートでは確認していない。

## 出典

- OWASP Top 10 for LLM Applications 2026（v1.0 PDF）: https://genai.owasp.org/resource/owasp-genai-llm-top-10-2026/
- NIST AI 100-2 E2025 Adversarial Machine Learning: A Taxonomy and Terminology of Attacks and Mitigations: https://nvlpubs.nist.gov/nistpubs/ai/nist.ai.100-2e2025.pdf
- Carlini & Terzis, Poisoning and Backdooring Contrastive Learning（ICLR 2022）: https://arxiv.org/abs/2106.09667
- Benchmarking Zero-Shot Robustness of Multimodal Foundation Models: A Pilot Study（arXiv 2403.10499）: https://arxiv.org/abs/2403.10499
- Dyslexify: A Mechanistic Defense Against Typographic Attacks in CLIP（ICLR 2026）: https://arxiv.org/abs/2508.20570
- LeakyCLIP: Extracting Training Data from CLIP（arXiv 2508.00756）: https://arxiv.org/abs/2508.00756
- MM-PoisonRAG: Disrupting Multimodal RAG with Local and Global Poisoning Attacks（ICLR 2026）: https://arxiv.org/abs/2502.17832
- Clusmann et al., Prompt injection attacks on vision language models in oncology（Nature Communications 2025）: https://www.nature.com/articles/s41467-024-55631-x
- Invisible Injections: Exploiting Vision-Language Models Through Steganographic Prompt Embedding（arXiv 2507.22304）: https://arxiv.org/abs/2507.22304
- CSA, Image-Based Prompt Injection: Hijacking Multimodal LLMs Through Visually Embedded Adversarial Instructions（2026）: https://labs.cloudsecurityalliance.org/research/csa-research-note-image-prompt-injection-multimodal-llm-2026/
