<script setup lang="ts">
import type { ContentItem } from "~/types/content";

const searchQuery = ref("");
const selectedTag = ref<string | null>(null);

// Icon mapping for tags in filter badges
const tagIcons: Record<string, string> = {
  rust: "i-simple-icons-rust",
  cpp: "i-simple-icons-cplusplus",
  "c++": "i-simple-icons-cplusplus",
  typescript: "i-simple-icons-typescript",
  javascript: "i-simple-icons-javascript",
  python: "i-simple-icons-python",
  lua: "i-simple-icons-lua",
  sql: "i-simple-icons-mysql",
  "game-dev": "i-heroicons-puzzle-piece",
  cli: "i-heroicons-command-line",
  devtools: "i-heroicons-wrench-screwdriver",
  docker: "i-simple-icons-docker",
  kubernetes: "i-simple-icons-kubernetes",
  nodejs: "i-simple-icons-nodedotjs",
  vue: "i-simple-icons-vuedotjs",
  react: "i-simple-icons-react",
  nuxt: "i-simple-icons-nuxtdotjs",
  next: "i-simple-icons-nextdotjs",
  tailwind: "i-simple-icons-tailwindcss",
  tutorial: "i-heroicons-academic-cap",
  guide: "i-heroicons-book-open",
  tips: "i-heroicons-light-bulb",
  performance: "i-heroicons-bolt",
  security: "i-heroicons-shield-check",
  database: "i-heroicons-circle-stack",
  api: "i-heroicons-cloud",
  web: "i-heroicons-globe-alt",
  mobile: "i-heroicons-device-phone-mobile",
};

const getTagIcon = (tag: string): string => {
  return tagIcons[tag.toLowerCase()] || "i-heroicons-hashtag";
};

// Fetch all articles
const { data: articles } = await useAsyncData("blog-articles", async () => {
  const results = await queryCollection("content").all();
  return (results as ContentItem[])
    .filter((item: ContentItem) => item.path?.match(/^\/blog\/[^/]+$/))
    .sort((a: ContentItem, b: ContentItem) => {
      const dateA = a.meta?.date ? new Date(a.meta.date).getTime() : 0;
      const dateB = b.meta?.date ? new Date(b.meta.date).getTime() : 0;
      return dateB - dateA;
    });
});

// Extract unique tags
const allTags = computed(() => {
  if (!articles.value) return [];
  const tags = new Set<string>();
  articles.value.forEach((article) => {
    article.meta.tags?.forEach((tag: string) => tags.add(tag));
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
      article.meta.tags?.includes(selectedTag.value!),
    );
  }

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (article) =>
        article.title?.toLowerCase().includes(query) ||
        article.description?.toLowerCase().includes(query) ||
        article.meta.tags?.some((tag: string) =>
          tag.toLowerCase().includes(query),
        ),
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
      <div class="mb-6">
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
            :color="selectedTag === tag ? 'primary' : 'neutral'"
            :variant="selectedTag === tag ? 'solid' : 'soft'"
            :icon="getTagIcon(tag)"
            class="cursor-pointer hover:scale-105 transition-transform"
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
        <ContentCard
          v-for="article in filteredArticles"
          :key="article.path"
          :content="article"
          type="article"
          :show-secondary-action="false"
        />
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
