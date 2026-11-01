// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import frenchTypography from './integrations/french-typography.mjs';

export default defineConfig({
  site: 'https://www.growthify.fr',
  // Les anciennes URLs Webflow n'avaient pas de « / » final : on garde ce format.
  trailingSlash: 'never',
  build: { format: 'file' },
  prefetch: { prefetchAll: true, defaultStrategy: 'viewport' },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404'),
    }),
    frenchTypography(),
  ],
});
