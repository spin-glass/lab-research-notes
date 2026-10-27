---
title: AIで作るスライドの冗長さは指示でなく仕組みで抑える
date: 2026-10-27
topics: [llm, writing, evaluation]
status: active
question: LLM に作らせたスライドが冗長・枚数過多・読み手不在になるのはなぜか。指示・モデル・仕組みのどれで防げるか
sources:
  - https://arxiv.org/abs/2310.03716
  - https://arxiv.org/abs/2411.07858
  - https://github.com/spin-glass/tool-slides/blob/main/experiments/2026-09-30-model-vs-skill/README.md
record: https://app.notion.com/p/3e6600398c038173abdcef9a34be981f
---

## 結論

- 冗長さは LLM の訓練と不確実さから来る性質で、「簡潔に」と頼んでも安定しては消えない。長さだけの報酬で RLHF の改善の大半が再現され、GPT-4 は簡潔に答えるよう求めても応答の約半数が情報を落とさず縮められる長さだった。推奨は1つ：書き始める前に聴衆・望む行動・持ち時間を確かめ、タイトルだけの骨子を先に承認し、字数・枚数の上限を機械で数えて、終了時のフックで不合格のまま終わらせない。
- 自前の検証（画像で説明するデッキ）では、出来を決めたのはモデルではなく入力の3点だった。3点を依頼で渡すと、仕組み（スキル）なしでも Claude の3モデルとも盲検評価の総合が 5.0（5点満点）で、3点なしで作り切らせると 2.5〜3.5。仕組みが確実に効いたのは、3点が無いと聞き返して止まる入口と、型の合否（10回中10回 対 8回中1回）だった。
- 中身の正しさも、注意を促す規則では上がらず、照合の仕組みで上がった。「元の大きさで1枚ずつ見る」「ラベルを疑う」を足した版は、画像との食い違いが 2.4% から 2.2% で差が見えず、費用だけが増えた。写真ごとの確認表・枚数をコードで数える・タイトルの枚数を写真と照らす、を足した版は、3分野12本すべてで確定した中身の誤りが0件だった。

## 根拠

| 系統 | 手法 | 何をするか | 報告された効果（領域） | 費用 |
|---|---|---|---|---|
| 指示 | 「簡潔に」と頼む | プロンプトで短さを求める | 簡潔に求めても GPT-4 の応答の 50.40% が縮められる長さ（QA、Zhang ら 2024） | ゼロ |
| 入口の確認 | 聴衆・望む行動・持ち時間がそろうまで書かない | 足りなければ質問して止まる | 3点ありの 5.0 に対し、3点なしで作り切ると 2.5〜3.5（自前の検証、評価者は Claude） | 低 |
| 段階生成 | 骨子を作ってから枚ごとに作る | 文書→骨子→各スライド | 直接の生成に対し、読みやすさ 3.90 対 2.30、下書きとしての使いやすさ 3.20 対 1.20（DocPres、論文5本・評価者2名の小規模評価） | 低 |
| 骨子の承認 | タイトルだけの下書きで先に合意する | 約20%完成のゴーストデッキ | 効果量の報告なし（コンサル実務） | 低 |
| 削る | 余計な素材を除く（coherence） | 関係の薄い文・図を消す | 23件中23件の実験で支持、中央値 0.86（教育研究） | ゼロ |
| 足す | 見出し・強調で道しるべを付ける（signaling） | 構造の手がかりを足す | 28件中24件の実験で支持、中央値 0.41（教育研究） | ゼロ |
| 重ねない | 話す文を画面に重ねない（redundancy） | 発話と同じ文は画面から外す | 16件中16件の実験で支持、中央値 0.86（教育研究） | ゼロ |
| 機械検査 | 字数・枚数・語の lint | 数えて違反を出す | lint 自体の効果量は未測定。人が欠陥を見分けにくいことが根拠（下記 Kosslyn ら） | 低 |
| 強制 | 終了時のフックで lint を回す | 不合格なら終わらせず直させる | 効果量なし。フックは「LLM が選ぶのに頼らず、決まった動作が必ず起きる」仕組み（Claude Code 公式） | 低 |
| モデル | 上位のモデルに替える | — | 3点を渡せば Fable 5.1・Opus 5.5・Sonnet 5.5 とも 5.0 で差がない（自前の検証） | 高 |

- 長さだけを報酬にしても、RLHF による改善の大半が再現される（Singhal ら、COLM 2024）。
- 簡潔に答えるよう求めても情報を落とさず縮められる応答を返す「verbosity compensation」は、調べた全モデル・全データセットで起き、GPT-4 で 50.40%（Zhang ら 2024、QA 形式）。
- 言い切った応答の平均 47% が誤りで、利用者は確信の表現の有無にかかわらず生成文に強く頼る（Zhou ら、ACL 2024）。ヘッジの語で読み手に確からしさを伝えることは期待しにくい。
- 段階生成の人手評価：DocPres は直接の生成（GPT-Flat）に対し、読みやすさ 3.90 対 2.30、タイトルと本文の一致 3.80 対 2.20、下書きとしての使いやすさ 3.20 対 1.20（INLG 2024。論文5本・評価者2名）。
- ゴーストデッキ：タイトルと見出しに労力を集めた約20%完成の下書きで、出来上がりの姿を先にそろえ、無駄な作業を減らす（McKinsey の実務の紹介）。
- 削る・足す・重ねないの効果量は Mayer & Fiorella（Cambridge Handbook of Multimedia Learning、2014）。同じ題の章の2005年版（Mayer 単著）は coherence を 11件中10件・中央値 1.32 としており、版で数値が違う。
- 140本の PowerPoint のどれも原則の違反ゼロではなく、観察者は違反を見分けにくく、見分けても何が問題かを説明できないことが多い（Kosslyn ら 2012）。
- 自前の検証の主課題：公開データ（Open Images V7）の牧場の動物240枚の誤分類を画像で説明する10分のデッキを、モデル × 仕組みの有無で作らせた。計画と判定規則は実行前にコミットした。3点の無い依頼に、仕組みなしの4モデルは質問せずに書き始め、仕組みありの4モデルは質問して止まった。数値の誤りは全23デッキで0。
- 規則を足すと評価が下がることもある：画像の作り方を一般化した直後の版は、画像が小さい（1枚70〜100px）・結論の後に付録が区切りなく続く・写っている物を言い切らない、の3点で総合 5.0 が 3.8〜4.0 に下がった。直した版は仕組みなしと並んだ。
- スキルなしのデッキでも、画像についての主張の 8% が写真と一部または全部合わなかった（エンジンルームに写るヤギの見落としなど）。小型のモデル（Haiku 4.5）は仕組みありでも画像の説明の中心を誤った。
- 注意を促す規則の独立した検証（鳥6種240枚、うち6枚はラベルをわざと変えたもの）：変えた6枚は規則の有無にかかわらず16デッキすべてが見抜き、食い違いは 2.4% 対 2.2% で差が見えなかった。規則ありは Opus で1回あたり 2.35 ドルから 3.25 ドルに増えた。
- 照合の仕組みを足した版：水辺の鳥・牧場の動物と、結果を見る前に作った果物と野菜の課題で、Opus・Sonnet 各2回の12本すべてが、確定した中身の誤り0件・描画でき・型を満たした。

## 適用条件

- 仕組みの実装は公開リポジトリ tool-slides にある（Quarto、Claude Code のスキル・lint・終了時のフック）。規則と根拠の対応表も同じリポジトリにある。
- 機械で止められるのは、終了時のフックを持つ環境だけ。フックの無いチャットの画面では、入口の確認と骨子の承認を人が回す。
- 入口の3点は、依頼で渡せば仕組みが無くても足りる。仕組みの価値は、渡し忘れたときに書き始めず止まること。
- 字数・行数の上限（本文250字・タイトル40字など）は根拠のある値ではなく初期値で、手元のデッキで較正する。
- 規則を足したら、規則を知らない評価者に仕組みなしの版と並べて採点させる。型の合否だけでは、評価を下げる規則を見落とす。
- 採らないもの：「簡潔に」の指示（上の数値のとおり長さが残る）、見出し・強調を足して読みやすくする（削るより効果が小さい）、上位のモデルへの切り替え（入力を渡せば差が出ず費用だけ上がる）、注意を促す規則の追加（効き目が見えず手間が増えた）。

## 未確認

- 自前の検証の評価者・確認者はすべて Claude のモデルで、1条件あたり1〜2名・各1〜2回。人の聴衆での効果は測っていない。0.5点の差は評価者1名の1段階の違いで生じる。
- 教育研究の効果量は学習者の理解を測ったもので、仕事の発表への当てはめは類推。
- verbosity compensation の測定は QA 形式で、スライド生成での測定は見つかっていない。
- 枚数の目安（1枚1〜2分など）を支える実証研究は、調べた範囲では見つかっていない。
- 入口の確認・骨子の承認・lint・フックのそれぞれの単独の効果は、分けて測っていない。

## 出典

- A Long Way to Go: Investigating Length Correlations in RLHF（COLM 2024）: https://arxiv.org/abs/2310.03716
- Verbosity ≠ Veracity: Demystify Verbosity Compensation Behavior of Large Language Models: https://arxiv.org/abs/2411.07858
- Relying on the Unreliable（ACL 2024）: https://arxiv.org/abs/2401.06730
- Enhancing Presentation Slide Generation by LLMs with a Multi-Staged End-to-End Approach（DocPres、INLG 2024）: https://aclanthology.org/2024.inlg-main.18.pdf
- McKinsey の ghost deck: http://workingwithmckinsey.blogspot.com/2013/07/McKinsey-presentations-ghost-decks.html
- Principles for Reducing Extraneous Processing in Multimedia Learning（Mayer & Fiorella 2014）: https://www.cambridge.org/core/books/cambridge-handbook-of-multimedia-learning/principles-for-reducing-extraneous-processing-in-multimedia-learning-coherence-signaling-redundancy-spatial-contiguity-and-temporal-contiguity-principles/CD5B7AE1279A9AB81F8EEBB53DBEC86E ／ 2005年版: https://www.cambridge.org/core/books/abs/cambridge-handbook-of-multimedia-learning/principles-for-reducing-extraneous-processing-in-multimedia-learning-coherence-signaling-redundancy-spatial-contiguity-and-temporal-contiguity-principles/C98AB3A6CE760DD63C048936EA0B3B44
- PowerPoint Presentation Flaws and Failures: A Psychological Analysis（Kosslyn ら 2012）: https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2012.00230/full
- Claude Code のフック: https://code.claude.com/docs/en/hooks-guide
- 自前の検証（計画・判定規則・結果）: https://github.com/spin-glass/tool-slides/blob/main/experiments/2026-09-30-model-vs-skill/README.md ／ デッキと評価の一覧: https://tool-slides.toshihiro-engineer.workers.dev/experiments/2026-09-30-model-vs-skill/
- 規則と根拠の対応表: https://github.com/spin-glass/tool-slides/blob/main/.claude/skills/slides/references/evidence.md
- 仕組みの実装: https://github.com/spin-glass/tool-slides
