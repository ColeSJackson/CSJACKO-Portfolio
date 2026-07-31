"""
Turns the two source TTFs into subsetted woff2 files.

Groovy Madness sets the headings. Alte Haas Grotesk sets everything else.

Alte Haas Grotesk also has to cover the digits inside headings, because every
digit glyph in Groovy Madness is the same placeholder shape (all ten share an
identical advance of 877 and identical bounds), so that font is effectively
numberless. The regular weight serves both jobs: it is declared twice in the
stylesheet under two family names, so it is only downloaded once.

Alte Haas Grotesk is not variable, so regular and bold are separate files.
Only the regular is preloaded; the bold is fetched on demand if something
actually asks for it.

Its licence requires the licence file to travel with the font, so
"Alte Haas Grotesk licence.rtf" is kept alongside the sources on purpose.

Requires: pip install fonttools brotli
Run:      python3 scripts/build-fonts.py
"""

import pathlib
import sys

try:
    from fontTools.ttLib import TTFont
    from fontTools import subset
except ImportError:
    sys.exit("Needs fonttools and brotli: pip install fonttools brotli")

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "src" / "assets" / "fonts"

SOURCES = ROOT / "src" / "assets" / "fonts" / "src"

JOBS = [
    {
        "name": "groovy-madness",
        "file": "GroovyMadnessDemo-gwA34.ttf",
        # Everything the site actually sets, minus the digits.
        "text": (
            "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
            "abcdefghijklmnopqrstuvwxyz"
            " .,:;/·%&'’\"!?()[]-–+#@©®™*_=<>|\\~^"
        ),
    },
    {
        "name": "alte-haas",
        "file": "AlteHaasGroteskRegular.ttf",
        # The text face: body copy, utility caps, and the digits that appear
        # inside Groovy Madness headings.
        "text": (
            "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
            "abcdefghijklmnopqrstuvwxyz"
            "0123456789"
            " .,:;/·%&'’\"!?()[]-–+#@©®™*_=<>|\\~^"
        ),
    },
    {
        "name": "alte-haas-bold",
        "file": "AlteHaasGroteskBold.ttf",
        "text": (
            "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
            "abcdefghijklmnopqrstuvwxyz"
            "0123456789"
            " .,:;/·%&'’\"!?()[]-–+#@©®™*_=<>|\\~^"
        ),
    },
]


def build(job):
    src = SOURCES / job["file"]
    if not src.exists():
        sys.exit(f"Missing source font: {src}")

    font = TTFont(src)

    options = subset.Options()
    options.layout_features = ["*"]
    options.desubroutinize = True
    options.hinting = False
    options.drop_tables += ["DSIG"]
    options.recalc_bounds = True
    options.notdef_outline = False

    subsetter = subset.Subsetter(options=options)
    subsetter.populate(text=job["text"])
    subsetter.subset(font)

    font.flavor = "woff2"
    dest = OUT / f"{job['name']}.woff2"
    font.save(dest)
    font.close()

    before = src.stat().st_size / 1024
    after = dest.stat().st_size / 1024
    print(f"{job['name']:<18} {before:7.1f} kB ttf  ->  {after:6.1f} kB woff2")


OUT.mkdir(parents=True, exist_ok=True)
for job in JOBS:
    build(job)
