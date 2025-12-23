<script setup lang="ts">
const searchQuery = ref('')
const selectedTag = ref<string | null>(null)

// Fetch all articles from the blog collection
const { data: articles } = await useAsyncData('blog-articles', () => {
  return queryCollection('blog').order('date', 'DESC').all()
})

// Extract unique tags
const allTags = computed(() => {
  if (!articles.value) return []
  const tags = new Set<string>()
  articles.value.forEach((article) => {
    article.tags?.forEach((tag: string) => tags.add(tag))
  })
  return Array.from(tags).sort()
})

// Filter articles based on search and tag
const filteredArticles = computed(() => {
  if (!articles.value) return []

  let filtered = articles.value

  // Filter by tag
  if (selectedTag.value) {
    filtered = filtered.filter(article =>
      article.tags?.includes(selectedTag.value!),
    )
  }

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      article =>
        article.title?.toLowerCase().includes(query)
        || article.description?.toLowerCase().includes(query)
        || article.tags?.some((tag: string) => tag.toLowerCase().includes(query)),
    )
  }

  return filtered
})

const clearSearch = () => {
  searchQuery.value = ''
}

const toggleTag = (tag: string) => {
  selectedTag.value = selectedTag.value === tag ? null : tag
}

// SEO
useHead({
  title: 'Blog - Articles & Tutorials',
  meta: [
    {
      name: 'description',
      content:
          'Technical articles, guides, and tutorials on software development.',
    },
  ],
})
</script>

<template>
  <UContainer>
    <UPageHeader
      title="Blog"
      description="Technical articles, guides, and tutorials"
    />

    <UPageBody>
      <!-- Search and Filter -->
      <div class="mb-8 space-y-4">
        <!-- Search Bar -->
        <UInput
          v-model="searchQuery"
          size="lg"
          placeholder="Search articles..."
        >
          <template #trailing>
            <UButton
              v-if="searchQuery !== ''"
              color="neutral"
              variant="link"
              icon="i-heroicons-x-mark-20-solid"
              :padded="false"
              @click="clearSearch"
            />
          </template>
        </UInput>

        <!-- Tags Filter -->
        <TagFilter
          :tags="allTags"
          :selected-tag="selectedTag"
          @toggle-tag="toggleTag"
        />
      </div>

      <!-- Results Count -->
      <div class="mb-6">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Showing {{ filteredArticles.length }} article{{
            filteredArticles.length !== 1 ? 's' : ''
          }}
          <span
            v-if="selectedTag"
            class="font-medium"
          >
            with tag "{{ selectedTag }}"
          </span>
        </p>
      </div>

      <!-- Articles List -->
      <div
        v-if="filteredArticles.length > 0"
        class="space-y-6"
      >
        <ContentCard
          v-for="article in filteredArticles"
          :key="article.path"
          :content="article"
          type="article"
          :show-secondary-action="false"
        />
      </div>

      <!-- No Results -->
      <div
        v-else
        class="text-center py-12"
      >
        <p class="text-gray-600 dark:text-gray-400">
          <span v-if="searchQuery || selectedTag">
            No articles found matching your criteria.
          </span>
          <span v-else> No articles available yet. </span>
        </p>
        <UButton
          v-if="searchQuery || selectedTag"
          variant="outline"
          class="mt-4"
          @click="
            () => {
              searchQuery = ''
              selectedTag = null
            }
          "
        >
          Clear filters
        </UButton>
      </div>
    </UPageBody>
  </UContainer>
</template>
