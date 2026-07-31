/**
 * Prepares source media for the site.
 *
 * Camera and design exports are far larger than anything the site serves, so
 * committing the originals would add hundreds of megabytes to the repo and
 * minutes to every build in exchange for pixels nobody downloads. This resizes
 * each source folder to a sensible ceiling and writes into src/assets, which is
 * what Astro's image pipeline then reads.
 *
 * Each folder gets its own rule, because the shapes are genuinely different:
 * a photograph is bounded on its long edge, a 9x16 ad is already small, and a
 * full email screenshot is 1080 wide by 5000 tall and must be bounded on width
 * alone or it would be destroyed by a long-edge cap.
 *
 * EXIF orientation is applied rather than preserved (.rotate() with no
 * argument), because the pipeline strips metadata downstream and a portrait
 * frame relying on an orientation flag would render on its side.
 *
 * Run: npm run photos
 * Safe to re-run: existing outputs are skipped, so adding new files to a source
 * folder only processes the new ones.
 */

import sharp from 'sharp';
import { readdir, mkdir, access, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join, extname, basename } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const JOBS = [
  {
    src: 'Photography 100',
    out: join('shoot'),
    /* Bound the long edge: frames are landscape or portrait and both need the
       same ceiling. 2200 leaves headroom above the 1800px the pipeline emits. */
    fit: { width: 2200, height: 2200, fit: 'inside' },
    quality: 80,
  },
  {
    src: 'Paid social assets',
    out: join('design', 'paid-social'),
    /* Already 720-1080 wide. Cap rather than upscale. */
    fit: { width: 1080, withoutEnlargement: true },
    quality: 82,
  },
  {
    src: 'Email Design',
    out: join('design', 'email'),
    /* Full email screenshots: ~1080 x 5000. Width-only, or a long-edge cap
       would shrink them to 450px wide and make the copy unreadable. */
    fit: { width: 1080, withoutEnlargement: true },
    quality: 82,
  },
];

const ALLOWED = new Set(['.jpg', '.jpeg', '.png']);
/* The source folders have picked up a font archive, an AI-generated PNG and the
   usual macOS metadata. None of it is work. */
const SKIP = [/^\./, /^chatgpt image/i, /\.zip$/i];

function slugify(name) {
  return basename(name, extname(name))
    .replace(/[_\s]+/g, '-')
    .replace(/[^a-zA-Z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}

async function exists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

const mb = (n) => (n / 1048576).toFixed(1);

for (const job of JOBS) {
  const srcDir = join(ROOT, job.src);
  const outDir = join(ROOT, 'src', 'assets', job.out);

  if (!(await exists(srcDir))) {
    console.log(`skip  ${job.src} (folder not found)`);
    continue;
  }

  await mkdir(outDir, { recursive: true });

  const files = (await readdir(srcDir))
    .filter((f) => ALLOWED.has(extname(f).toLowerCase()))
    .filter((f) => !SKIP.some((re) => re.test(f)))
    .sort();

  let made = 0;
  let kept = 0;
  let bytesIn = 0;
  let bytesOut = 0;

  for (const file of files) {
    const src = join(srcDir, file);
    const dest = join(outDir, `${slugify(file)}.jpg`);

    bytesIn += (await stat(src)).size;

    if (await exists(dest)) {
      bytesOut += (await stat(dest)).size;
      kept++;
      continue;
    }

    await sharp(src)
      .rotate()
      .resize(job.fit)
      .jpeg({ quality: job.quality, mozjpeg: true, progressive: true })
      .toFile(dest);

    bytesOut += (await stat(dest)).size;
    made++;
  }

  console.log(
    `${job.src}\n` +
      `  ${made} processed, ${kept} already present\n` +
      `  ${mb(bytesIn)}MB source -> ${mb(bytesOut)}MB committed\n` +
      `  -> src/assets/${job.out}`,
  );
}
