/**
 * Every video on the site, in one list.
 *
 * The Edit page used to derive itself from whatever posters happened to be in
 * src/assets/reels, with titles patched in by a lookup keyed on the filename.
 * That worked for six clips from one brand. It does not survive thirty-four
 * across four, because a filename cannot carry a brand, a year, or a link to
 * the case study the clip belongs to, and those are exactly the things the
 * wall now has to filter and label by.
 *
 * So the list is declared. Adding a reel is three lines here plus two files:
 * the MP4 at public/reels/<brand>/<slug>.mp4 and its poster at
 * src/assets/reels/<brand>/<slug>.jpg. Posters are globbed by slug rather than
 * named here, so a missing poster is a build error naming the slug rather than
 * a silently broken tile.
 */

import { BRAND_NAME, BRAND_ORDER, type Brand } from './brands';

/* The vocabulary is shared with the design walls, so it lives in ./brands.
   These aliases keep the page code reading in terms of reels. */
export type ReelBrand = Brand;
export const REEL_BRANDS = BRAND_ORDER;
export const REEL_BRAND_LABEL = BRAND_NAME;

/** Folder under public/reels and src/assets/reels. Same key, so one name. */
export type Reel = {
  slug: string;
  title: string;
  brand: ReelBrand;
  /**
   * Optional on purpose. Six of these predate the list and nobody has
   * confirmed what year they were cut; printing a guess beside the brand would
   * be a fabricated number on a portfolio, which is worse than printing the
   * brand alone. The card renders without it. See _incoming/other-videos/notes.md.
   */
  year?: number;
  /** Case study slug under /work, when the clip belongs to one. */
  project?: string;
  /**
   * Lower sorts first. Unset falls to the end, newest-first within the brand
   * order above, so a newly added reel appears rather than vanishing.
   */
  order?: number;
};

export const REELS: Reel[] = [
  /* -- The openers ------------------------------------------------------
     My pick of the six strongest, chosen to show range rather than to rank
     them: the 3D shop, a product unboxing, a launch ad, a convention film, a
     second unboxing and a product reveal. Cole has not confirmed this set. */
  { slug: 'splash-zone-walkthrough', title: 'Inside the Splash Zone', brand: 'splash', year: 2026, order: 1 },
  { slug: 'the-new-g901-unboxing', title: 'KEIS G901 Unboxing', brand: 'keis', order: 2 },
  { slug: 'shop-launch-ad', title: 'The Shop Launch Ad', brand: 'splash', year: 2026, order: 3 },
  { slug: 'megacon-farnborough-cinematic', title: 'MegaCon Farnborough, Cinematic', brand: 'splash', year: 2026, order: 4 },
  { slug: 'the-g601-unboxing', title: 'KEIS G601 Unboxing', brand: 'keis', order: 5 },
  { slug: 'coles-splash-pack', title: "Cole's Splash Pack", brand: 'splash', year: 2026, order: 6 },

  /* -- KEIS ------------------------------------------------------------- */
  { slug: 'keis-reel-111', title: 'KEIS Reel 1', brand: 'keis' },
  { slug: 'keis-reel-222', title: 'KEIS Reel 2', brand: 'keis' },

  /* -- Other Motohaus brands -------------------------------------------
     Both titles are mine, not Cole's, and neither brand is confirmed. */
  { slug: 'private-landing-edit', title: 'Landing Page Edit', brand: 'motohaus' },
  { slug: 'reel-1', title: 'Social Reel 1', brand: 'motohaus' },

  /* -- Splash Comics: paid and product --------------------------------- */
  { slug: 'basket-discount-meter', title: 'Basket Discount Meter', brand: 'splash', year: 2026 },
  { slug: 'ugc-advert', title: 'Creator UGC Advert', brand: 'splash', year: 2026 },
  { slug: 'absolute-batman-splash-pack', title: 'Absolute Batman Splash Pack', brand: 'splash', year: 2026 },
  { slug: 'mystery-back-issue', title: 'Mystery Back Issue', brand: 'splash', year: 2026 },
  { slug: 'lil-packaging-ccom', title: 'Lil Packaging C-COM', brand: 'splash', year: 2026 },

  /* -- Splash Comics: the Origins series -------------------------------- */
  { slug: 'splash-is-live', title: 'Splash Is Live', brand: 'splash', year: 2026 },
  { slug: 'welcome-to-splash', title: 'Welcome to Splash', brand: 'splash', year: 2026 },
  { slug: 'what-is-splash', title: 'What Is Splash', brand: 'splash', year: 2026 },
  { slug: 'car-boot-failure', title: 'Car Boot Failure', brand: 'splash', year: 2026 },
  { slug: 'the-first-order', title: 'The First Order', brand: 'splash', year: 2026 },
  { slug: 'packing-the-first-order', title: 'Packing the First Order', brand: 'splash', year: 2026 },
  { slug: 'the-splash-dream', title: 'The Splash Dream', brand: 'splash', year: 2026 },
  { slug: 'what-makes-splash-different', title: 'What Makes Splash Different', brand: 'splash', year: 2026 },

  /* -- Splash Comics: explainers ---------------------------------------- */
  { slug: 'daredevil-where-to-start', title: 'Daredevil, Where to Start', brand: 'splash', year: 2026 },
  { slug: 'comic-ages-explained', title: 'Comic Ages Explained', brand: 'splash', year: 2026 },
  { slug: 'cosmic-vs-street-level', title: 'Cosmic vs Street Level', brand: 'splash', year: 2026 },
  { slug: 'how-to-get-into-comics', title: 'How to Get Into Comics', brand: 'splash', year: 2026 },
  { slug: 'singles-vs-trades', title: 'Singles vs Trades', brand: 'splash', year: 2026 },
  { slug: 'what-makes-a-comic-valuable', title: 'What Makes a Comic Valuable', brand: 'splash', year: 2026 },
  { slug: 'bullseye-show-vs-comics', title: 'Bullseye, Show vs Comics', brand: 'splash', year: 2026 },
  { slug: 'the-purple-man', title: 'The Purple Man', brand: 'splash', year: 2026 },

  /* -- Splash Comics: conventions --------------------------------------- */
  { slug: 'comic-mart-london', title: 'Comic Mart London', brand: 'splash', year: 2026 },
  { slug: 'comic-con-guildford', title: 'Comic Con Guildford', brand: 'splash', year: 2026 },
  { slug: 'megacon-farnborough-timelapse', title: 'MegaCon Farnborough, Timelapse', brand: 'splash', year: 2026 },
];

/** Sorted for display: explicit `order` first, then brand order, then title. */
export function sortReels(reels: Reel[]): Reel[] {
  const brandRank = (b: ReelBrand) => BRAND_ORDER.indexOf(b);
  return [...reels].sort((a, b) => {
    if (a.order != null && b.order != null) return a.order - b.order;
    if (a.order != null) return -1;
    if (b.order != null) return 1;
    return brandRank(a.brand) - brandRank(b.brand) || a.title.localeCompare(b.title);
  });
}

/** Which brands actually have reels. A chip with nothing behind it is a lie. */
export function brandsWithReels(reels: Reel[]): ReelBrand[] {
  return BRAND_ORDER.filter((b) => reels.some((r) => r.brand === b));
}

export const reelSrc = (r: Reel) => `/reels/${r.brand}/${r.slug}.mp4`;
