// @ts-check
import { defineConfig, envField } from 'astro/config';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';

// Static site. Only /api/cv/* runs on demand (Vercel functions): the CV lead gate
// (email -> verification code -> CV sent by email). Everything else is prerendered.
export default defineConfig({
  site: 'https://www.angelanampa.dev',
  output: 'static',
  adapter: vercel(),
  security: { checkOrigin: true },
  env: {
    schema: {
      RESEND_API_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      CV_FROM: envField.string({ context: 'server', access: 'secret', optional: true }),
      NOTIFY_TO: envField.string({ context: 'server', access: 'secret', optional: true }),
      OTP_SECRET: envField.string({ context: 'server', access: 'secret', optional: true }),
      UPSTASH_REDIS_REST_URL: envField.string({ context: 'server', access: 'secret', optional: true }),
      UPSTASH_REDIS_REST_TOKEN: envField.string({ context: 'server', access: 'secret', optional: true }),
    },
  },
  trailingSlash: 'never',
  server: { port: 4321 },
  prefetch: { prefetchAll: true, defaultStrategy: 'viewport' },
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    icon(),
    sitemap({
      i18n: { defaultLocale: 'es', locales: { es: 'es-PE', en: 'en-US' } },
    }),
  ],
  vite: { plugins: [tailwindcss()] },
  devToolbar: { enabled: false },
});
