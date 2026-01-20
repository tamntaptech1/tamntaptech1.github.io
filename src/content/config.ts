// Define the schema for blog posts using Zod
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
    lang: z.enum(['en', 'vi']).default('en'),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
