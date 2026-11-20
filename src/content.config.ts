import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

export const DISCIPLINES = [
  'campaign',
  'photography',
  'videography',
  'paid-social',
  'email',
  'social-management',
] as const;

export const CONTEXTS = [
  'motohaus',
  'oneills',
  'splash',
  'csjacko',
  'freelance',
] as const;

/** The four top-level sections, matching the words in the hero. */
export const SECTIONS = ['shoot', 'edit', 'design', 'strategy'] as const;

/** Groups within a section. Only design uses these today. */
export const SUBSECTIONS = ['paid-social', 'email', 'print', 'brand'] as const;

export type SubsectionKey = (typeof SUBSECTIONS)[number];

/** Brands with a planned programme. One button each on /strategy. */
export const BRANDS = ['splash', 'keis', 'sw-motech', 'nexx'] as const;

export type BrandKey = (typeof BRANDS)[number];

export const BRAND_LABEL: Record<BrandKey, string> = {
  splash: 'Splash Comics',
  keis: 'KEIS',
  'sw-motech': 'SW-MOTECH',
  nexx: 'NEXX',
};

/** The season each brand's plan covers. KEIS runs a winter season rather than
    a calendar year, which is why its plan straddles two of them. */
export const BRAND_PERIOD: Record<BrandKey, string> = {
  splash: 'Nov 2026 onwards',
  keis: '26/27 season',
  'sw-motech': '2026',
  nexx: '2026',
};

/** Channels a programme can run on. Fixed order so a brand page never
    reshuffles its strands between builds. */
export const STRANDS = [
  'drops',
  'paid-social',
  'email',
  'video',
  'organic-social',
  'creators',
] as const;

export type StrandKey = (typeof STRANDS)[number];

export const STRAND_LABEL: Record<StrandKey, string> = {
  drops: 'Drops',
  'paid-social': 'Paid social',
  email: 'Email',
  video: 'Video',
  'organic-social': 'Organic social',
  creators: 'Creators',
};

export const SECTION_LABEL: Record<(typeof SECTIONS)[number], string> = {
  shoot: 'Shoot',
  edit: 'Edit',
  design: 'Design',
  strategy: 'Strategy',
};

export const SUBSECTION_LABEL: Record<(typeof SUBSECTIONS)[number], string> = {
  'paid-social': 'Paid social',
  email: 'Email',
  print: 'Print and event',
  brand: 'Brand',
};

/** Full titles for the three design category pages and their landing cards. */
export const SUBSECTION_TITLE: Record<(typeof SUBSECTIONS)[number], string> = {
  'paid-social': 'Paid social designs',
  email: 'Email campaign designs',
  print: 'Print and event designs',
  brand: 'Brand design',
};

/** Fixed order so a section page never reshuffles its groups between builds. */
export const SUBSECTION_ORDER = ['paid-social', 'email', 'print', 'brand'] as const;

/** Human labels. Kept here so no component ever hardcodes a discipline name. */
export const DISCIPLINE_LABEL: Record<(typeof DISCIPLINES)[number], string> = {
  campaign: 'Campaign',
  photography: 'Photography',
  videography: 'Videography',
  'paid-social': 'Paid social',
  email: 'Email',
  'social-management': 'Social',
};

export const CONTEXT_LABEL: Record<(typeof CONTEXTS)[number], string> = {
  motohaus: 'Motohaus',
  oneills: "O'Neills",
  splash: 'Splash Comics',
  csjacko: 'CSJACKO',
  freelance: 'Freelance',
};

/** Short form for the dense index column. */
export const CONTEXT_SHORT: Record<(typeof CONTEXTS)[number], string> = {
  motohaus: 'MH',
  oneills: 'ON',
  splash: 'SC',
  csjacko: 'CS',
  freelance: 'FR',
};

const work = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
  schema: ({ image }) => {
    /* A media asset is either a still or a silent looping preview. Full cuts are
       never served from the repo: `href` points at the hosted version. */
    const asset = z.discriminatedUnion('type', [
      z.object({
        type: z.literal('image'),
        src: image(),
        alt: z.string(),
      }),
      z.object({
        type: z.literal('video'),
        /* Path under /public to a silent looping preview. Muted, playsinline,
           and not loaded until in view. Optional: until you add one, the block
           renders the poster with a play affordance, which is a valid state
           rather than a broken one. */
        preview: z.string().optional(),
        poster: image(),
        alt: z.string(),
        /* The real cut, hosted externally. Long-form video stays off the repo:
           a full film is hundreds of megabytes, and serving it ourselves would
           mean paying for bandwidth a video host gives away.

           Short vertical reels are the exception and live in public/reels,
           served by this site. Re-encoded for web they are single-digit
           megabytes each, which is cheap enough to host directly, and it keeps
           the viewer on the site instead of handing them to a third party
           mid-portfolio. See src/pages/edit.astro.

           `embed` is a YouTube or Vimeo URL that the player swaps in when
           someone presses play. `href` is the plain link-out fallback. */
        embed: z.string().url().optional(),
        href: z.string().url().optional(),
      }),
    ]);

    return z.object({
      title: z.string(),
      client: z.string(),

      /* Which of the four top-level pages this belongs to. Required, because a
         piece with no section would silently vanish from the site. */
      section: z.enum(SECTIONS),

      /* Group within a section. Design splits into paid social, email and
         print; the other sections do not group. */
      subsection: z.enum(SUBSECTIONS).optional(),

      /* An array, because a campaign is genuinely several crafts at once:
         Winter Riders Wanted was planned, shot and cut, and picking one of
         those to print would misdescribe it. A bare string is still accepted
         and lifted into a single-item array, so the older entries did not all
         need rewriting to add a field they do not use. */
      discipline: z
        .union([z.enum(DISCIPLINES), z.array(z.enum(DISCIPLINES)).min(1)])
        .transform((d) => (Array.isArray(d) ? d : [d])),
      context: z.enum(CONTEXTS),
      year: z.number().int(),

      /* Featured pieces become rounds on the scorecard. `round` fixes their
         order; without it the card would reshuffle on every build. */
      featured: z.boolean().default(false),
      round: z.number().int().optional(),

      summary: z.string(), // one line, for the index

      /* Optional, because not every piece needs them. Some work explains
         itself in a summary and a credit line, and padding it out with a
         statement written for the sake of the template reads worse than
         leaving it out. Anything rendering these must handle their absence. */
      statement: z.string().optional(),
      outcome: z.string().optional(),

      /* Optional. A revealed campaign can be real and written up before its
         imagery has been handed over, and the alternative to an absent hero is
         a borrowed photograph from a different shoot presented as this one,
         which is worse than no photograph. The page renders without it. */
      cover: image().optional(),
      coverAlt: z.string().optional(),

      /* Points at a brand on the Edit wall, so a case study can link straight
         to that brand's videos rather than at the top of all thirty-four.
         Matches the keys in src/data/brands.ts. */
      reelBrand: z
        .enum(['splash', 'keis', 'oneills', 'csjacko', 'motohaus', 'freelance'])
        .optional(),

      /* Some of the Motohaus work is the employer's. Results stay hidden unless
         this is explicitly flipped, and the stat strip renders a WITHHELD
         marker rather than silently collapsing. */
      publicResults: z.boolean().default(false),

      /* Numbers for the tale of the tape. Only rendered when publicResults. */
      stats: z
        .array(z.object({ label: z.string(), value: z.string() }))
        .default([]),

      /* Marks a piece as withheld. Was inferred by testing whether `statement`
         began with CONFIDENTIAL, which broke the moment a statement became
         optional, and tied a display state to the wording of a sentence. */
      confidential: z.boolean().default(false),

      /* Where the work actually lives, when it is public. Rendered as a
         credited link out, so a reader can go and see it running rather than
         taking the case study's word for it. */
      externalUrl: z.string().url().optional(),

      /** Shown beside the external link. Says what was mine. */
      credit: z.string().optional(),

      /* Karina structure: repeating statement + outcome + media blocks. */
      media: z
        .array(
          z.object({
            /* Names the group, so one piece can separate Product from
               Lifestyle rather than running both into one wall. */
            label: z.string().optional(),
            statement: z.string().optional(),
            outcome: z.string().optional(),
            assets: z.array(asset).default([]),
          }),
        )
        .default([]),

      /* Flips a visible PLACEHOLDER marker on. Delete the line when the entry
         becomes real. */
      placeholder: z.boolean().default(false),

      draft: z.boolean().default(false),
    });
  },
});

/**
 * Planned programmes: the calendars behind the channels, not case studies of
 * finished work.
 *
 * Deliberately its own collection rather than a shape bolted onto `work`. A
 * case study is one artefact with a statement and an outcome; a programme is
 * dozens of dated sends with no single hero image, and forcing it through the
 * work schema would mean a cover image and an outcome for something that has
 * not run yet.
 *
 * Two shapes live here, because the source material comes in two:
 *
 *   `groups` is for a plan that is a list. KEIS's email season is 24 named
 *   sends across eight months, so it groups by month and each send is a row.
 *
 *   `cadence` is for a plan that is a rhythm. The organic social calendar is
 *   the same beat repeating every month across three brands, and listing sixty
 *   rows called "July Post 1" would say less than one line stating the beat.
 *
 * A programme can use either or both.
 */
const strategy = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/strategy' }),
  schema: z.object({
    brand: z.enum(BRANDS),
    strand: z.enum(STRANDS),
    title: z.string(),

    /** Shown under the title. "September 2026 to April 2027". */
    period: z.string(),

    /** Orders strands within a brand page. */
    order: z.number().int().default(0),

    summary: z.string(),

    /* Month-grouped, dated items. */
    groups: z
      .array(
        z.object({
          label: z.string(),
          items: z
            .array(
              z.object({
                title: z.string(),
                date: z.string().optional(),
                note: z.string().optional(),

                /* The two lines that make an email card worth reading rather
                   than just a name and a date. Optional because the plans were
                   written before the cards existed: a card renders correctly
                   without them and gains them the moment they are filled in,
                   rather than every entry needing a rewrite first. */
                subject: z.string().optional(),
                preview: z.string().optional(),

                /* A path to the case study this send belongs to, when the work
                   behind it has one. Only the launch email has this today, and
                   a card without it is plain text rather than a dead link. */
                href: z.string().optional(),
              }),
            )
            .default([]),
        }),
      )
      .default([]),

    /* Label/value facts describing a repeating rhythm. */
    cadence: z
      .array(z.object({ label: z.string(), value: z.string() }))
      .default([]),

    platforms: z.array(z.string()).default([]),

    draft: z.boolean().default(false),
  }),
});

export const collections = { work, strategy };
