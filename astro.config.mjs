// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// Static build, deployed to Vercel. Build settings are pinned in vercel.json
// so CLI deploys and git-triggered deploys produce identical output.
export default defineConfig({
  // Must stay the live domain: the sitemap and canonical URLs are generated
  // from it. This was .com (a domain we do not own) until 2026-08-01.
  site: 'https://csjacko.co.uk',
  output: 'static',
  integrations: [sitemap()],
  // Pinned so the dev server does not collide with the default 4321, which
  // other projects on this machine already use.
  server: { port: Number(process.env.PORT) || 4331 },
  vite: {
    plugins: [tailwindcss()],
  },
  image: {
    // AVIF first with WebP fallback is handled per-<Picture>; this sets the
    // quality floor for the sharp service used across the whole site.
    service: {
      entrypoint: 'astro/assets/services/sharp',
      config: { limitInputPixels: false },
    },
  },
  build: {
    inlineStylesheets: 'auto',
  },
});
