# Portfolio site: build brief

Read this whole file before writing any code. Do not start coding yet. Your first
job is a plan, described at the bottom under "How I want you to work".

## 1. What I'm building

A personal portfolio website for me, Cole SJ. One site, five bodies of work,
one job: convince someone in under ninety seconds that I can shoot, cut, design
and run a brand's content end to end, and then give them a way to go deep on
whichever part they care about.

**This site exists to get me a full-time job.** One audience: hiring managers and
recruiters on marketing, social and content teams outside the motorcycle
industry. Nothing else on the site should compete with that.

What that means concretely:

- No service pitch, no rate card, no "work with me", no enquiry form aimed at
  clients.
- CSJACKO is in here as **evidence**, not as a business I'm advertising. It shows
  I go and build things on my own initiative, and it's where my strongest visual
  work lives. Present it as a body of work, not as an offer.
- Every case study answers a hiring manager's question, not a client's: what did
  you own, what did you decide, what changed because you were there.
- Contact section is for someone who wants to interview me. Email, LinkedIn, a
  downloadable CV, and a plain line on what I'm looking for and whether I'd
  relocate or work remote.
- Where I have numbers, they matter more than they would on a client site. Where
  I can't publish employer numbers, say what changed qualitatively rather than
  going silent.

## 2. Who I am, for tone and copy

- Content and Digital Marketing Executive at Motohaus Powersports, a nine-brand
  powersports distributor. I run content and digital marketing across the
  portfolio, including SW-MOTECH, KEIS Apparel and NEXX Helmets UK.
- Promoted twice in under two years.
- I also run CSJACKO, freelance combat sports photography and videography.
  Boxing and Muay Thai, including work for British Army Boxing. I've shot a
  British Army Muay Thai championship.
- What actually drives me is fitness, martial arts and athletic content. Bodies
  under load, hard light, high intensity. The day job is where I've built the
  commercial marketing skillset.

Tone: confident, plain, unpretentious. Short sentences. Let numbers and images do
the bragging. No agency-speak, no "passionate about storytelling", no
"results-driven creative". If a sentence could appear on any marketer's site,
cut it.

**Hard copy rule: never use em dashes anywhere on this site.** Use commas, full
stops, or restructure the sentence.

## 3. The five bodies of work

This is the actual design problem. Two of these are inherently visual and three
are not. The site has to make the non-visual ones land just as hard.

| Section | Nature | How it has to be presented |
| --- | --- | --- |
| Photography | Visual | Image-led. Full-bleed, big, uncompromised. |
| Videography | Visual | Video-led. Silent looping previews, click for the real cut. |
| Paid social design | Visual, but needs context | Creative shown in-platform, paired with what it was for and how it did. |
| Email campaigns and planning | Not visual | Statement of what I built, the shape of the plan, the outcome. Email renders as supporting evidence, not the hero. |
| Social media management | Not visual | Brand pages I run, cadence, what changed while I ran them. |

The unifying principle, borrowed from the third reference site below: every piece
of work leads with **a bold sentence saying what I made and why**, then a second
sentence on the outcome, then the media. Copy first, media second, at the item
level. Never a bare gallery with a caption.

## 4. Reference sites and exactly what to take from each

Do not clone these. Take the named principle only.

**spencergabor.work**
- Interface gets out of the way. Heavy white space. The work is the only loud
  thing on screen.
- One genuinely memorable interaction rather than fifteen small ones. His is a
  circular draggable carousel of featured work.
- Footer that expands into a full-height contact panel as you reach the bottom of
  the page, so "get in touch" is an event rather than a link.
- Lightbox detail view: click a piece, get a grid or single large image, no page
  navigation away from flow.
- About lives behind a small personal object in the corner, not a nav item.

**dotconor.com**
- Kinetic oversized type hero. His reads PRODUCT / DESIGN / & / STRATEGY at
  display scale with motion sitting inside the letterforms.
- Work presented in two tiers: three deep case studies you can click into, plus a
  dense scannable index of everything else with client, one-line description,
  year and context. The long list does more for credibility than more case
  studies would.
- Ruthlessly short project descriptions. Three lines maximum, verbs first.

**karinasirqueira.com/projects/airbnb**
- Case study structure: page title, one paragraph of context, then repeating
  blocks of `bold statement of the thing I made + what it improved` followed by
  two or three pieces of media.
- Almost no body copy. The bold statements carry the whole narrative.
- Minimal chrome on detail pages. Just a way back home.

## 5. What I do not want

- Template portfolio grid of equal squares with hover overlays.
- Skills bars, percentage rings, tech-stack icon rows, testimonial carousels.
- Dark hero with a single acid-green accent. Cream background with a serif
  display and a terracotta accent. Newspaper broadsheet with hairline rules.
  These are the current AI-design defaults. Avoid all three.
- Scroll-jacking, cursor trails, or animation on every element.
- Autoplaying audio, ever.

## 6. Design direction

### Start with my inspiration images

I've collected a load of screenshots and images of sites, layouts and visual
styles I want this site to feel like. They're in `/inspiration/` in this repo.
Read every one of them before you plan anything.

These images are the primary source for the **vibe**: palette, type feeling,
density, spacing, contrast, how much white space, how loud or quiet, what the
images do on the page. Weight them above your own instincts and above the three
reference sites in section 4, which are there for structural principles.

How to use them:

1. Look at all of them, then write me a short read of what you extracted. Group
   it into palette, typography, layout and density, motion, and overall mood.
   Name the specific things you're seeing, not vague adjectives.
2. Tell me what recurs across most of them. The repeated stuff is the real
   signal, a one-off is probably just a site I liked for other reasons.
3. Tell me where they conflict with each other, or with anything in this brief,
   and ask me which way to go. Do not quietly average them into mush, that's how
   you end up with something bland that matches none of them.
4. Do not copy any single one. I want a site that would sit comfortably in that
   folder, not a clone of an image in it.

If any of the images are of my own work rather than other sites, say so and treat
those as content and tone reference rather than layout reference.

### My subject world

My subject world is combat sports and gyms, and it has a rich visual vernacular
you should mine before reaching for anything generic: fight posters and weigh-in
cards, tale of the tape stat comparisons, red corner and blue corner, round
timers and bell schedules, judges' scorecards, hand wrap and glove tape, ring
apron sponsor bands, hard direct flash on sweat, harsh overhead ring light
against black surroundings.

Use that vernacular in the **structural devices**, not as decoration. A campaign
result presented as a tale of the tape is on brief. A cartoon boxing glove
cursor is not. This is also how the marketing work gets the same energy as the
photography, which is the whole trick the site needs to pull off.

If the inspiration images point somewhere different from this, the images win.
Flag the conflict and tell me what you're dropping.

### Token system

Spend the boldness in one place. Pick the signature element, then keep
everything around it quiet and precise.

Before you code, produce a token system:
- Palette: four to six named hex values.
- Type: a characterful display face used with restraint, a body face, and a
  utility face for captions, data and labels. Not the pairings you would reach
  for by default.
- Layout concept in one or two sentences plus ASCII wireframes for the home page.
- The single signature element the site is remembered by.

Then review that plan against this brief and tell me which parts you would have
produced for any portfolio, and revise those.

## 7. Site architecture

```
/                     Home. Hero, featured work, the long index, contact.
/work/[slug]          Case study detail pages. Karina structure.
/photography          Full photography archive. Lightbox.
/videography          Full video archive.
/about                Who I am, how I work, kit, contact.
```

Home page order:

1. **Hero.** Kinetic display type. My name, and the four things I do. Not a
   headshot, not a slogan.
2. **Featured work.** Three to four pieces, one signature interaction. Mixed
   disciplines deliberately, so a photo piece sits next to an email campaign and
   the range reads immediately.
3. **The index.** Everything else, dense and scannable. Client, one line, year,
   whether it was Motohaus, CSJACKO or freelance. This is the credibility block.
4. **Contact.** The expanding full-height footer. Email, LinkedIn, CV download,
   one line on what I'm looking for. No contact form, hiring managers just email.

## 8. Content model

I do not have my assets organised yet, so build this content-first. I want to add
real work by dropping files in and editing frontmatter, never by editing
components.

Use Astro content collections. Schema for `src/content/work/`:

```yaml
title: string
client: string
discipline: photography | videography | paid-social | email | social-management
context: motohaus | csjacko | freelance
year: number
featured: boolean
summary: string        # one line for the index
statement: string      # the bold opening sentence for the detail page
outcome: string        # what changed, numbers where I have them
cover: image
media:                 # repeating blocks, Karina structure
  - statement: string
    outcome: string
    assets: [image | video]
```

Seed it with realistic placeholder entries across all five disciplines using the
brands named above, so I can see the layout under real-ish load. Make it obvious
which copy is placeholder. Do not invent specific performance numbers, leave
those as `TKTK` for me to fill in.

Also: some of the Motohaus work is my employer's, so build in a per-item flag for
whether results can be shown publicly, defaulting to hidden.

## 9. Stack and constraints

- **Astro** with TypeScript. Chosen deliberately: content collections mean I add
  work by dropping files in and editing frontmatter, the image pipeline is built
  in, and it ships near-zero client JS so the site stays fast on a phone on 4G,
  which is where a hiring manager will actually open it.
- **Tailwind** for layout, with the palette and type scale defined as design
  tokens in the config rather than scattered arbitrary values.
- Motion: one small library only, for the signature interaction. Motion One or
  GSAP. No full animation framework.
- Static build. Deploy target Cloudflare Pages or Netlify.
- No CMS, no database, no auth.

Performance is not optional on an image and video portfolio:
- All images through Astro's image component. AVIF with WebP fallback,
  responsive `srcset`, explicit width and height on everything.
- Lazy load everything below the fold. Eager load only the hero.
- Video previews: muted, looping, `playsinline`, poster frame always set, and
  they do not load until in view. Full cuts behind a click, hosted externally
  rather than served from the repo.
- Target: Lighthouse 90+ on mobile performance with a realistic set of assets.

Accessibility floor, no announcements about it:
- Responsive down to 375px.
- Visible keyboard focus states, and the signature interaction must be operable
  by keyboard.
- `prefers-reduced-motion` respected properly, not just faster.
- Real alt text on the placeholder images so I keep the habit.

## 10. How I want you to work

I'm building this myself and I want to understand every file, so go in stages and
stop between them.

1. Read this brief and every image in `/inspiration/`. Ask me anything genuinely
   blocking, maximum three questions.
2. Give me your read of the inspiration images per section 6, then the design
   plan. Palette, type, layout wireframes, signature element, plus your
   self-critique of what reads generic. Stop and wait for my sign-off.
3. Scaffold the project and the content collections with seed data. No styling
   yet. Stop.
4. Build the home page to the approved design. Stop, and tell me what to look at.
5. Then case study template, then the archive pages, then the contact footer.

At each stop, tell me in two or three lines what changed and why. If you hit a
decision I did not cover in this brief, ask rather than guess.
