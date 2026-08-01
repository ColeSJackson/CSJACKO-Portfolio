# HANDOFF.md

Session notes for whoever (human or Claude) picks this up next. Project root
is `/Users/mmmurdock/Documents/GitHub/CSJACKO Portfolio`.

## Current state: the site is live and working

`https://csjacko.co.uk` serves the current build, HTTP 200, with both of the
outstanding changes deployed. Verified by fetching the production domain
directly and counting rendered elements: 16 favourite photos on `/shoot`,
new intro copy on the homepage.

## The big correction: the domain was never actually broken

The previous session concluded that `csjacko.co.uk` "does not resolve for
real visitors" because `dig` returned Palo Alto's sinkhole. **That conclusion
was wrong.** Checked against public resolvers over DNS-over-HTTPS:

    Google (dns.google)      -> 216.198.79.1   (Vercel)
    Cloudflare (1.1.1.1)     -> 216.198.79.1   (Vercel)
    Cole's local resolver    -> sinkhole.paloaltonetworks.com

The sinkhole is **local to Cole's own network**, not global. His network runs
Palo Alto DNS Security, which was filtering the domain as "Parked". Everyone
else on the internet has been reaching the site fine.

Practical effect: if the site looks dead from Cole's machine but fine from
mobile data, that is this, not an outage. To check the real site from the
affected network, bypass local DNS:

    curl -I --resolve csjacko.co.uk:443:216.198.79.1 https://csjacko.co.uk/

The Palo Alto recategorization request Cole submitted will clear the local
block when it lands. Nothing to fix in code or in Vercel.

## Finished this session

- **Deployed.** `npx vercel --prod` shipped the `/shoot` favourites grid and
  the new Hero intro. Both confirmed live on the production domain.
- **Git divergence resolved without a force-push.** `origin/main` held three
  commits made through the GitHub web UI (a README deletion and two
  "Add files via upload" dumps). Every file unique to them already existed in
  this tree in a better place — `cv.pdf`/`favicon.svg` in `public/`,
  `index.html`/`sitemap-*.xml` as build output in `dist/`, and the ten email
  JPGs in `Email Design/`. So the merge used `-s ours`: local tree kept
  verbatim, nothing taken from the uploads, and their history stays reachable
  through the merge's second parent instead of being force-pushed away.
  Branch is now **ahead 5, behind 0** — a plain `git push` will fast-forward.
- **Repo hygiene**: three `.DS_Store` files that predated `.gitignore` were
  still tracked; untracked them. Removed a duplicate `.env*` rule that was
  re-ignoring `.env.example` by sitting after the `!.env.example` negation.
- Build verified clean: 31 pages.

## Outstanding

- **Nothing has been pushed to GitHub yet.** This sandbox cannot reach the
  macOS Keychain, so `git push` fails with `could not read Username`. The
  repo is staged and conflict-free, waiting on one push. **GitHub Desktop is
  already installed** at `/Applications/GitHub Desktop.app` — opening this
  repo there and clicking Push is the whole fix. No force, no conflicts.
- **No push-to-deploy yet.** The Vercel project is linked at the repo level
  (`.vercel/repo.json`, project `csjacko-portfolio`) but not connected to the
  GitHub repo, so deploys are manual via `npx vercel --prod`. Once the push
  above works, connecting the repo in the Vercel dashboard under Settings ->
  Git turns every push into a deploy automatically.
- **Vercel Deployment Protection is on for preview URLs.** The
  `*.vercel.app` deployment URLs redirect to a Vercel login. This does *not*
  affect the production domain, which is public and returns 200. Worth
  knowing so a protected preview URL is not mistaken for a broken deploy.
- Pre-existing, untouched: `src/config.ts`'s `linkedin` field is still a
  placeholder URL, and the font licensing question flagged in `CLAUDE.md`
  (Groovy Madness non-commercial, Alte Haas Grotesk requires its bundled
  licence file) is still unresolved.

## Deploying, day to day

Until push-to-deploy is connected, shipping is one command from this
directory:

    npx vercel --prod

It builds, deploys, and aliases to `csjacko.co.uk` in one go. Vercel CLI is
authenticated as `colesjackson`.

## Files touched this session

- `.gitignore` — removed the duplicate `.env*` rule, documented the `.vercel` entry
- `src/.DS_Store`, `src/assets/.DS_Store`, `src/content/.DS_Store` — untracked
- `HANDOFF.md` — rewritten (this file)
