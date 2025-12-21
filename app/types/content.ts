import type { MarkdownRoot } from '@nuxt/content'

export interface ContentItem {
  path: string
  title: string
  description: string
  body: MarkdownRoot
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
