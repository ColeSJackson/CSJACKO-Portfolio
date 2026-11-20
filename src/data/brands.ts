/**
 * One brand vocabulary, shared by the video wall and the design walls.
 *
 * Both pages filter by brand and both need the same words for the same client,
 * so the list lives here rather than being declared twice and drifting. The
 * order is the filter order: Splash first because it is the newest and the
 * largest body of work, then the named employers, then the catch-alls.
 *
 * `motohaus` is deliberately "Other Motohaus brands" rather than "Motohaus".
 * KEIS is a Motohaus brand too, and a chip reading "Motohaus" beside one
 * reading "KEIS" would look like a parent category that also contained the
 * KEIS work, which it does not: the two are mutually exclusive filters.
 */

export const BRAND_ORDER = [
  'splash',
  'keis',
  'oneills',
  'csjacko',
  'motohaus',
  'freelance',
] as const;

export type Brand = (typeof BRAND_ORDER)[number];

export const BRAND_NAME: Record<Brand, string> = {
  splash: 'Splash Comics',
  keis: 'KEIS',
  oneills: "O'Neills",
  csjacko: 'CSJACKO',
  motohaus: 'Other Motohaus brands',
  freelance: 'Freelance',
};

export const brandRank = (b: Brand) => BRAND_ORDER.indexOf(b);

/** Only the brands actually represented. A chip with nothing behind it lies. */
export function brandsPresent(items: { brand: Brand }[]): Brand[] {
  return BRAND_ORDER.filter((b) => items.some((i) => i.brand === b));
}
