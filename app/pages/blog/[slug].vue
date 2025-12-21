<script setup lang="ts">
const route = useRoute();

// Fetch the article
const { data: article } = await useAsyncData(`blog-${route.params.slug}`, () =>
  queryCollection("content").path(route.path).first(),
);

// Handle 404
if (!article.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Article not found",
    fatal: true,
  });
}

// Fetch related articles (same tags)
const { data: relatedArticles } = await useAsyncData(
  `related-${route.params.slug}`,
  async () => {
    if (!article.value?.tags?.length) return [];

    const results = await queryCollection("content").all();
    return results
      .filter(
        (item: any) =>
          item._path?.match(/^\/blog\/[^/]+$/) &&
          item._path !== route.path &&
          item.tags?.some((tag: string) => article.value?.tags?.includes(tag)),
      )
      .slice(0, 3);
  },
);

// SEO
useHead({
  title: article.value?.title,
  meta: [{ name: "description", content: article.value?.description }],
});
</script>

<template>
  <UContainer>
    <article class="py-12">
      <!-- Article Header -->
      <div class="mb-12 max-w-4xl mx-auto">
        <!-- Back Link -->
        <NuxtLink
          to="/blog"
          class="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-primary mb-6"
        >
          <UIcon name="i-heroicons-arrow-left" class="mr-1" />
          Back to blog
        </NuxtLink>

        <!-- Title -->
        <h1 class="text-4xl md:text-5xl font-bold mb-4">
          {{ article?.title }}
        </h1>

        <!-- Description -->
        <p class="text-xl text-gray-600 dark:text-gray-400 mb-6">
          {{ article?.description }}
        </p>

        <!-- Meta Information -->
        <div
          class="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6"
        >
          <span v-if="article?.date">
            {{
              new Date(article.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            }}
          </span>
          <span v-if="article?.author"> by {{ article.author }} </span>
        </div>

        <!-- Tags -->
        <div v-if="article?.tags?.length" class="flex flex-wrap gap-2">
          <UBadge
            v-for="tag in article.tags"
            :key="tag"
            color="primary"
            variant="soft"
          >
            {{ tag }}
          </UBadge>
        </div>
      </div>

      <!-- Article Content -->
      <div class="max-w-4xl mx-auto">
        <div class="prose prose-lg dark:prose-invert max-w-none">
          <ContentRenderer v-if="article" :value="article" />
        </div>
      </div>

      <!-- Related Articles -->
      <div
        v-if="relatedArticles && relatedArticles.length > 0"
        class="mt-16 max-w-4xl mx-auto"
      >
        <h2 class="text-2xl font-bold mb-6">Related Articles</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <UCard
            v-for="related in relatedArticles"
            :key="related._path"
            :ui="{ body: { padding: 'p-4' } }"
          >
            <NuxtLink :to="related._path" class="block">
              <h3
                class="font-semibold mb-2 hover:text-primary transition-colors"
              >
                {{ related.title }}
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {{ related.description }}
              </p>
            </NuxtLink>
          </UCard>
        </div>
      </div>
    </article>
  </UContainer>
</template>
