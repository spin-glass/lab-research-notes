.PHONY: index check inbox

index:
	python3 scripts/build_index.py

check:
	python3 scripts/build_index.py --check

# 受信箱の未処理フィードバックを表示するだけ（取り込み手順は CLAUDE.md）
inbox:
	gh issue list -R spin-glass/tool-notes-inbox -l feedback -s open
