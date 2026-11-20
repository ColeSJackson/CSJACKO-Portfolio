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
    'Farnborough, Hampshire. Happy to work remote, or anywhere within about 45 minutes.',

  lookingFor:
    'A content, social or video role on a marketing team, full-time or part-time. Content Executive, Social Media Executive, Videographer/Editor and similar titles suit me best :)',
} as const;

/**
 * Splash Comics, the side business. Its own constant rather than more fields on
 * SITE: these are a different brand's details, and the /splash page, the
 * homepage band and the strategy page all need the same handle and shop URL.
 */
export const SPLASH = {
  shop: 'https://splashcomics.co.uk',
  handle: '@splash_comics_',
  tiktok: 'https://www.tiktok.com/@splash_comics_',
  instagram: 'https://www.instagram.com/splash_comics_',
} as const;
