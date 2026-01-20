import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';
import { rehypeHeadingIds } from '@astrojs/markdown-remark';
import autolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import rehypeToc from 'rehype-toc';
import { loadEnv } from 'vite';

// Get the base path from environment or use default
const env = loadEnv('', process.cwd(), '');
const basePath = env.PUBLIC_BASE_PATH || '/tamntaptech1.github.io';

export default defineConfig({
  site: 'https://tamntaptech1.github.io',
  base: basePath,

  integrations: [
    mdx(),
    tailwind({
      applyBaseStyles: false,
    }),
  ],

  markdown: {
    rehypePlugins: [
      rehypeHeadingIds,
      rehypeSlug,
      [
        autolinkHeadings,
        {
          behavior: 'wrap',
          properties: {
            className: ['anchor-link'],
          },
        },
      ],
      [
        rehypeToc,
        {
          headings: ['h2', 'h3'],
          nav: false,
        },
      ],
    ],
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      wrap: true,
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'vi'],
  },

  vite: {
    build: {
      // Ensure proper base path handling
      assetsDir: '_astro',
    },
  },

  // Image optimization settings
  image: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.**',
      },
    ],
  },
});
