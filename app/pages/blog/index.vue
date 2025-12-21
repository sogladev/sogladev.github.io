<script setup lang="ts">
const searchQuery = ref("");
const selectedTag = ref<string | null>(null);

// Fetch all articles
const { data: articles } = await useAsyncData("blog-articles", async () => {
  const results = await queryCollection("content").all();
  return results
    .filter((item: any) => item._path?.match(/^\/blog\/[^/]+$/))
    .sort((a: any, b: any) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;
      return dateB - dateA;
    });
});

// Extract unique tags
const allTags = computed(() => {
  if (!articles.value) return [];
  const tags = new Set<string>();
  articles.value.forEach((article) => {
    article.tags?.forEach((tag: string) => tags.add(tag));
  });
  return Array.from(tags).sort();
});

// Filter articles based on search and tag
const filteredArticles = computed(() => {
  if (!articles.value) return [];

  let filtered = articles.value;

  // Filter by tag
  if (selectedTag.value) {
    filtered = filtered.filter((article) =>
      article.tags?.includes(selectedTag.value),
    );
  }

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (article) =>
        article.title?.toLowerCase().includes(query) ||
        article.description?.toLowerCase().includes(query) ||
        article.tags?.some((tag: string) => tag.toLowerCase().includes(query)),
    );
  }

  return filtered;
});

const clearSearch = () => {
  searchQuery.value = "";
};

const toggleTag = (tag: string) => {
  selectedTag.value = selectedTag.value === tag ? null : tag;
};

// SEO
useHead({
  title: "Blog - Articles & Tutorials",
  meta: [
    {
      name: "description",
      content:
        "Technical articles, guides, and tutorials on software development.",
    },
  ],
});
</script>

<template>
  <UContainer>
    <div class="py-12">
      <!-- Header -->
      <div class="mb-12">
        <h1 class="text-4xl font-bold mb-4">Blog</h1>
        <p class="text-xl text-gray-600 dark:text-gray-400">
          Technical articles, guides, and tutorials
        </p>
      </div>

      <!-- Search and Filter -->
      <div class="mb-8 space-y-4">
        <!-- Search Bar -->
        <UInput
          v-model="searchQuery"
          size="lg"
          placeholder="Search articles..."
          icon="i-heroicons-magnifying-glass"
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
        <div v-if="allTags.length > 0" class="flex flex-wrap gap-2">
          <span
            class="text-sm text-gray-600 dark:text-gray-400 self-center mr-2"
          >
            Filter by tag:
          </span>
          <UBadge
            v-for="tag in allTags"
            :key="tag"
            :color="selectedTag === tag ? 'primary' : 'gray'"
            :variant="selectedTag === tag ? 'solid' : 'soft'"
            class="cursor-pointer"
            @click="toggleTag(tag)"
          >
            {{ tag }}
          </UBadge>
        </div>
      </div>

      <!-- Results Count -->
      <div class="mb-6">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Showing {{ filteredArticles.length }} article{{
            filteredArticles.length !== 1 ? "s" : ""
          }}
          <span v-if="selectedTag" class="font-medium">
            with tag "{{ selectedTag }}"
          </span>
        </p>
      </div>

      <!-- Articles List -->
      <div v-if="filteredArticles.length > 0" class="space-y-6">
        <UCard
          v-for="article in filteredArticles"
          :key="article._path"
          :ui="{
            body: { padding: 'p-6' },
          }"
        >
          <div class="flex flex-col gap-4">
            <!-- Header -->
            <div class="flex items-start justify-between gap-4">
              <div class="flex-1">
                <NuxtLink
                  :to="article._path"
                  class="hover:text-primary transition-colors"
                >
                  <h2 class="text-2xl font-bold mb-2">
                    {{ article.title }}
                  </h2>
                </NuxtLink>
                <p class="text-gray-600 dark:text-gray-400">
                  {{ article.description }}
                </p>
              </div>
            </div>

            <!-- Tags -->
            <div
              v-if="article.tags && article.tags.length"
              class="flex flex-wrap gap-2"
            >
              <UBadge
                v-for="tag in article.tags"
                :key="tag"
                color="gray"
                variant="soft"
                size="sm"
                class="cursor-pointer"
                @click="toggleTag(tag)"
              >
                {{ tag }}
              </UBadge>
            </div>

            <!-- Footer -->
            <div
              class="flex items-center justify-between text-sm pt-4 border-t border-gray-200 dark:border-gray-800"
            >
              <div class="flex items-center gap-4">
                <span
                  v-if="article.date"
                  class="text-gray-500 dark:text-gray-400"
                >
                  {{
                    new Date(article.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  }}
                </span>
                <span
                  v-if="article.author"
                  class="text-gray-500 dark:text-gray-400"
                >
                  by {{ article.author }}
                </span>
              </div>
              <NuxtLink
                :to="article._path"
                class="text-primary hover:underline font-medium"
              >
                Read article →
              </NuxtLink>
            </div>
          </div>
        </UCard>
      </div>

      <!-- No Results -->
      <div v-else class="text-center py-12">
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
              searchQuery = '';
              selectedTag = null;
            }
          "
        >
          Clear filters
        </UButton>
      </div>
    </div>
  </UContainer>
</template>
