<script setup lang="ts">
const route = useRoute()
const { getTagIcon } = useTagIcons()

// Fetch the article
const { data: article } = await useAsyncData(
  `articles-${route.params.slug}`,
  () => queryCollection('articles').path(route.path).first(),
)

// Handle 404
if (!article.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Article not found',
    fatal: true,
  })
}

// Fetch related articles (same tags)
const { data: relatedArticles } = await useAsyncData(
  `related-${route.params.slug}`,
  async () => {
    if (!article.value?.tags?.length) return []

    return queryCollection('articles')
      .where('path', '<>', route.path)
      .where('tags', 'LIKE', `%${article.value.tags[0]}%`) // Simple tag matching
      .limit(3)
      .all()
  },
)

// Fetch surround articles for navigation
const { data: surround } = await useAsyncData(`${route.path}-surround`, () =>
  queryCollectionItemSurroundings('articles', route.path),
)

// SEO
useHead({
  title: article.value?.title,
  meta: [{ name: 'description', content: article.value?.description }],
})
</script>

<template>
  <UPage v-if="article">
    <UPageBody
      prose
      class="max-w-none"
    >
      <div class="max-w-[65ch] mx-auto">
        <!-- Article Header -->
        <div class="mb-8">
          <NuxtLink
            to="/articles"
            class="inline-flex items-center text-sm hover:text-primary mb-4"
          >
            <UIcon
              name="i-heroicons-arrow-left"
              class="mr-1"
            />
            Back to articles
          </NuxtLink>

          <h1 class="text-3xl sm:text-4xl font-bold text-highlighted mb-4">
            {{ article.title }}
          </h1>

          <p
            v-if="article.description"
            class="text-lg text-muted mb-4"
          >
            {{ article.description }}
          </p>

          <!-- Meta Information -->
          <div class="flex flex-wrap items-center gap-4 text-sm text-muted mb-4">
            <span v-if="article.date">
              {{
                new Date(article.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
              }}
            </span>
            <span v-if="article.author"> by {{ article.author }} </span>
          </div>

          <!-- Tags -->
          <div
            v-if="article.tags?.length"
            class="flex flex-wrap gap-2 pb-6 border-b border-default"
          >
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
        </div>

        <ContentRenderer
          v-if="article.body"
          :value="article"
        />

        <USeparator
          v-if="surround?.filter(Boolean).length"
          class="my-8"
        />

        <UContentSurround :surround="surround as any" />

        <!-- Related Articles -->
        <div
          v-if="relatedArticles && relatedArticles.length > 0"
          class="mt-16"
        >
          <h2 class="text-2xl font-bold mb-6">
            Related Articles
          </h2>
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
      </div>
    </UPageBody>

    <template
      v-if="article.body?.toc?.links?.length"
      #right
    >
      <UPageAside>
        <UContentToc :links="article.body.toc.links" />
      </UPageAside>
    </template>
  </UPage>
</template>
