/**
 * Brand and title for the design walls.
 *
 * The category pages derive everything from the filenames in
 * src/assets/design/<category>, which is what makes adding a piece a file
 * drop. That stays true. What a filename cannot carry is which client the
 * piece was for, and the walls now filter by client.
 *
 * So this is a lookup, not a manifest: a stem that is not listed still
 * renders, it just falls to the default brand. Nothing breaks by being
 * forgotten here, which is the same bargain the glob already makes.
 */

import type { Brand } from './brands';

/** Everything on the site predating Splash was Motohaus work. */
const DEFAULT_BRAND: Brand = 'motohaus';

/* Keyed on the filename stem, without extension. Only exceptions are listed:
   anything beginning `splash-` is resolved by prefix below, and everything
   else falls to the default. */
const BRAND_OVERRIDES: Record<string, Brand> = {
  'dark-star-brand-redesign': 'freelance',
  'stick-with-boop-brand-board': 'freelance',
};

export function brandForAsset(stem: string): Brand {
  if (BRAND_OVERRIDES[stem]) return BRAND_OVERRIDES[stem];
  if (stem.startsWith('splash-')) return 'splash';
  return DEFAULT_BRAND;
}

/* Words the auto-labeller gets wrong, because it only knows how to capitalise
   the first letter of each hyphenated chunk. */
const FIXUPS: Record<string, string> = {
  Dc: 'DC',
  Ugc: 'UGC',
  Ccom: 'C-COM',
  Nexx: 'NEXX',
  Keis: 'KEIS',
  Sw: 'SW',
  Motech: 'MOTECH',
  Wknd: 'Weekend',
  Vs: 'vs',
  Ac: 'AC',
};

/** Titles worth saying properly rather than letting the filename decide. */
const TITLES: Record<string, string> = {
  'splash-dc-drop-restock': 'DC Drop Restock campaign',
  'splash-welcome-1': 'Welcome series, email 1',
  'splash-welcome-2': 'Welcome series, email 2',
  'splash-welcome-3': 'Welcome series, email 3',
  'splash-welcome-4': 'Welcome series, email 4',
  'splash-abandoned-browsing': 'Browse abandonment flow',
  'splash-abandoned-checkout-1': 'Abandoned checkout, email 1',
  'splash-abandoned-checkout-2': 'Abandoned checkout, email 2',
  'splash-abandoned-checkout-3': 'Abandoned checkout, email 3',
  'splash-abandoned-checkout-4': 'Abandoned checkout, email 4',
  'splash-add-to-cart': 'Add to cart flow',
  'splash-post-purchase': 'Post purchase flow',
  'splash-starter-pack-1': 'Starter Pack flow, email 1',
  'splash-starter-pack-2': 'Starter Pack flow, email 2',
  'splash-starter-pack-3': 'Starter Pack flow, email 3',
  'splash-compact-comics-1': 'Compact Comics flow, email 1',
  'splash-compact-comics-2': 'Compact Comics flow, email 2',
  'splash-absolute-drop': 'Absolute range flow',
  'splash-sale-story': 'Sale story',
  'splash-ugc-thumbnail': 'Creator UGC advert thumbnail',
  'splash-whatnot-overlay': 'Whatnot live overlay',
  'splash-logo-lockup': 'The Splash lockup',
  'splash-logo-flatlay': 'Lockup on the desk',
  'splash-compliment-slip-front': 'Compliment slip, front',
  'splash-compliment-slip-back': 'Compliment slip, back',
  'splash-cap': 'Splash cap',
  'splash-tee': 'Splash tee',
};

/** The filename as a readable label, with the acronyms put right. */
export function titleForAsset(stem: string): string {
  if (TITLES[stem]) return TITLES[stem];
  return stem
    .split('-')
    .filter(Boolean)
    .map((w) => (/^\d/.test(w) ? w : w.charAt(0).toUpperCase() + w.slice(1)))
    .map((w) => FIXUPS[w] ?? w)
    .join(' ');
}
