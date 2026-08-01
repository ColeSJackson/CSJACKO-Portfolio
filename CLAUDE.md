# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install
npm run dev          # http://localhost:4331 (port pinned in astro.config.mjs)
npm run build        # static output to dist/
npm run check        # astro check — types and template diagnostics, run before calling anything done
npm run preview      # serve the dist/ build locally
npm run placeholders # generate synthetic in-palette stand-in images into src/assets/placeholder/
npm run photos       # resize raw exports (Photography 100/, Paid social assets/, Email Design/) into src/assets/
```

There is no test runner and no linter beyond `astro check`. There is no CI.

### Deploying

This does **not** deploy via GitHub push. Git credentials in this environment
are blocked by a macOS Keychain permission issue that has not been resolved,
and the GitHub repo's history has diverged from local at least once already.
The working deploy path is the Vercel CLI, run directly by the user (its login
is a separate browser-based token, unrelated to git):

```bash
npx vercel --prod
```

This uploads the current working tree straight to Vercel and aliases it to
`csjacko.co.uk`, bypassing GitHub entirely. Do not assume a `git push` will
trigger a deployment — it will not, and outdated commits already exist on
`origin/main` that do not match local.

## Architecture

Astro (static output), TypeScript, Tailwind 4 (via `@tailwindcss/vite`, tokens
declared in `src/styles/global.css` under `@theme`, not `tailwind.config`).

### Two independent content systems — do not confuse them

- **`src/content/work/*.md`** is an Astro content collection (schema in
  `src/content.config.ts`) that drives `/work` (the full cross-section index),
  the homepage scorecard (`featured: true` entries), and `/edit`, `/design`,
  `/strategy` (filtered by the `section` field).
- **`/shoot`** (`src/pages/shoot.astro`) does **not** read the content
  collection at all. It globs every image in `src/assets/shoot/*.jpg` directly
  with `import.meta.glob` and builds captions from the filename. Some
  `section: shoot` markdown entries still exist in `src/content/work/` from
  before this split — they still appear in `/work` and the homepage scorecard,
  but editing them has no effect on `/shoot`. To change what's on `/shoot`,
  add/remove files in `src/assets/shoot/` (via `npm run photos`, which reads
  from the sibling `Photography 100/` source folder) and, if reordering,
  edit the `FAVOURITES` array at the top of `shoot.astro`.

### Content schema essentials (`src/content.config.ts`)

- `section` (required: `shoot | edit | design | strategy`) is what routes an
  entry to a page. `discipline` is a separate, older field kept only as the
  human-readable label — the two are not in sync and neither derives the
  other.
- `subsection` (optional: `paid-social | email | print`) only matters on
  `/design`, which groups by it via `Section.astro`'s `grouped` prop. A group
  with zero matching entries simply doesn't render, so there's no need to stub
  a placeholder `print` entry just to keep the page from looking broken.
- `publicResults` defaults to `false`. Motohaus work is the employer's;
  `StatStrip.astro` renders withheld-dot placeholders instead of real numbers
  until this is explicitly flipped per entry.
- Video assets carry both `embed` (YouTube/Vimeo URL, swapped into an iframe
  on click via `Figure.astro`'s script — never loaded on page load) and
  `href` (plain link-out fallback if there's no embed). Video files are never
  committed to the repo.
- Numeric-looking `stats` values must be quoted (`value: "9"`) or YAML parses
  them as numbers and the build rejects them.

### The signature device: `src/scripts/fit-lines.ts`

Scales each display line's `font-size` (via a `--fit-scale` CSS custom
property) until it renders at exactly its container's width — this is why the
hero mark, the discipline row, and the contact panel all sit flush on both
edges. Any element being solved must be `width: max-content`; anything else
and the measurement reads the container's width instead of the text's, and
every line collapses to the same wrong answer.

### Fonts: two families stitched into one via `unicode-range`

Declared in `src/styles/global.css`. **Groovy Madness** (`CSJACKO Display`,
headings/anything large) has no usable digits — all ten are the same
placeholder glyph — so `U+0030-0039` is carved out of that `@font-face` and
served from **Alte Haas Grotesk** (`CSJACKO Text`, everything else) instead,
with a measured `size-adjust` to match cap heights. The two `CSJACKO Display`
`@font-face` rules must keep matching `font-weight` ranges, or weight-based
font matching picks the wrong one before `unicode-range` is even consulted
(this broke the whole display face once already). Regenerate subsets after
replacing a source font with `python3 scripts/build-fonts.py` (sources in
`src/assets/fonts/src/`). **Licensing is unresolved**: Groovy Madness is a
non-commercial demo cut, Alte Haas Grotesk requires its licence file ship
alongside it (already done, in `src/assets/fonts/src/`) — check before this
goes further live.

### Palette and "rooms"

Three-value palette in `global.css`: near-black ground, one red (reserved for
`CSJACKO`, the display face's `.bloom`/`.warp` treatment, and live/hover
states only — never a general accent), one off-white. Pages use one of three
grounds (`Base.astro`'s `ground` prop): `ink` (transparent, lets the drifting
red-gradient field in `Base.astro` show through — used for the hero, scorecard,
index, contact), `corner` (solid, one step off black, for media-heavy
archives), `bone` (light room, for actual reading: case studies, about). Type
is never placed over a photograph.

### Known dead code

`src/components/Archive.astro` is unused — nothing imports it. It predates
`Section.astro`, which replaced it when `/edit` and `/design` were
restructured. Safe to ignore or remove.

### Image pipeline

Every image goes through Astro's `<Picture>` (AVIF + WebP + JPEG fallback,
explicit responsive widths). Grids never load full-resolution images — the
lightbox (`Lightbox.astro`, a native `<dialog>`, no dependencies) is fed a
separate pre-generated 1800px variant via `getImage()` at build time.
`scripts/prepare-photos.mjs` (`npm run photos`) resizes raw exports from
sibling folders (`Photography 100/`, `Paid social assets/`, `Email Design/` —
none of which are committed, all gitignored) down to sane dimensions before
they land in `src/assets/`; run it after adding new source files.

### Copy conventions

No em dashes anywhere in site-facing copy (headings, statements, outcomes,
alt text) — use a comma, a full stop, or restructure the sentence. Nothing
lints this; it has been violated and caught by hand before.

### Contact details

Centralized in `src/config.ts` (`SITE` object) — email, LinkedIn, CV path,
location, one-line "looking for" copy. `ContactFooter.astro` reads from it
rather than hardcoding.
