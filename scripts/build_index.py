#!/usr/bin/env python3
"""notes/ の frontmatter から INDEX.md を生成する（--check で検証のみ）。標準ライブラリのみ。"""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
NOTES_DIR = ROOT / "notes"
INDEX_PATH = ROOT / "INDEX.md"
REQUIRED = ("title", "date", "topics", "status", "question")
STATUSES = {"active", "superseded", "archived"}
FNAME_RE = re.compile(r"^(\d{4}-\d{2}-\d{2})-[a-z0-9]+(?:-[a-z0-9]+)*\.md$")
KEY_RE = re.compile(r"^([A-Za-z_][A-Za-z0-9_-]*):\s*(.*)$")
ITEM_RE = re.compile(r"^\s*-\s+(.*)$")


def _unquote(s: str) -> str:
    s = s.strip()
    if len(s) >= 2 and s[0] == s[-1] and s[0] in "\"'":
        return s[1:-1]
    return s


def parse_frontmatter(text: str) -> dict | None:
    if not text.startswith("---\n"):
        return None
    end = text.find("\n---", 4)
    if end < 0:
        return None
    data: dict = {}
    key = None
    for line in text[4:end].splitlines():
        if not line.strip() or line.lstrip().startswith("#"):
            continue
        m = KEY_RE.match(line)
        if m and not line.startswith((" ", "\t")):
            key, val = m.group(1), m.group(2).strip()
            if val.startswith("[") and val.endswith("]"):
                inner = val[1:-1].strip()
                data[key] = [_unquote(v) for v in inner.split(",") if v.strip()] if inner else []
            else:
                data[key] = _unquote(val)
            continue
        m = ITEM_RE.match(line)
        if m and key is not None:
            cur = data.get(key)
            if cur in ("", None):
                data[key] = [_unquote(m.group(1))]
            elif isinstance(cur, list):
                cur.append(_unquote(m.group(1)))
            else:
                data[key] = [cur, _unquote(m.group(1))]
    return data


def load_notes() -> tuple[list[dict], list[str]]:
    notes: list[dict] = []
    errors: list[str] = []
    for path in sorted(NOTES_DIR.glob("*.md")):
        if path.name.startswith(("_", "README")):
            continue
        rel = path.relative_to(ROOT).as_posix()
        m = FNAME_RE.match(path.name)
        if not m:
            errors.append(f"{rel}: ファイル名は YYYY-MM-DD-<kebab-slug>.md にする")
            continue
        fm = parse_frontmatter(path.read_text(encoding="utf-8"))
        if fm is None:
            errors.append(f"{rel}: frontmatter（--- ... ---）がない")
            continue
        for k in REQUIRED:
            if not fm.get(k):
                errors.append(f"{rel}: frontmatter に {k} がない")
        if not isinstance(fm.get("topics"), list):
            errors.append(f"{rel}: topics はリスト（[a, b]）にする")
        if fm.get("status") and fm["status"] not in STATUSES:
            errors.append(f"{rel}: status は {sorted(STATUSES)} のどれかにする")
        if fm.get("date") and fm["date"] != m.group(1):
            errors.append(f"{rel}: date({fm['date']}) とファイル名の日付({m.group(1)})が違う")
        fm["_path"] = rel
        notes.append(fm)
    return notes, errors


def build_index(notes: list[dict]) -> str:
    def label(n: dict) -> str:
        s = "" if n.get("status") == "active" else f"（{n.get('status')}）"
        return f"{n['date']} — [{n['title']}]({n['_path']}){s} — {n.get('question', '')}"

    by_topic: dict[str, list[dict]] = {}
    for n in notes:
        for t in n.get("topics", []):
            by_topic.setdefault(t, []).append(n)
    lines = [
        "# INDEX",
        "",
        f"自動生成（`python3 scripts/build_index.py`）。手で編集しない。ノート {len(notes)} 件。",
        "",
        "## topic 別",
        "",
    ]
    for t in sorted(by_topic):
        lines.append(f"### {t}（{len(by_topic[t])}）")
        lines.append("")
        for n in sorted(by_topic[t], key=lambda x: x["date"], reverse=True):
            lines.append(f"- {label(n)}")
        lines.append("")
    lines += ["## 日付順", ""]
    for n in sorted(notes, key=lambda x: x["date"], reverse=True):
        lines.append(f"- {label(n)} — topics: {', '.join(n.get('topics', []))}")
    lines.append("")
    return "\n".join(lines)


def main(argv: list[str]) -> int:
    notes, errors = load_notes()
    if errors:
        print("\n".join(errors), file=sys.stderr)
        return 1
    if "--check" in argv:
        print(f"OK: {len(notes)} notes")
        return 0
    INDEX_PATH.write_text(build_index(notes), encoding="utf-8")
    print(f"wrote {INDEX_PATH.relative_to(ROOT)} ({len(notes)} notes)")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
