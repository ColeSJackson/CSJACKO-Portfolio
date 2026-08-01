# HANDOFF.md

Session notes for whoever (human or Claude) picks this up next. Project root
is `/Users/mmmurdock/Documents/GitHub/CSJACKO Portfolio`.

## What we were doing

Two threads today, in order:

1. **Recovering from a data-loss incident and getting the site live at
   `csjacko.co.uk`.** The original project folder was found empty partway
   through the session; the real code turned out to still exist in a second,
   separate clone at this path (under `~/Documents/GitHub/`), which is why
   this repo is the one that matters going forward, not
   `~/Creative Portfolio CSJACKO`. From there: cleaned up git hygiene, got a
   Vercel project properly deployed and aliased to the domain, and diagnosed
   why the domain itself still wasn't resolving.
2. **Site changes**: reordering `/shoot` to lead with 16 chosen photos spread
   across all three grid columns, and replacing the homepage intro copy.

## Finished

- **Git repo cleaned up.** `.gitignore` added; `node_modules`, `dist`, and the
  four raw source-media folders (`Photography 100/`, `Email Design/`,
  `Paid social assets/`, `Reels Editing Work/`) are untracked but still
  present locally. `.gitattributes` had stray shell commands pasted into it
  by mistake (`git add .`, `gh repo create ...`) — removed, it's back to just
  the LF-normalization line.
- **Site is deployed and reachable**, just not yet at the custom domain (see
  Broken). Deploy path is the Vercel CLI, run by the user directly:
  `npx vercel --prod` from this directory. It's linked to the
  `cole-sj1/csjacko-portfolio` Vercel project and aliases straight to
  `csjacko.co.uk` on every run.
- **`/shoot` favourites**: `src/pages/shoot.astro` now has a `FAVOURITES`
  array of 16 filenames (Cole's picks) that render first, in a dedicated
  3-column CSS Grid (`.ph__top`) so they spread one-per-column instead of
  stacking in column one the way the masonry below it would. The remaining
  ~69 photos keep the original column-masonry wall (`.ph__grid`), unchanged.
  Verified locally: favourites confirmed landing in columns 1/2/3 in the
  right order via DOM inspection and a local `astro preview` screenshot.
- **Homepage intro rewritten**: `src/components/Hero.astro`'s
  `.hero__intro` block now holds Cole's actual bio copy (three paragraphs:
  bio, closing line, `- Cole SJ` signature). Caught and fixed my own mistake
  mid-edit — first draft used an em dash for the signature, which breaks the
  site's explicit no-em-dash rule; replaced with a plain hyphen.
- **`CLAUDE.md`** written at the repo root (architecture reference for future
  Claude sessions — not a today's-changes log, that's this file).

## Broken / outstanding

- **`csjacko.co.uk` does not resolve for real visitors.** Not a code or
  Vercel problem — confirmed via DNS lookup that the domain answers with
  Palo Alto Networks' security sinkhole (`sinkhole.paloaltonetworks.com`) on
  every record. Root cause found: Palo Alto's own URL-categorization tool
  (`urlfiltering.paloaltonetworks.com`) has the domain filed as **"Parked"**,
  which many networks block by policy regardless of its "Low-Risk" rating.
  This is almost certainly because the domain was brand new (registered same
  day, registrar is Fasthosts, confirmed no hold/suspension on their end) and
  looked empty the first time it got crawled. Cole has submitted a
  recategorization request through that tool. **Nothing left to do here but
  wait** — check `dig A csjacko.co.uk` next session; if it still resolves to
  the sinkhole, the request hasn't been reviewed yet.
- **GitHub push is broken and unresolved.** This sandboxed environment can't
  reach the macOS Keychain (`fatal: could not read Username for
  'https://github.com'`), and the user's own Terminal attempt also failed for
  reasons never captured (no error text was pasted back). The two git-hygiene
  commits above exist **locally only** — `origin/main` on
  `github.com/ColeSJackson/CSJACKO-Portfolio` is still on an older, possibly
  divergent history (a `Delete README.md` commit appeared there that has no
  local counterpart; never root-caused). Practical effect: there is currently
  no push-to-deploy workflow. Every change has to be shipped by hand with
  `npx vercel --prod`.
- **Today's two site changes are not deployed yet.** The `/shoot` grid fix
  and the new Hero intro copy are only built and verified locally — the last
  confirmed live deployment predates both. Needs one more
  `npx vercel --prod` run.
- Pre-existing, not touched today: `src/config.ts`'s `linkedin` field is
  still a placeholder URL, and the font licensing question flagged in
  `CLAUDE.md` (Groovy Madness non-commercial, Alte Haas Grotesk requires its
  bundled licence file) is still unresolved.

## Next

1. Run `npx vercel --prod` to actually ship today's `/shoot` and `Hero.astro`
   changes.
2. Re-check `csjacko.co.uk` (`dig A csjacko.co.uk`, or just visit it) —
   confirm the Palo Alto recategorization has landed.
3. Fix GitHub auth properly, ideally with GitHub Desktop (browser-based
   login, sidesteps the Keychain block entirely) so push-triggered deploys
   can replace the manual CLI workflow.
4. Once GitHub push works again, reconcile local `main` with the diverged
   `origin/main` before pushing — don't force-push blind.

## Files touched today

- `.gitignore` — created
- `.gitattributes` — cleaned up (stray shell commands removed)
- `src/pages/shoot.astro` — favourites reorder, then split into
  `.ph__top` (grid) + `.ph__grid` (masonry) sections
- `src/components/Hero.astro` — intro paragraph copy replaced
- `CLAUDE.md` — created
- `HANDOFF.md` — created (this file)
