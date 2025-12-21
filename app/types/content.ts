import type { MarkdownRoot } from '@nuxt/content'

export interface ContentItem {
  path: string
  title: string
  description: string
  body: MarkdownRoot
  // Top-level properties from frontmatter
  tags?: string[]
  date?: string
  author?: string
  image?: string
  repo?: string
  featured?: boolean
  stars?: number
  // Nested meta object for backward compatibility
  meta: {
    date?: string
    author?: string
    tags?: string[]
    image?: string
    repo?: string
    featured?: boolean
    stars?: number
    [key: string]: unknown
  }
}
