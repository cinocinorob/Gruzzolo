#!/usr/bin/env python3
"""Sets the Android application ID everywhere it appears.

Usage:  python3 tools/set-app-id.py io.github.yourname.gruzzolo
The ID must be unique and should be a name space you control.
"""
import pathlib, re, shutil, sys

OLD_RE = re.compile(r"namespace '([a-z0-9_.]+)'")

def main():
    if len(sys.argv) != 2 or not re.fullmatch(r"[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)+", sys.argv[1]):
        sys.exit(__doc__)
    new = sys.argv[1]
    root = pathlib.Path(__file__).resolve().parent.parent
    old = OLD_RE.search((root / "app/build.gradle").read_text()).group(1)
    if old == new:
        sys.exit("already set")
    for path in [root / "app/build.gradle", root / "README.md", *root.glob("metadata-fdroid/*.yml"),
                 *(root / "app/src/main/java").rglob("*.java")]:
        path.write_text(path.read_text().replace(old, new))
    java = root / "app/src/main/java"
    src, dst = java / old.replace(".", "/"), java / new.replace(".", "/")
    dst.parent.mkdir(parents=True, exist_ok=True)
    shutil.move(str(src), str(dst))
    for yml in root.glob("metadata-fdroid/*.yml"):
        yml.rename(yml.with_name(new + ".yml"))
    print("application ID:", old, "->", new)

if __name__ == "__main__":
    main()
