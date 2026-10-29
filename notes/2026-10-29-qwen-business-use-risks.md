---
title: 中国製オープンウェイトLLM（Qwen）の業務利用リスクと企業の対応
date: 2026-10-29
topics: [llm, security]
status: active
question: Alibaba の Qwen のような中国製 LLM を業務で使うとき、どんなリスクがあり、企業はどう対応しているか
sources:
  - https://www.nextgov.com/artificial-intelligence/2026/04/house-panels-probe-airbnb-anysphere-over-use-of-chinese-ai-models/413207/
  - https://homeland.house.gov/wp-content/uploads/2026/04/2026.04.29-Homeland-China-Select-Letter-to-Airbnb-re-PRC-AI.pdf
  - https://www.itpro.com/technology/artificial-intelligence/should-businesses-consider-using-chinese-ai-models
---

## 結論

- リスクは「推論をどこで動かすか」で3層に分かれる。①Alibaba の API・アプリを使う：入力データが中国法の及ぶ事業者に渡る。②公式の重みを自社や米国・日本のクラウドで動かす：重み自体にデータを送る経路はなく、残るのは出力の偏り（中国政府の公式見解寄り）・攻撃への弱さ・改変された重みの隠れた挙動。③使い方に関係なく残る：米中の規制・議会の調査・評判と、提供停止。2026年は③が急に重くなり、「データが漏れるか」より「後から使えなくなるか」が主な論点になった。
- 企業の対応は3型に分かれる：禁止（主にアプリ・API と政府機関）、囲い込んで使う（自社運用か米国内の事業者経由で、データを外に出さない）、出口の確保（モデルを差し替えられる設計）。
- 推奨は1つ：使うなら推論を自社の管理下（自社 GPU か、データの扱いを契約で確認したクラウド）に置き、モデル呼び出しを抽象化して差し替えられるようにする。落とした候補：全面禁止（日本語性能・費用・ライセンスの自由度という利点を捨てるが、③以外のリスクは運用で抑えられる）、Alibaba の API を直接使う（①がそのまま残る）、出自だけで判断する（改変済み重みや供給網のリスクは米国製のオープンウェイトでも同じで、出自では区別できない）。

## 根拠

### 米国の規制・調査

- 2026-04-29、米下院の国土安全保障委員会と中国特別委員会が、Airbnb と Anysphere（Cursor の開発元）に中国製モデルの利用について説明を求めた。Airbnb は顧客対応の AI に Qwen を使っており、CEO は「速くて安い」と述べていた。書簡はリスクを、中国法に基づく検閲・情報操作、安全性の低さ、中国当局への協力義務の3類型にまとめている。
- Airbnb 側は、AI 処理の大半は米国製モデルで、中国製オープンモデルの限られた利用は承認済みの米国内の事業者を経由しており、中国企業にデータを渡していないと説明した（CNBC 報道の引用、Bloomberg のインタビュー）。
- 米国務省・商務省は Qwen 3 や DeepSeek R1 などに中国語・英語の定型質問を投げ、中国の公式見解にどれだけ沿うかを採点している。新しい版ほど検閲の兆候が強いとする内部メモをロイターが報じた。
- 2026-06-08、米国防総省は Alibaba を「中国軍事企業」の 1260H リストに加えた。リスト自体に直接の制裁はないが、国防総省の契約や研究資金を制限する根拠に使われる。Alibaba は 6/23 に取り消しを求めて提訴した。
- 2026-09-10、Anthropic の脅威レポートは、Alibaba の Qwen 関係の運用者による Claude の蒸留を同社が観測した最大の事例とし、2026年5〜7月で1億5,100万回を超えたと記載した。Alibaba はコメントしていない。
- 2026-09、米政府官報（Federal Register）のサイトが公開コメントの検索に Qwen を使っていたことが分かり、指摘とほぼ同時に機能が削除された。扱っていたのは公開情報だけ。
- 2026-10-19 公表、米国土安全保障省は DeepSeek の製品を連邦の民間機関から外す命令を出した。同社の技術を使った第三者の派生製品も対象で、民間は対象外。Qwen は対象になっていない。

### 中国側の規制（提供停止のリスク）

- 2026-07、中国商務省が Alibaba・ByteDance・Z.ai と最先端モデルの海外提供を制限する案を協議したとロイターが報じた。
- 2026-10-16、中国商務省と科学技術部は、輸出を禁止・制限する技術40件（うち AI 関連23件。大規模モデル・エージェント等を含む）の草案を公表した。

### 日本の状況

- 2025-02-06、デジタル庁は政府機関向けに DeepSeek 等の業務利用について注意喚起し、NISC とデジタル庁に助言を求めて判断するよう求めた。個人情報保護委員会は、DeepSeek が取得したデータは中国のサーバーに保存され、国家情報法などの中国法が適用されると説明した。
- 2025-02、トヨタ・ソフトバンク・三菱重工が DeepSeek の利用を制限した。
- ライオンは 2025-10-08、Qwen 2.5-7B を基に自社の研究開発データで追加学習した社内 LLM の開発に着手したと発表した（AWS の支援）。
- 日経の報道として、日本企業が開発した主要モデル上位10のうち6つが DeepSeek か Qwen を基にしており、国立情報学研究所も LLM-jp の学習データ整理に Qwen を使っている（TrendForce による要約）。
- 日本企業が Qwen を選ぶ理由として、性能・費用・ライセンスの開放度・サイズの選択肢が挙げられている。
- Alibaba Cloud は 2026-06 に東京で5か所目のデータセンターを開き、国内の API 環境で Qwen の上位モデルを提供している。データの置き場所が国内でも、運営事業者は Alibaba のまま。

### 技術的な評価

- AppSOC の試験では Qwen-2.5 が試験の75.4%で失敗し、総合リスク 9.0/10 と評価された（ベンダーによる試験）。
- KELA は Qwen2.5-VL がプロンプト攻撃に弱いと報告した。
- 研究者は、Qwen3 が法輪功などの話題で中国政府の説明を事実のように述べ、モデルが知っている事実を隠す例を報告している。
- 2026-10-06、ProjectDiscovery は小型の Qwen を微調整し、隠れた合図でエージェントに資格情報を外部へ送らせる概念実証を公表した。公式の Qwen が汚染された報告ではなく、改変された重み一般の供給網リスクの例。
- 専門家は、主なリスクはデータの管理・供給網の信頼・コンプライアンス・運用にあり、重みそのものとは限らないとし、推論の場所・外に出るデータ・運営者で評価すべきと指摘している。
- Amazon Bedrock は Qwen3 系をフルマネージドで提供し、顧客データを基盤モデルの学習に使わないと説明している。

## 適用条件

| 使い方 | データの行き先 | 残るリスク | 主な対策 |
|---|---|---|---|
| Alibaba の API・アプリ | Alibaba（中国法が及ぶ事業者） | ①②③すべて | 機密・個人情報を入れない。業務利用は避ける |
| 米国・日本のクラウドのマネージド提供（Bedrock 等） | クラウド事業者（契約で学習利用なし） | ②③ | 出力の評価、エージェント権限の制限、差し替え設計 |
| 公式の重みを自社で運用 | 自社内 | ②③ | 上に加え、公式の配布元・safetensors・ハッシュ固定 |
| 第三者の改変版（微調整・マージ・検閲除去版）を運用 | 自社内 | ②③＋隠れた挙動 | 使わない。使うなら隔離環境で、ツールとネットワークの権限を与えない |

- 判断の軸：①推論がどこで動くか ②モデルの出自が問われる取引先・用途か（米国政府・防衛関連、米国向けの製品は重い）③差し替えにいくらかかるか（深く微調整して業務に組み込むほど高い）。
- 自社で運用するときの実務：重みは公式の配布元から safetensors 形式で取り、ハッシュを固定する。エージェントには最小限の権限・送信先の制限・ツール呼び出しの記録を付ける。自社データで日本語と政治的な話題の出力を確かめる。モデル呼び出しを抽象化層の後ろに置き、微調整用のデータを別に保管して、別のモデルへ移せるようにする。

## 未確認

- AppSOC・KELA の試験は Qwen 2.5 系が対象のベンダー試験で、現行の Qwen3 系での結果は確認していない。
- 中国の輸出規制は草案で、オープンウェイトの扱いと対象となる規模の基準は確定していない（2兆パラメータ以上が対象との報道は二次情報1件のみ）。
- Anthropic の帰属は「Alibaba・Qwen に関係する運用者」で、Alibaba 本体の関与は確定していない。
- 公式の Qwen の重みに隠れた挙動が見つかったという公開報告はない（概念実証のみ）。
- 国内の大手金融機関が Qwen3-32B を閉域網で微調整しているという記載は個人ブログ経由の三次情報で、一次資料を確認していない。

## 出典

- Nextgov, House panels probe Airbnb, Anysphere over use of Chinese AI models（2026-04）: https://www.nextgov.com/artificial-intelligence/2026/04/house-panels-probe-airbnb-anysphere-over-use-of-chinese-ai-models/413207/
- 米下院 国土安全保障委員会・中国特別委員会, Airbnb への書簡（2026-04-29）: https://homeland.house.gov/wp-content/uploads/2026/04/2026.04.29-Homeland-China-Select-Letter-to-Airbnb-re-PRC-AI.pdf
- Let's Data Science, Lawmakers Investigate U.S. Use of Chinese AI Models（CNBC 報道の引用）: https://letsdatascience.com/news/lawmakers-investigate-us-use-of-chinese-ai-models-1e4d147c
- Bloomberg（転載）, Airbnb's Chesky says US misunderstanding use of Chinese open-source AI models: https://www.dailygazette.com/tribune/airbnb-s-chesky-says-us-misunderstanding-use-of-chinese-open-source-ai-models/article_6cfb9935-51e5-5908-8646-efc0061ab4e4.html
- Reuters（The Standard 転載）, US scrutinizes Chinese AI for ideological bias, memo shows: https://www.thestandard.com.hk/world/article/306384/US-scrutinizes-Chinese-AI-for-ideological-bias-memo-shows
- TechCrunch, Pentagon says Alibaba, Baidu, BYD and Unitree support China's military（2026-06-08）: https://techcrunch.com/2026/06/08/pentagon-says-alibaba-baidu-byd-and-unitree-support-chinas-military/
- The Next Web, Alibaba sues the Pentagon to get off its Chinese military companies list（2026-06-24）: https://thenextweb.com/news/alibaba-sues-us-defense-department
- Fortune, Pentagon accuses Alibaba, Baidu and BYD of supporting the Chinese military（2026-06-08）: https://dc.fortune.com/2026/06/08/pentagon-accuses-alibaba-baidu-byd-china-military-companies/
- Let's Data Science, Anthropic Details Large-Scale Claude Distillation Campaigns（2026-09）: https://letsdatascience.com/news/anthropic-reports-large-scale-claude-distillation-attempts-a23fb82f
- ニューズウィーク日本版（ロイター）, 米政府サイト、中国アリババのAIモデルを検索手段に採用（2026-09-18）: https://www.newsweekjapan.jp/articles/-/334533
- Real Sound, 米国による中国AI「DeepSeek」排除（2026-10）: https://realsound.jp/tech/2026/10/post-2560195.html/amp
- Emergent, US Bans DeepSeek AI from Government Use in 2026: https://emergent.sh/news/us-bans-deepseek-ai-government-use-2026
- NST（ロイター）, Beijing is looking at curbing overseas access to China's top AI models（2026-07-08）: https://www.nst.com.my/amp/business/corporate/2026/07/1483201/beijing-looking-curbing-overseas-access-chinas-top-ai-models
- Cybernews, China moves to tighten controls on AI exports（2026-10）: https://cybernews.com/ai-news/china-moves-to-tighten-controls-on-ai-exports/
- Emergent, China Proposes AI Export Controls on Models and Chips（2026-10-16）: https://emergent.sh/news/china-proposes-ai-export-controls-models
- INTERNET Watch, DeepSeekなどの業務利用に、デジタル庁デジタル社会推進会議幹事会が注意喚起（2025-02-06）: https://internet.watch.impress.co.jp/docs/news/1660903.html
- ケータイ Watch, 「DeepSeek」の取得したデータ、中国の法律が適用 個人情報保護委員会が情報を公開（2025-02-04）: https://k-tai.watch.impress.co.jp/docs/news/1660128.html
- Asia Economy, Toyota and SoftBank Block DeepSeek as Japanese Companies Ban the AI Model（2025-02）: https://view.asiae.co.kr/en/article/2025021220204889117
- ライオン, オリジナル生成AIモデル「LION LLM」の開発を始動（2025-10-08）: https://doc.lion.co.jp/uploads/tmg_block_page_image/file/11002/20251008.pdf
- TrendForce, Chinese AI models reportedly hit 15% global share（2026-01-26、日経報道の要約を含む）: https://trendforce.com/news/2026/01/26/news-chinese-ai-models-reportedly-hit-15-global-share-in-nov-2025-fueled-by-deepseek-open-source-push/
- Business Journal, なぜ日本で中国アリババ「Qwen」を採用する企業が急増?（2025-06-24）: https://biz-journal.jp/company/post_389496.html
- 36Kr Japan, アリババ、東京に5カ所目のデータセンター開設（2026-06）: https://36kr.jp/498268/
- AppSOC, DeepSeek or Qwen for Enterprise AI? Trust Neither: https://appsoc.com/blog/deepseek-or-qwen-for-enterprise-trust-neither
- KELA, Alibaba's Qwen2.5-VL Model is Also Vulnerable to Prompt Attacks: https://www.kelacyber.com/blog/follow-up-alibabas-qwen2-5-vl-model-is-also-vulnerable-to-prompt-attacks/
- Alignment Forum, Test your interpretability techniques by de-censoring Chinese models: https://www.alignmentforum.org/posts/7gp76q4rWLFi6sFqm/test-your-interpretability-techniques-by-de-censoring-1
- Let's Data Science, ProjectDiscovery Demonstrates Open-Weight Model Backdoor Risk（2026-10）: https://letsdatascience.com/news/projectdiscovery-demonstrates-open-weight-model-backdoor-ris-1a986bfb
- Schneier on Security, Backdooring Open-Weight AI Models（2026-10-16）: https://schneier.com/blog/archives/2026/10/backdooring-open-weight-ai-models.html
- ITPro, Should businesses consider using Chinese AI models?: https://www.itpro.com/technology/artificial-intelligence/should-businesses-consider-using-chinese-ai-models
- AWS ブログ, Qwen モデルが Amazon Bedrock で利用可能に: https://aws.amazon.com/jp/blogs/news/qwen-models-are-now-available-in-amazon-bedrock
