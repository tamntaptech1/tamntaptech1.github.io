# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a GitHub Pages repository for Tam Nguyen's personal blog (tamntaptech1.github.io) built with Astro 5, TypeScript, and Tailwind CSS.

## Technology Stack

- **Astro 5** - Modern web framework for content-focused websites
- **TypeScript** - Strict mode enabled for type safety
- **Tailwind CSS** - Utility-first CSS with dark mode support
- **GitHub Actions** - Automated deployment to GitHub Pages
- **Pagefind** - Client-side search indexing

## Project Structure

```
src/
├── components/         # Reusable Astro components
│   ├── DarkModeToggle.astro      # Theme toggle button
│   ├── Search.astro               # Search link component
│   ├── SocialLink.astro           # Social media icon links
│   └── TableOfContents.astro      # Auto-generated TOC for blog posts
├── content/
│   ├── config.ts                  # Zod schema for blog posts
│   └── blog/                      # Blog post markdown files
├── layouts/
│   ├── BaseLayout.astro           # Main layout with header, footer, dark mode init
│   └── BlogLayout.astro          # Blog post layout with TOC sidebar
├── pages/
│   ├── index.astro               # Landing page
│   ├── blog/
│   │   ├── index.astro           # Blog listing grouped by year
│   │   └── [slug].astro          # Individual blog post pages
│   ├── search.astro              # Pagefind search interface
│   └── rss.xml.ts                # RSS feed generation
├── styles/
│   └── global.css                # Tailwind directives and custom styles
└── i18n/
    ├── en.json                   # English translations
    └── vi.json                   # Vietnamese translations
```

## Development Workflow

### Installation

```bash
npm install
```

### Local Development

```bash
npm run dev
```

Starts the development server at `http://localhost:4321`

### Building

```bash
npm run build
```

Builds the site to `dist/` directory. The postbuild script runs Pagefind indexing.

### Preview Production Build

```bash
npm run preview
```

Serves the production build locally for testing.

## Deployment

The site is automatically deployed to GitHub Pages via GitHub Actions when pushing to the `main` branch.

### Base Path Configuration

The site uses a base path of `/tamntaptech1.github.io` for GitHub Pages deployment. This is configured in:
- `astro.config.mjs` - `base: '/tamntaptech1.github.io'`
- `.github/workflows/deploy.yml` - `PUBLIC_BASE_PATH: /tamntaptech1.github.io`

For local development, you can override this by setting `PUBLIC_BASE_PATH=/` in your environment.

## Content Collections

Blog posts are managed through Astro's Content Collections system. The schema is defined in `src/content/config.ts`:

### Blog Post Schema

- `title` (string, required) - Post title
- `description` (string, required) - Post description for SEO
- `pubDate` (Date, required) - Publication date
- `updatedDate` (Date, optional) - Last updated date
- `heroImage` (string, optional) - Path to hero image
- `category` (string, default: "General") - Post category
- `tags` (array of strings, default: []) - Post tags
- `lang` ("en" | "vi", default: "en") - Content language
- `draft` (boolean, default: false) - Whether to exclude from build

### Adding New Blog Posts

1. Create a new markdown file in `src/content/blog/`
2. Add frontmatter with required fields
3. Set `draft: true` to exclude from builds

Example:

```markdown
---
title: 'My New Post'
description: 'A brief description'
pubDate: 2025-01-20
category: 'Tutorial'
tags: ['astro', 'web-development']
lang: 'en'
draft: false
---

# Content here
```

## Key Features

### Dark Mode

- Class-based dark mode using `dark:` Tailwind classes
- Theme preference persisted in localStorage
- Inline script in `<head>` prevents FOUC
- Cross-tab synchronization via storage event

### Search

- Powered by Pagefind
- Automatically indexed during build
- Located at `/search`
- Supports keyboard navigation

### RSS Feed

- Generated at `/rss.xml`
- Excludes draft posts
- Sorted by publication date

### Internationalization

- Supported locales: `en`, `vi`
- Default locale: `en`
- Translation files in `src/i18n/`

## Important Files

| File | Purpose |
|------|---------|
| `astro.config.mjs` | Base path, integrations, Markdown plugins, i18n |
| `src/layouts/BaseLayout.astro` | Main layout, dark mode initialization, SEO |
| `src/layouts/BlogLayout.astro` | Blog post layout with TOC |
| `src/content/config.ts` | Blog schema with Zod validation |
| `src/components/DarkModeToggle.astro` | Theme toggle button |
| `.github/workflows/deploy.yml` | Auto-deployment workflow |

## Guidelines

### Code Style

- Use TypeScript strict mode
- Follow Astro's component patterns
- Use Tailwind utility classes over custom CSS
- Maintain accessibility (semantic HTML, ARIA labels)

### Adding Features

1. Read existing code to understand patterns
2. Follow the established file structure
3. Ensure dark mode compatibility
4. Test in both light and dark themes
5. Verify accessibility

### Dark Mode Implementation Notes

- The dark mode init script MUST be inline in `<head>` to prevent FOUC
- Always provide both light and dark color variants
- Test with `prefers-color-scheme` media query
- Use `dark:` prefix for dark mode styles

## Social Links

Current social links (can be updated in `src/layouts/BaseLayout.astro`):
- GitHub: github.com/tamntaptech1
- Email: contact@tamnguyen.dev
- LinkedIn: https://linkedin.com (placeholder)

## Notes

- Copyright 2026, Nguyen Tri Tam
- Licensed under MIT License
- Deployed at: https://tamntaptech1.github.io
