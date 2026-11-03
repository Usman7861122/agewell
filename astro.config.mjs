import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Old addresses from the previous website. They are sent to the new pages so search rankings and links are kept.
// (Move these to real 301 redirects in CloudFront when it is set up.)
const redirects = {
  '/home': '/',
  '/about-us': '/about',
  '/meet-our-team': '/providers',
  '/longevity-medicine-anti-aging': '/longevity',
  '/advanced-aesthetics': '/aesthetics',
  '/iv-therapy': '/longevity',
  '/telehealth-medicine': '/resources/virtual-visits',
  '/call-us': '/contact',
  '/business-hours': '/contact',
  '/get-directions': '/contact',
  '/feedback': '/resources/feedback',
};

export default defineConfig({
  site: 'https://www.agewellmedicine.com',
  redirects,
  integrations: [
    react(),
    sitemap({
      // Keep error pages and redirect-only pages out of the sitemap.
      filter: (page) => !/\/(404|services)\/?$/.test(page) && !Object.keys(redirects).some((r) => page.endsWith(r + '/')),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
