// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// Static build, deploy target Cloudflare Pages or Netlify.
export default defineConfig({
  site: 'https://csjacko.com',
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
