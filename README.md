# CSJACKO

Portfolio site for Cole SJ. Astro, TypeScript, Tailwind 4, static build.

```bash
npm install
npm run dev      # http://localhost:4331
npm run build    # static output to dist/
npm run check    # types and templates
```

## Adding work

Drop a Markdown file in `src/content/work/`. Never edit a component to add a
piece. The schema is in [`src/content.config.ts`](src/content.config.ts) and the
build fails loudly if frontmatter is wrong.

The fields that matter:

| Field | Notes |
| --- | --- |
| `discipline` | `photography`, `videography`, `paid-social`, `email`, `social-management`. Drives which archive page picks the entry up. |
| `context` | `motohaus`, `csjacko`, `freelance`. Shows as MH / CS / FR in the index. |
| `featured` + `round` | Puts the piece on the scorecard. `round` fixes the order. Keep it to four. |
| `publicResults` | **Defaults to false.** While false the tale of the tape renders dots and an "employer results, withheld" line instead of the numbers. Flip it only when a result is cleared for publication. |
| `stats` | Array of `label` / `value`. Quote any value that is purely numeric (`value: "9"`), or YAML parses it as a number and the build rejects it. |
| `placeholder` | Draws a PLACEHOLDER badge on every image in the entry. Delete the line when the entry is real. |
| `media` | Repeating `statement` / `outcome` / `assets` blocks. This is the case study body. |

Assets are either a still or a video:

```yaml
assets:
  - type: image
    src: ../../assets/placeholder/portrait-01.jpg
    alt: Real alt text, always.
  - type: video
    poster: ../../assets/placeholder/landscape-01.jpg
    preview: /previews/thing.mp4   # optional, silent loop, lives in public/
    href: https://vimeo.com/...    # the actual cut, hosted off-repo
    alt: Real alt text, always.
```

`preview` is optional. Without one the block renders the poster with a play
affordance, which is a valid state rather than a broken one.

## Placeholder images

`npm run placeholders` generates in-palette stand-ins into
`src/assets/placeholder/`. It skips files that already exist, so delete one and
re-run to regenerate just that one. Delete the whole folder once real work is
in and remove the script.

## Type

Two faces, both self-hosted from `src/assets/fonts/`:

- **Groovy Madness** sets headings and anything large (`--font-display`).
- **Seven Moon** sets everything else: body copy, utility caps, data
  (`--font-body`, `--font-utility`).

Groovy Madness has **no usable numerals**. All ten digit codepoints are mapped,
but every one points at the same placeholder shape, so `2026` would render as
four identical blocks. Because the codepoints *are* mapped, normal per-glyph
fallback never fires. The stylesheet therefore carves `U+0030-0039` out of the
display family with `unicode-range` and hands it to Seven Moon, with a measured
`size-adjust: 115%` to match Groovy's cap height. Nothing in a component has to
know this happens.

The text face carries its own `size-adjust: 118%`. Seven Moon has a small cap
height (0.598em), so without it every paragraph would render about a fifth
smaller than the type scale was tuned for.

There are three `@font-face` rules but only two downloads: Seven Moon is
declared twice, once as the text face and once as the display numerals, and
browsers fetch per URL rather than per rule.

To regenerate the subsets after replacing a source TTF:

```bash
python3 scripts/build-fonts.py
```

Sources live in `src/assets/fonts/src/`. Subsetting takes the pair from 428kB
of source to 33kB of woff2.

> **Licensing. Read this before the site goes public.**
>
> - **Groovy Madness** is labelled *Freeware, Non-Commercial*, and is a **Demo**
>   cut. The demo status is why the numerals are missing.
> - **Seven Moon** is free for personal use only. A commercial licence is
>   required and sold at <https://letsfourlines.com>.
>
> A portfolio published to get you hired is arguably promotional use. Both
> licences are cheap relative to the risk. Buy them before you put the URL on a
> CV or a LinkedIn profile.

## Navigation

The four words in the hero are the navigation. Each one is a real link:

| Word | Goes to | Shows |
| --- | --- | --- |
| SHOOT | `/photography` | Photography, masonry wall with a lightbox |
| EDIT | `/videography` | Video pieces |
| DESIGN | `/design` | `paid-social` entries |
| STRATEGY | `/strategy` | `email` **and** `social-management` entries |

Adding a discipline means adding a page that filters the collection and passes
it to `Archive.astro`. Photography is the only one with a bespoke page, because
a lightboxed wall is a different job from a card list.

## How it is put together

- **Tokens** live in [`src/styles/global.css`](src/styles/global.css) under
  `@theme`. Palette, type scale, spacing, easing. Components use token classes,
  never raw hex or px. If you are about to type a hex into a component, add it
  here instead.
- **The palette is three values.** Near-black ground, one hot red, one
  off-white. Red is reserved: it carries CSJACKO, the live states and nothing
  else. Everything else is white. The moment red shows up in three places on one
  screen it has stopped working.
- **The drifting field** is three oversized red gradients behind the whole
  document, each on its own long timing so they never visibly loop. It only
  animates transform, so the compositor handles it and it costs nothing on a
  phone. Sections that should show it simply have no background of their own.
- **The signature device** is [`src/scripts/fit-lines.ts`](src/scripts/fit-lines.ts).
  It scales each display line's font-size until it renders at exactly the
  container width, which is why the hero and the contact panel sit flush on both
  edges. Lines being solved must be `width: max-content`, or the measurement
  reads the container instead of the text and every line collapses to the same
  wrong answer.
- **The one interaction** is the scorecard in
  [`src/components/Scorecard.astro`](src/components/Scorecard.astro). Round one
  is rendered open server-side so it works with JS off.
- **Fight vernacular** is structural, not decorative: featured work is numbered
  rounds on a judge's scorecard, and campaign results are a tale of the tape.
  That is how the email and social work gets the same energy as the photography,
  which is the trick the whole site depends on.

## Rooms

Three grounds, used consistently:

- **Transparent** for the hero, scorecard, index and contact, so the drifting
  field shows through and the home page reads as one continuous surface.
- **Corner** (one step off black) for the media archives, so images sit on a
  flat, quiet ground rather than a moving one.
- **Bone** for the light room: case studies and about, where there is real
  reading to do.

Type never sits on top of a photograph.

## Before this goes live

- `public/cole-sj-cv.pdf` does not exist. The CV download 404s until you add it.
- The LinkedIn URL in
  [`src/components/ContactFooter.astro`](src/components/ContactFooter.astro) is a
  stub.
- Every `TKTK` is a number to fill in. `grep -rn TKTK src/` finds them.
- All 16 work entries are lorem ipsum. Titles, clients, years and
  disciplines are real so the layout reads at the right shape; every
  `summary`, `statement` and `outcome` is filler.
- Kit list on `/about` is all TKTK.

## Constraints kept

No em dashes anywhere in site copy. Near-zero client JS (~3.6KB on the home
page). AVIF with WebP fallback and explicit dimensions on every image. Video
previews lazy, muted, `playsinline`, poster always set. Reduced motion stops the
drifting background, removes the letterform warp, and stops previews loading,
rather than just speeding things up.

## Known trade-offs

- **The tiny tracked utility caps** were originally spaced for a monospace face.
  They are still the least legible thing on the site. If they read badly at
  small sizes, reduce the `letter-spacing` on `.label` and `.pill` in
  [`global.css`](src/styles/global.css) rather than changing the face.
- **The fit-to-measure device changed.** It used to solve a variable width axis
  so lines matched in cap height. Groovy Madness is static, so the solver scales
  font-size instead: lines are still flush on both edges, but their cap heights
  now differ.
