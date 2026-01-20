---
title: 'Building a Blog with Astro: A Complete Guide'
description: 'Learn how to build a fast, modern blog with Astro 5, TypeScript, and Tailwind CSS. This guide covers everything from setup to deployment.'
pubDate: 2025-01-10
category: 'Tutorial'
tags: ['astro', 'typescript', 'tailwind', 'tutorial', 'web-development']
lang: 'en'
heroImage: '/images/astro-blog.jpg'
---

## Why Astro?

Astro is a modern web framework that prioritizes content-focused websites. Here's why I chose it for my blog:

### Performance First

Astro ships zero JavaScript by default, meaning your pages load incredibly fast. Only load JavaScript when you actually need it through interactive components.

### Developer Experience

With TypeScript support, file-based routing, and content collections, building with Astro is a pleasure.

### Modern Ecosystem

Built on web standards and compatible with your favorite tools like React, Vue, Svelte, and more.

## Project Setup

Let's start by creating a new Astro project:

```bash
# Create a new Astro project
npm create astro@latest my-blog

# Navigate to the project
cd my-blog

# Start the dev server
npm run dev
```

## Adding TypeScript

Astro has excellent TypeScript support. Let's enable strict mode for better type safety:

### tsconfig.json

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## Styling with Tailwind CSS

To add Tailwind CSS to your Astro project:

```bash
npm install -D tailwindcss @astrojs/tailwind @tailwindcss/typography
```

### Configuration

Create `tailwind.config.mjs`:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
```

Update `astro.config.mjs`:

```javascript
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
  ],
});
```

## Creating Blog Content

Astro's Content Collections make managing blog posts easy:

### Define the Schema

Create `src/content/config.ts`:

```typescript
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    category: z.string().default('General'),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
```

### Create Your First Post

Create `src/content/blog/first-post.md`:

```markdown
---
title: 'My First Post'
description: 'This is my first blog post with Astro!'
pubDate: 2025-01-10
category: 'General'
tags: ['astro']
---

# Hello, Astro!

This is my first blog post.
```

## Building the Blog Pages

### Blog Listing Page

Create `src/pages/blog/index.astro`:

```astro
---
import { getCollection } from 'astro:content';

const posts = await getCollection('blog');
---

<h1>Blog</h1>
{posts.map(post => (
  <article>
    <h2>{post.data.title}</h2>
    <p>{post.data.description}</p>
  </article>
))}
```

### Individual Post Page

Create `src/pages/blog/[slug].astro`:

```astro
---
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map(post => ({
    params: { slug: post.slug },
    props: post,
  }));
}

const post = Astro.props;
const { Content } = await post.render();
---

<h1>{post.data.title}</h1>
<Content />
```

## Dark Mode Implementation

Implementing dark mode requires careful consideration to prevent the "flash of unstyled content" (FOUC) problem.

### The Solution

Add this inline script to your layout's `<head>`:

```astro
<script is:inline>
  const getThemePreference = () => {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('theme');
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  };

  const isDark = getThemePreference() === 'dark';
  document.documentElement.classList[isDark ? 'add' : 'remove']('dark');
</script>
```

This script runs before the page paints, ensuring the correct theme is applied immediately.

## Adding Search with Pagefind

Pagefind is a fantastic search solution for static sites:

### Installation

```bash
npm install -D pagefind
```

### Update package.json

```json
{
  "scripts": {
    "build": "astro build",
    "postbuild": "pagefind --site dist --output-subdir _pagefind"
  }
}
```

### Create Search Page

Create `src/pages/search.astro`:

```astro
<div id="search"></div>

<link href="/_pagefind/pagefind-ui.css" rel="stylesheet" />
<script src="/_pagefind/pagefind-ui.js"></script>
<script>
  new pagefindui({ element: '#search' });
</script>
```

## Deployment to GitHub Pages

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

## Conclusion

Building a blog with Astro is straightforward and results in a fast, modern website. The framework's focus on performance and developer experience makes it an excellent choice for content-focused sites.

### Key Takeaways

1. **Zero JS by default** - Ships only what you need
2. **Content Collections** - Type-safe content management
3. **Flexible architecture** - Use your favorite tools
4. **Great DX** - TypeScript, file-based routing, and more

## Next Steps

- Add more features like comments or analytics
- Customize the design to match your brand
- Write great content!

Happy building!
