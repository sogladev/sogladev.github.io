import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page',
      source: '**',
      schema: z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        date: z.string().optional(),
        author: z.string().optional(),
        tags: z.array(z.string()).optional(),
        image: z.string().optional(),
        repo: z.string().optional(),
        featured: z.boolean().optional(),
        stars: z.number().optional()
      })
    })
  }
})
