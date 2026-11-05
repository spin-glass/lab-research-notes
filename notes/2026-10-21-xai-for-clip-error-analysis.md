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

## 追記 2026-11-05

「ViT 系の CLIP に Grad-CAM を当てたら画像全体に散って何も分からなかった」場合の原因と、画像全体に手がかりが広がるシーン属性のクラス（店内か外観か、のような区別）の誤り分析での手法の選び方を足す。結論は変えない。

- Grad-CAM が散るのは手法の相性で、埋め込みに情報がない証拠にはならない。CLIP の ViT で効きにくい理由は3つ報告されている。(1) CLIP は前景より背景を強調し、無関係な位置にノイズ状の活性が出る。原因は self-attention の query と key が意味の違う領域を結ぶこと（正解と逆向きの可視化）と、クラス間で共通の冗長な特徴（ノイズ状の活性）で、CNN 向けの勾配法も ViT 向けの attention 法も CLIP にそのまま当てると劣化する。学習なしで推論時の構造と特徴を手直しする CLIP Surgery で改善する。(2) 現代の ViT の多くは attention マップに artifact を持ち、情報の少ない背景の位置に高ノルムのトークンが現れる（Registers）。CLIP・DINOv2 では少数のニューロンがこのトークンを作っており、学習なしで画像の外に足したトークンへ逃がすと attention が整い、学習済みのレジスタを持つモデルと同等の下流性能になる（test-time registers）。(3) ViT への Grad-CAM は、どの表現とトークンを使うかで結果が変わり、後段の層では CLS 以外のトークンの勾配がほぼ0になって、マップが拡散するか空白になる。中間層の方が局所的になりやすい（ViT の Grad-CAM の監査）。一方、DINO で事前学習した ViT では Grad-CAM が最も忠実で局所的だった報告もあり（医用画像の2課題）、効き方は事前学習の種類に依存する。
- 候補は5系統に分けられる。①ヒートマップ（Chefer の relevance 伝播、CLIP Surgery、LeGrad、test-time registers）②成分分解（TextSpan）③概念分解（SpLiCE）④疎オートエンコーダ（SAE）⑤事例と摂動（近傍画像、遮蔽）。
- シーン属性の誤り分析では①を外す。①が答えるのは「画像のどこを見たか」で、シーン属性の手がかり（天井・照明・床、空・道路・外壁など）は画像全体に分布するので、正しく動く手法でも散ったマップになりやすい。位置の仮説が具体的に立ったときだけ LeGrad を使う（各層の attention マップに対する勾配を説明信号として全層で集約する。ViT-bigG/14 や SigLIP の集約方式にも使える）。
- ②TextSpan は、CLIP の画像表現への直接の効果が主に最後の4つの attention 層にあることを示し、ヘッドごとに出力を張るテキストの基底を求めて、形・色・位置などの役割を持つヘッドを見つける。強力だが語彙の設計と実装が重いので次点。
- ④SAE は CLIP から多くの解釈可能な概念を取り出せる（Matryoshka SAE は元の活性とのコサイン類似度0.99・疎性約80%で、120を超える概念を同定。CLIP の視覚エンコーダへの SAE の介入で LLaVA の出力を操作できた報告もある）。ただし対象の CLIP 向けに SAE を学習する必要があり、費用が最も大きいので外す。
- 推奨は結論のとおり③概念分解。シーン属性での使い方は、誤り画像（外観なのに店内と判定されたもの、その逆）を、屋内・屋外・境界にかかわる概念語（天井・照明・テーブル・通路・商業施設・看板・のれん・入口・道路・空・建物・テラス・窓・夜など）で分解し、外観の誤り画像に屋内の概念が強く出るかを見る。出れば「モデルは屋内か屋外かは捉えているが、クラスの定義（店の外から見た店先かどうか）とずれている」という仮説を支持し、出た概念で誤りを型に分けられる。
- 概念分解が成り立つのは、画像とテキストが同じ空間にある埋め込みだけ。教師あり対照学習などで射影し直した埋め込みは CLIP のテキスト空間と対応しないので、分解には元の CLIP 埋め込みを使う。
- SpLiCE の公式コードで名前を指定して読める基盤モデルは4種（OpenAI CLIP の ViT-B/32・ViT-B/16・RN50 と、open_clip の ViT-B-32）。それ以外のモデルは、encode_image と encode_text を持つモジュールと画像埋め込みの平均を渡す「独自の基盤モデル」として使う。語彙も独自のテキストファイルから埋め込み、平均を引いて正規化して渡せる（README）。
- 未確認：独自の基盤モデルで渡す画像埋め込みの平均の求め方は README に説明がない。シーン属性は多数の概念が少しずつ効くため、疎な分解では少数の概念に絞り切れない可能性がある。「クラスの定義とのずれ」が誤りの主因という仮説自体も未検証で、先に適用条件1の分離度（線形プローブ）で、埋め込みが2クラスを分けられるかを確かめる。

## 出典

- SpLiCE: https://proceedings.neurips.cc/paper_files/paper/2024/hash/996bef37d8a638f37bdfcac2789e835d-Abstract.html
- Domino: https://iclr.cc/virtual/2022/oral/6149 ／ 紹介: https://hazyresearch.stanford.edu/blog/2022-04-02-domino
- TextSpan: https://proceedings.iclr.cc/paper_files/paper/2024/hash/5085a2b8c298edeadc46b9ffe6df5f64-Abstract-Conference.html
- Sanity Checks for Saliency Maps: https://research.google/pubs/sanity-checks-for-saliency-maps/
- ECLIP: https://arxiv.org/abs/2209.07046v2
- LeGrad: https://openaccess.thecvf.com/content/ICCV2025/html/Bousselham_LeGrad_An_Explainability_Method_for_Vision_Transformers_via_Feature_Formation_ICCV_2025_paper.html
- Grad-ECLIP: https://proceedings.mlr.press/v235/zhao24p.html
- CLIP Surgery（A Closer Look at the Explainability of Contrastive Language-Image Pre-training）: https://arxiv.org/abs/2304.05653v2 ／ コード: https://github.com/xmed-lab/CLIP_Surgery
- Vision Transformers Need Registers: https://arxiv.org/pdf/2309.16588
- Vision Transformers Don't Need Trained Registers（test-time registers）: https://arxiv.org/pdf/2506.08010v5 ／ コード: https://github.com/nickjiang2378/test-time-registers
- Grad-CAM for Vision Transformers: A Systematic Taxonomy and Audit of Methodological Ambiguity in Explainable AI: https://arxiv.org/html/2608.05258v1
- Evaluating the Explainability of Vision Transformers in Medical Imaging: https://arxiv.org/abs/2510.12021v1
- LeGrad（arXiv）: https://arxiv.org/html/2404.03214v2
- Generic Attention-model Explainability for Interpreting Bi-Modal and Encoder-Decoder Transformers（Chefer ほか）: https://arxiv.org/abs/2103.15679v1
- TextSpan（論文PDF）: https://arxiv.org/pdf/2310.05916.pdf
- Interpreting CLIP with Hierarchical Sparse Autoencoders（Matryoshka SAE）: https://icml.cc/virtual/2025/poster/46435
- Sparse Autoencoders Learn Monosemantic Features in Vision-Language Models: https://github.com/ExplainableML/sae-for-vlm
- SpLiCE コード: https://github.com/AI4LIFE-GROUP/SpLiCE
