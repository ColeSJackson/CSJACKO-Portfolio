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

### Video

There is **no `ffmpeg` on `PATH`**, but a real one ships inside an installed
app and is what the committed reels were encoded with:

```bash
/Applications/AutoSubs.app/Contents/MacOS/ffmpeg
```

(The one in `CapCut.app` is a stub: it runs, exits 0 and produces nothing.)
`avconvert` also works but only takes fixed presets, with no bitrate control.

Reels are encoded 720 wide at CRF 27, audio 96k, `+faststart`, with a poster
pulled at one second:

```bash
FF=/Applications/AutoSubs.app/Contents/MacOS/ffmpeg
"$FF" -i in.mp4 -vf "scale='min(720,iw)':-2" -c:v libx264 -crf 27 -preset medium \
  -pix_fmt yuv420p -c:a aac -b:a 96k -movflags +faststart out.mp4
"$FF" -ss 1 -i out.mp4 -frames:v 1 -q:v 3 poster.jpg
```

That lands 20 to 70 second clips at 4 to 13MB. `public/reels` is about 245MB
in total and `.git` is over 1GB, so keep an eye on it: much past 500MB of video
and this needs to move to external hosting instead.

### Deploying

**There are two working paths, and the difference between them is whether the
site goes live.** Pick deliberately.

**A branch push builds a preview.** The GitHub to Vercel integration is
connected: pushing a branch produces a preview deployment at
`csjacko-portfolio-git-<branch>-cole-sj1.vercel.app`, which does not touch
`csjacko.co.uk`. This is the right path for anything that is not ready to be
public.

```bash
git push -u origin <branch>
```

**The CLI deploys straight to production.** This uploads the working tree and
aliases it to `csjacko.co.uk` immediately, with no review step:

```bash
npx vercel --prod
```

This file used to say that git credentials were blocked by a macOS Keychain
issue and that a push would never trigger a deployment. Both were checked on
20 Nov 2026 and neither is true: the push succeeded with no prompt and Vercel
queued a preview from it. The note is kept here because believing it is
actively dangerous — it pushes you towards `--prod` on the assumption that
nothing else works, which is how unreviewed work reaches the live domain.

Two things that *are* still true. `origin/main` has diverged from local before,
so check what is actually on the remote before assuming a push is a
fast-forward. And the Vercel CLI login expires: `npx vercel login` prints a URL
and a device code for a person to approve in a browser, so it is not something
an agent can complete on its own.

Videos make pushes slow. `public/reels` is about 245MB and `.git` is over 1GB,
so a first push of a branch carrying new video takes minutes, not seconds.

## Invariants

These are rules the site has regressed on before. Change them deliberately or
not at all.

### Film grain applies to background surfaces only

Grain belongs to page and section grounds. It must never render over an `img`,
a `video`, or any element wrapping one. Grain on a photograph does not read as
film, it reads as a low-quality JPEG.

This is enforced structurally, not by exception. `--grain` in `global.css` is a
noise tile whose alpha carries the effect (white specks on transparency), and it
is applied as a `background-image` on surfaces. An element's background always
paints behind its content, so media inside a grained surface is clean by
construction.

Do **not** reintroduce the old arrangement: a fixed overlay with a high z-index
and `mix-blend-mode: screen`, which media escaped only by being named in an
allowlist and pushed above it. That list has to be extended by hand for every
new component, and every component added after it was written silently got
grain baked over its images. That is the bug, and it is why this is a
background-image now.

Adding a new full-width surface? Add its class to the grain selector list in
`global.css`. Forgetting costs a little texture on one section, which is the
right way round to fail.

### Splash Comics is a second brand living inside this site

`/splash` and the homepage band are Splash's palette and type, not CSJACKO's.
Three rules hold that line.

**No film grain on Splash, ever.** This is structural, not an exception: the
`splash` ground in `Base.astro` is an opaque cream, so it covers the fixed
`.field` that carries the grain tile. Do not add a grain selector for anything
on that page. Paper feel comes from the cream and the splatters.

**The palette is scoped under `.splash-world`,** declared in
`src/styles/splash.css`, and must stay there. Nothing Splash belongs in
`global.css` and nothing in `@theme` should ever be a Splash colour. A cream
page inside a black site is exactly the thing that leaks.

**The values come from the brand kit,** at
`~/Splash Comics!/01 Brand + Fonts/Brand Kit`, which measured them off the
real artwork. Cream `#F7EDD8`, panel `#FFF8EA`, oxblood `#A0290B`, orange
`#E2572B`. Slightly different numbers circulate in briefs; those were
eyedropped from screenshots. The kit wins.

**Jelly Choco has 108 glyphs and no punctuation.** No full stop, comma,
apostrophe, hyphen, question mark or ampersand. Any line set in it must contain
none of those, which is why every Jelly Choco string on the site is a short
sentence-case fragment. Creamy Chicken has full punctuation and takes the caps
sub-headings. Nunito takes anything with a sentence in it.

**LICENSING IS UNRESOLVED AND BLOCKS PRODUCTION.** Jelly Choco is a
personal-use cut and Creamy Chicken ships with no licence file. Both are
self-hosted from `public/fonts/splash/`. Neither is cleared for a public site,
so the Splash work must not reach `csjacko.co.uk` until that is sorted. Nunito
is SIL OFL and is fine. This is the same unresolved question as Groovy Madness
in the fonts section below.

### Brand filtering is one shared vocabulary

`src/data/brands.ts` is the only place a client's display name is written. Both
the video wall and the design walls filter by it, via `BrandFilter.astro`,
which talks to its page through four data attributes and nothing else:
`[data-filter-item]` with `data-brand`, `[data-filter-count]` and
`[data-filter-none]`.

Two consequences worth keeping. A chip is only rendered for a brand that
actually has work behind it, counted from the data rather than listed by hand.
And hiding uses the `hidden` attribute rather than a class, deliberately, so
`ReelLightbox.astro` can read which tiles are on screen and keep its arrows
inside the current filter without the two components sharing any state.

`motohaus` is labelled "Other Motohaus brands", not "Motohaus". KEIS is a
Motohaus brand too, and a chip reading "Motohaus" beside one reading "KEIS"
looks like a parent category that contains the KEIS work. It does not; they are
mutually exclusive filters.

### The photo and design walls must not leave holes

`Masonry.astro` assigns columns explicitly, shortest-column-first by aspect
ratio. Neither CSS `columns` nor CSS Grid can pack these without gaps: both
refuse to move an item backwards, so a tall frame strands the space it did not
fit into. Do not "simplify" it back to `columns: 3`.

It rebuilds only when the column count changes, which is right for a resize
inside a breakpoint and wrong after a filter hides half a wall: the columns
keep their old distribution and come out wildly uneven. Filtering therefore
fires a `masonry:repack` event on `window`, which zeroes the cached count and
forces a real rebuild. If you add another way to hide items, fire it.

## Architecture

Astro (static output), TypeScript, Tailwind 4 (via `@tailwindcss/vite`, tokens
declared in `src/styles/global.css` under `@theme`, not `tailwind.config`).

### Four independent content systems — do not confuse them

- **`src/content/work/*.md`** is an Astro content collection (schema in
  `src/content.config.ts`) that drives `/work` (the full cross-section index)
  and the homepage Proudest work block (`featured: true`, ordered by `round`).
- **`src/content/strategy/*.md`** is a second collection, for planned
  programmes rather than finished pieces. It drives `/strategy` and
  `/strategy/[brand]`. A programme carries either `groups` (dated items) or
  `cadence` (a repeating rhythm) or both. **Close the frontmatter.** A missing
  trailing `---` makes Zod report every field as "Required", which reads like a
  schema bug and is not one.
- **`src/data/reels.ts`** is a plain TypeScript list, not a collection, and it
  is the single source for every video on the site. `/edit` renders all of it,
  `/splash` filters it to Splash, and the homepage band picks four by slug.
  Adding a reel is an entry here plus two files: the MP4 at
  `public/reels/<brand>/<slug>.mp4` and its poster at
  `src/assets/reels/<brand>/<slug>.jpg`. A missing poster fails the build
  naming the slug, deliberately: the alternative is a tile that is silently a
  black rectangle.
- **`/shoot`** (`src/pages/shoot.astro`) does **not** read the content
  collection at all. It globs every image in `src/assets/shoot/*.jpg` directly
  with `import.meta.glob` and builds captions from the filename. Some
  `section: shoot` markdown entries still exist in `src/content/work/` from
  before this split — they still appear in `/work` and, if featured, in the
  homepage Proudest work block,
  but editing them has no effect on `/shoot`. To change what's on `/shoot`,
  add/remove files in `src/assets/shoot/` (via `npm run photos`, which reads
  from the sibling `Photography 100/` source folder) and, if reordering,
  edit the `FAVOURITES` array at the top of `shoot.astro`.

### Content schema essentials (`src/content.config.ts`)

- `section` (required: `shoot | edit | design | strategy`) is what routes an
  entry to a page. `discipline` is a separate, older field kept only as the
  human-readable label — the two are not in sync and neither derives the
  other.
- `discipline` is an **array**, because a campaign is several crafts at once
  and picking one of them to print misdescribes it. A bare string still
  validates and is lifted into a single-item array, so older entries did not
  need rewriting. Anything rendering it must join, not index.
- `cover` and `coverAlt` are **optional**. A piece can be real and written up
  before its imagery has been handed over, and the case study renders without a
  hero rather than showing a dashed placeholder or borrowing a frame from a
  different shoot.
- `reelBrand` (optional) links an entry at its brand's filtered video wall, as
  `/edit?brand=<key>`. Keys live in `src/data/brands.ts`.
- `subsection` (optional: `paid-social | email | print | brand`) names the
  `/design` category an entry belongs to. The category pages themselves do not
  read the collection at all — see the image pipeline note below.
- `publicResults` defaults to `false`. Motohaus work is the employer's;
  `StatStrip.astro` renders withheld-dot placeholders instead of real numbers
  until this is explicitly flipped per entry.
- Video assets carry both `embed` (YouTube/Vimeo URL, swapped into an iframe
  on click via `Figure.astro`'s script — never loaded on page load) and
  `href` (plain link-out fallback if there's no embed). Long-form video still
  stays off the repo; short vertical reels are the exception and are committed
  under `public/reels/<brand>/`. See the video note under Commands.
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
red-gradient field in `Base.astro` show through — used for the hero, Proudest
work, index, contact), `corner` (solid, one step off black, for media-heavy
archives), `bone` (light room, for actual reading: case studies, about), and
`splash` (the Splash Comics room, cream — see the Splash invariant above). Type
is never placed over a photograph.

### Known dead code

None at present. `Archive.astro`, `Section.astro` and `StrategyList.astro` were
all unreferenced and were removed on 20 Nov 2026, when making `cover` optional
turned each of them into a type error. `Section.astro` had been replaced by
`src/pages/design/[category].astro` and `StrategyList.astro` by
`src/pages/strategy/[brand].astro`.

If you add a component and nothing imports it, say so here. The last three sat
in the tree long enough that a routine schema change had to account for pages
nobody could reach.

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

British English, casual and direct.

No em dashes anywhere in site-facing copy (headings, statements, outcomes,
alt text) — use a comma, a full stop, or restructure the sentence. Nothing
lints this; it has been violated and caught by hand before.

No exclamation marks in body copy. Quoted source material is exempt: the KEIS
email subject lines in `src/content/strategy/` are real sends and are not to be
edited for house style.

Real numbers only. If a figure has not been confirmed, leave the field out and
let the component render without it. Several fields are optional precisely so
that an absence is possible — `year` on a reel, `cover` on a case study,
`subject` on an email card. An invented number on a portfolio is worse than a
gap, and a visible PLACEHOLDER marker is worse than both.

### Contact details

Centralized in `src/config.ts` (`SITE` object) — email, LinkedIn, CV path,
location, one-line "looking for" copy. `ContactFooter.astro` reads from it
rather than hardcoding. The contact email is `cjjackson616@outlook.com` and
nothing else.

`SPLASH` in the same file carries the shop URL and social handles, because
`/splash`, the homepage band and `/strategy/splash` all need the same ones.

Still outstanding: `public/cv.pdf` is a placeholder, and the footer links to it
on every page as "Download PDF". The LinkedIn URL is the bare `/in/` stub, and
`ContactFooter.astro` suppresses the row until a real slug is filled in.
