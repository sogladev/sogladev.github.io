import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    articles: defineCollection({
      type: 'page',
      source: 'articles/**',
      schema: z.object({
        title: z.string(),
        description: z.string(),
        date: z.string(),
        author: z.string().optional(),
        tags: z.array(z.string()).default([]),
        image: z.string().optional(),
        featured: z.boolean().default(false),
        openSource: z.boolean().default(false),
      }),
    }),
    projects: defineCollection({
      type: 'page',
      source: 'projects/**',
      schema: z.object({
        title: z.string(),
        description: z.string(),
        date: z.string().optional(),
        tags: z.array(z.string()).default([]),
        image: z.string().optional(),
        repo: z.string().optional(),
        featured: z.boolean().default(false),
        stars: z.number().default(0),
        openSource: z.boolean().default(false),
      }),
    }),
    pages: defineCollection({
      type: 'page',
      source: '*.md',
      schema: z.object({
        title: z.string(),
        description: z.string().optional(),
      }),
    }),
  },
})
