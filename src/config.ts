/**
 * Contact details, in one place.
 *
 * These appear in the footer on every page and in page metadata. Keeping them
 * here means changing an email address is one edit rather than a search across
 * components, and it is the first place to look when something needs updating
 * before the site goes public.
 */

export const SITE = {
  name: 'Cole SJ',
  brand: 'CSJACKO',

  /** Real. */
  email: 'cjjackson616@outlook.com',

  /** TODO: replace with the real profile slug. Currently a dead LinkedIn URL. */
  linkedin: 'https://www.linkedin.com/in/',

  /** A placeholder PDF is committed at public/cv.pdf. Replace the file, not
      this path. */
  cv: '/cv.pdf',

  location:
    'Farnborough, Hampshire. Commutable to London, happy to work remote.',

  lookingFor:
    'A full-time content, social or brand role on a marketing team. Marketing Executive and similar titles would suit me best :)',
} as const;
