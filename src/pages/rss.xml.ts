import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

const basePath = import.meta.env.PUBLIC_BASE_PATH || '/tamntaptech1.github.io';

export async function GET(context) {
  const blog = await getCollection('blog', ({ data }) => !data.draft);

  return rss({
    title: 'Tam Nguyen | Personal Blog',
    description: 'Personal blog of Tam Nguyen - Software Developer',
    site: context.site ?? 'https://tamntaptech1.github.io',
    items: blog.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `${basePath}/blog/${post.slug}/`,
    })),
    customData: `<language>en-us</language>`,
    trailingSlash: false,
  });
}
