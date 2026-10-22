.PHONY: index check

index:
	python3 scripts/build_index.py

check:
	python3 scripts/build_index.py --check
