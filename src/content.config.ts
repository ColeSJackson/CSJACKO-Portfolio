import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

export const DISCIPLINES = [
  'photography',
  'videography',
  'paid-social',
  'email',
  'social-management',
] as const;

export const CONTEXTS = ['motohaus', 'csjacko', 'freelance'] as const;

/** The four top-level sections, matching the words in the hero. */
export const SECTIONS = ['shoot', 'edit', 'design', 'strategy'] as const;

/** Groups within a section. Only design uses these today. */
export const SUBSECTIONS = ['paid-social', 'email', 'print'] as const;

export type SubsectionKey = (typeof SUBSECTIONS)[number];

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
};

/** Full titles for the three design category pages and their landing cards. */
export const SUBSECTION_TITLE: Record<(typeof SUBSECTIONS)[number], string> = {
  'paid-social': 'Paid social designs',
  email: 'Email campaign designs',
  print: 'Print and event designs',
};

/** Fixed order so a section page never reshuffles its groups between builds. */
export const SUBSECTION_ORDER = ['paid-social', 'email', 'print'] as const;

/** Human labels. Kept here so no component ever hardcodes a discipline name. */
export const DISCIPLINE_LABEL: Record<(typeof DISCIPLINES)[number], string> = {
  photography: 'Photography',
  videography: 'Videography',
  'paid-social': 'Paid social',
  email: 'Email',
  'social-management': 'Social',
};

export const CONTEXT_LABEL: Record<(typeof CONTEXTS)[number], string> = {
  motohaus: 'Motohaus',
  csjacko: 'CSJACKO',
  freelance: 'Freelance',
};

/** Short form for the dense index column. */
export const CONTEXT_SHORT: Record<(typeof CONTEXTS)[number], string> = {
  motohaus: 'MH',
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
        /* The real cut, hosted externally. Video is never committed to the
           repo: the files are tens of megabytes each, above the per-file limit
           on most static hosts, and serving them ourselves would mean paying
           for bandwidth a video host gives away.

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

      /* Kept as the human-readable label, independent of section. */
      discipline: z.enum(DISCIPLINES),
      context: z.enum(CONTEXTS),
      year: z.number().int(),

      /* Featured pieces become rounds on the scorecard. `round` fixes their
         order; without it the card would reshuffle on every build. */
      featured: z.boolean().default(false),
      round: z.number().int().optional(),

      summary: z.string(), // one line, for the index
      statement: z.string(), // the bold opening sentence on the detail page
      outcome: z.string(), // what changed

      cover: image(),
      coverAlt: z.string(),

      /* Some of the Motohaus work is the employer's. Results stay hidden unless
         this is explicitly flipped, and the stat strip renders a WITHHELD
         marker rather than silently collapsing. */
      publicResults: z.boolean().default(false),

      /* Numbers for the tale of the tape. Only rendered when publicResults. */
      stats: z
        .array(z.object({ label: z.string(), value: z.string() }))
        .default([]),

      /* Karina structure: repeating statement + outcome + media blocks. */
      media: z
        .array(
          z.object({
            statement: z.string(),
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

export const collections = { work };
