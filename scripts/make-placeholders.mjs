/**
 * Generates in-palette placeholder stills so the layout can be judged under
 * realistic load before any real work is dropped in.
 *
 * These are deliberately not grey boxes and deliberately not stock photos. They
 * are flat palette fields with a single geometric mark, so they read as
 * "asset goes here" at a glance while still letting you see whether the grid,
 * the aspect ratios and the dark rooms actually hold together.
 *
 * Run: npm run placeholders
 * Safe to re-run. Delete a file and re-run to regenerate just that one.
 */

import sharp from 'sharp';
import { mkdir, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'assets', 'placeholder');

const PALETTE = {
  flare: '#e62317',
  flareDeep: '#a81409',
  bone: '#efede8',
  ink: '#0b0b0c',
  corner: '#111113',
  cornerLift: '#1b1b1e',
};

/**
 * Ground / mark pairs, cycled so a gallery of these has some rhythm.
 *
 * Grounds are all near-black and marks are red or bone, matching the site.
 * Real photography here will be hard flash on dark surroundings, so a dark
 * stand-in is also the honest one: it shows how the rooms actually behave.
 */
const SCHEMES = [
  { ground: PALETTE.ink, mark: PALETTE.flare },
  { ground: PALETTE.corner, mark: PALETTE.flareDeep },
  { ground: PALETTE.ink, mark: PALETTE.bone },
  { ground: PALETTE.cornerLift, mark: PALETTE.flare },
  { ground: PALETTE.corner, mark: PALETTE.bone },
  { ground: PALETTE.ink, mark: PALETTE.flareDeep },
];

const SHAPES = ['bars', 'burst', 'arc', 'grid', 'corner', 'split'];

/**
 * Pure geometry, no text: sharp rasterises SVG through librsvg, and text there
 * depends on host fonts being resolvable. Geometry always renders identically.
 * The word PLACEHOLDER is drawn in HTML by the Figure component instead, which
 * also means it disappears the moment an entry stops being a placeholder.
 */
function svg(w, h, scheme, shape, seed) {
  const { ground, mark } = scheme;
  const cx = w / 2;
  const cy = h / 2;
  const u = Math.min(w, h) / 12;
  let body = '';

  if (shape === 'bars') {
    const n = 5;
    for (let i = 0; i < n; i++) {
      const bh = u * (0.5 + ((seed + i) % 4) * 0.45);
      body += `<rect x="${u}" y="${cy - (n * u * 1.6) / 2 + i * u * 1.6}" width="${w - u * 2 - bh * 2}" height="${u * 0.9}" fill="${mark}" opacity="${0.35 + i * 0.13}"/>`;
    }
  } else if (shape === 'burst') {
    const pts = 8;
    let d = '';
    for (let i = 0; i < pts * 2; i++) {
      const r = i % 2 === 0 ? u * 3.4 : u * 1.5;
      const a = (Math.PI / pts) * i - Math.PI / 2;
      d += `${i ? 'L' : 'M'}${(cx + Math.cos(a) * r).toFixed(1)},${(cy + Math.sin(a) * r).toFixed(1)}`;
    }
    body = `<path d="${d}Z" fill="${mark}"/>`;
  } else if (shape === 'arc') {
    body =
      `<circle cx="${cx}" cy="${cy}" r="${u * 3.2}" fill="none" stroke="${mark}" stroke-width="${u * 0.7}"/>` +
      `<circle cx="${cx}" cy="${cy}" r="${u * 1.2}" fill="${mark}"/>`;
  } else if (shape === 'grid') {
    for (let x = 0; x < 4; x++) {
      for (let y = 0; y < 4; y++) {
        if ((x + y + seed) % 3 === 0) continue;
        body += `<rect x="${cx - u * 3.6 + x * u * 1.9}" y="${cy - u * 3.6 + y * u * 1.9}" width="${u * 1.3}" height="${u * 1.3}" fill="${mark}" opacity="0.85"/>`;
      }
    }
  } else if (shape === 'corner') {
    body =
      `<path d="M0,0 L${u * 5},0 L0,${u * 5} Z" fill="${mark}"/>` +
      `<path d="M${w},${h} L${w - u * 5},${h} L${w},${h - u * 5} Z" fill="${mark}" opacity="0.6"/>`;
  } else {
    body =
      `<rect x="0" y="0" width="${w}" height="${h / 2}" fill="${mark}" opacity="0.9"/>` +
      `<circle cx="${cx}" cy="${h / 2}" r="${u * 2}" fill="${ground}"/>`;
  }

  /* Hairline frame reads as a crop mark and makes the edges of each asset
     legible against a same-coloured room. */
  const frame = `<rect x="${u * 0.4}" y="${u * 0.4}" width="${w - u * 0.8}" height="${h - u * 0.8}" fill="none" stroke="${mark}" stroke-width="2" opacity="0.4"/>`;

  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">` +
      `<rect width="${w}" height="${h}" fill="${ground}"/>${body}${frame}</svg>`,
  );
}

const RATIOS = [
  { name: 'portrait', w: 1400, h: 1750, count: 8 },
  { name: 'landscape', w: 1800, h: 1012, count: 10 },
  { name: 'square', w: 1200, h: 1200, count: 6 },
  { name: 'story', w: 1080, h: 1920, count: 6 },
];

async function exists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

await mkdir(OUT, { recursive: true });

let made = 0;
let kept = 0;
let i = 0;

for (const ratio of RATIOS) {
  for (let n = 1; n <= ratio.count; n++) {
    const file = join(OUT, `${ratio.name}-${String(n).padStart(2, '0')}.jpg`);
    i++;

    if (await exists(file)) {
      kept++;
      continue;
    }

    await sharp(svg(ratio.w, ratio.h, SCHEMES[i % SCHEMES.length], SHAPES[i % SHAPES.length], i))
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(file);

    made++;
  }
}

console.log(`placeholders: ${made} written, ${kept} already present -> ${OUT}`);
