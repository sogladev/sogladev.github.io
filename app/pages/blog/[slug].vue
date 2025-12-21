<script setup lang="ts">
  const route = useRoute()

  // Icon mapping for different tech stacks and topics
  const tagIcons: Record<string, string> = {
    rust: 'i-simple-icons-rust',
    cpp: 'i-simple-icons-cplusplus',
    'c++': 'i-simple-icons-cplusplus',
    typescript: 'i-simple-icons-typescript',
    javascript: 'i-simple-icons-javascript',
    python: 'i-simple-icons-python',
    lua: 'i-simple-icons-lua',
    sql: 'i-simple-icons-mysql',
    'game-dev': 'i-heroicons-puzzle-piece',
    cli: 'i-heroicons-command-line',
    devtools: 'i-heroicons-wrench-screwdriver',
    docker: 'i-simple-icons-docker',
    kubernetes: 'i-simple-icons-kubernetes',
    nodejs: 'i-simple-icons-nodedotjs',
    vue: 'i-simple-icons-vuedotjs',
    react: 'i-simple-icons-react',
    nuxt: 'i-simple-icons-nuxtdotjs',
    next: 'i-simple-icons-nextdotjs',
    tailwind: 'i-simple-icons-tailwindcss',
    tutorial: 'i-heroicons-academic-cap',
    guide: 'i-heroicons-book-open',
    tips: 'i-heroicons-light-bulb',
    performance: 'i-heroicons-bolt',
    security: 'i-heroicons-shield-check',
    database: 'i-heroicons-circle-stack',
    api: 'i-heroicons-cloud',
    web: 'i-heroicons-globe-alt',
    mobile: 'i-heroicons-device-phone-mobile'
  }

  // Get icon for a tag, fallback to a default icon
  const getTagIcon = (tag: string): string => {
    return tagIcons[tag.toLowerCase()] || 'i-heroicons-hashtag'
  }

  // Fetch the article
  const { data: article } = await useAsyncData(
    `blog-${route.params.slug}`,
    () => queryCollection('blog').path(route.path).first()
  )

  // Handle 404
  if (!article.value) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Article not found',
      fatal: true
    })
  }

  // Fetch related articles (same tags)
  const { data: relatedArticles } = await useAsyncData(
    `related-${route.params.slug}`,
    async () => {
      if (!article.value?.tags?.length) return []

      return queryCollection('blog')
        .where('path', '<>', route.path)
        .where('tags', 'LIKE', `%${article.value.tags[0]}%`) // Simple tag matching
        .limit(3)
        .all()
    }
  )

  // Fetch surround articles for navigation
  const { data: surround } = await useAsyncData(`${route.path}-surround`, () =>
    queryCollectionItemSurroundings('blog', route.path)
  )

  // SEO
  useHead({
    title: article.value?.title,
    meta: [{ name: 'description', content: article.value?.description }]
  })
</script>

<template>
  <UPage v-if="article">
    <UPageHeader :title="article.title" :description="article.description">
      <template #headline>
        <NuxtLink
          to="/blog"
          class="inline-flex items-center text-sm hover:text-primary"
        >
          <UIcon name="i-heroicons-arrow-left" class="mr-1" />
          Back to blog
        </NuxtLink>
      </template>

      <template #links>
        <!-- Meta Information -->
        <div class="flex flex-wrap items-center gap-4 text-sm text-muted">
          <span v-if="article.date">
            {{
              new Date(article.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })
            }}
          </span>
          <span v-if="article.author"> by {{ article.author }} </span>
        </div>

        <!-- Tags -->
        <div v-if="article.tags?.length" class="flex flex-wrap gap-2 w-full">
          <UBadge
            v-for="tag in article.tags"
            :key="tag"
            color="primary"
            variant="soft"
            :icon="getTagIcon(tag)"
          >
            {{ tag }}
          </UBadge>
        </div>
      </template>
    </UPageHeader>

    <UPageBody prose>
      <ContentRenderer v-if="article.body" :value="article" />

      <USeparator v-if="surround?.filter(Boolean).length" class="my-8" />

      <UContentSurround :surround="surround as any" />

      <!-- Related Articles -->
      <div v-if="relatedArticles && relatedArticles.length > 0" class="mt-16">
        <h2 class="text-2xl font-bold mb-6">Related Articles</h2>
        <UPageGrid>
          <UPageCard
            v-for="related in relatedArticles"
            :key="related.path"
            :title="related.title"
            :description="related.description"
            :to="related.path"
            icon="i-heroicons-newspaper"
            variant="soft"
          />
        </UPageGrid>
      </div>
    </UPageBody>

    <template v-if="article.body?.toc?.links?.length" #right>
      <UContentToc :links="article.body.toc.links" />
    </template>
  </UPage>
</template>
