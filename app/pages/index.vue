<script setup lang="ts">
import type { ContentItem } from "~/types/content";

// Icon mapping for different tech stacks and topics
const tagIcons: Record<string, string> = {
  rust: "i-simple-icons-rust",
  cpp: "i-simple-icons-cplusplus",
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
  features: "i-heroicons-sparkles",
  performance: "i-heroicons-bolt",
  security: "i-heroicons-shield-check",
  database: "i-heroicons-circle-stack",
  api: "i-heroicons-cloud",
  web: "i-heroicons-globe-alt",
  mobile: "i-heroicons-device-phone-mobile",
};

// Get icon for a tag, fallback to a default icon
const getTagIcon = (tag: string): string => {
  return tagIcons[tag.toLowerCase()] || "i-heroicons-hashtag";
};

// Fetch recent articles
const { data: articles } = await useAsyncData("home-articles", async () => {
  const results = await queryCollection("content").all();
  const items = (results as ContentItem[]).filter((item) =>
    item.path?.match(/^\/blog\/[^/]+$/),
  );

  // Sort by date (most recent first)
  return items
    .sort((a, b) => {
      const dateA = a.meta.date ? new Date(a.meta.date).getTime() : 0;
      const dateB = b.meta.date ? new Date(b.meta.date).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 3);
});

// Fetch featured projects
const { data: projects } = await useAsyncData("home-projects", async () => {
  const results = await queryCollection("content").all();
  return (results as ContentItem[])
    .filter((item) => item.path?.match(/^\/projects\/[^/]+$/))
    .sort((a, b) => (b.meta.featured ? 1 : 0) - (a.meta.featured ? 1 : 0))
    .slice(0, 3);
});

// Search state and navigation for ContentSearch
const searchTerm = ref("");
const { data: navigation } = await useAsyncData("home-navigation", () =>
  queryCollectionNavigation("content"),
);
</script>

<template>
  <div>
    <!-- Hero Section -->
    <div
      class="text-center py-12 border-b border-gray-200 dark:border-gray-800"
    >
      <div class="max-w-3xl mx-auto px-4">
        <h1
          class="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4"
        >
          Welcome to My Dev Portfolio
        </h1>
        <p class="text-lg text-gray-600 dark:text-gray-400">
          Exploring software development, system architecture, and open-source
          projects
        </p>
      </div>
    </div>

    <!-- Search Bar -->
    <div class="py-8 border-b border-gray-200 dark:border-gray-800">
      <ClientOnly>
        <LazyUContentSearch
          v-model:search-term="searchTerm"
          shortcut="meta_k"
          :modal="false"
          :files="projects"
          :navigation="navigation"
          :fuse="{ resultLimit: 42 }"
        />
      </ClientOnly>
    </div>

    <!-- Recent Blog Posts Section -->
    <div v-if="articles && articles.length > 0" class="py-12">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
            Recent Articles
          </h2>
          <UButton
            to="/blog"
            variant="outline"
            trailing-icon="i-heroicons-arrow-right"
          >
            View All Articles
          </UButton>
        </div>

        <UPageGrid>
          <UPageCard
            v-for="article in articles"
            :key="article.path"
            :title="article.title"
            :description="article.description"
            :to="article.path"
            icon="i-heroicons-newspaper"
          >
            <template #leading>
              <UBadge
                color="primary"
                variant="subtle"
                size="sm"
                icon="i-heroicons-document-text"
              >
                Article
              </UBadge>
            </template>
            <template #footer>
              <div class="flex flex-wrap gap-2">
                <UBadge
                  v-for="tag in article.meta.tags?.slice(0, 3)"
                  :key="tag"
                  color="neutral"
                  variant="soft"
                  size="xs"
                  :icon="getTagIcon(tag)"
                >
                  {{ tag }}
                </UBadge>
              </div>
            </template>
          </UPageCard>
        </UPageGrid>
      </div>
    </div>

    <!-- Featured Projects Section -->
    <div
      v-if="projects && projects.length > 0"
      class="py-12 bg-gray-50 dark:bg-gray-900/50"
    >
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
            Featured Projects
          </h2>
          <UButton
            to="/projects"
            variant="outline"
            trailing-icon="i-heroicons-arrow-right"
          >
            View All Projects
          </UButton>
        </div>

        <UPageGrid>
          <UPageCard
            v-for="project in projects"
            :key="project.path"
            :title="project.title"
            :description="project.description"
            :to="project.path"
            icon="i-heroicons-cube"
            variant="soft"
          >
            <template #leading>
              <div class="flex items-center gap-2">
                <UBadge
                  color="secondary"
                  variant="subtle"
                  size="sm"
                  icon="i-heroicons-code-bracket"
                >
                  Project
                </UBadge>
                <UBadge
                  v-if="project.meta.featured"
                  color="warning"
                  variant="subtle"
                  size="sm"
                  icon="i-heroicons-star"
                >
                  Featured
                </UBadge>
              </div>
            </template>
            <template #footer>
              <div class="flex flex-col gap-3">
                <!-- Tags -->
                <div class="flex flex-wrap gap-2">
                  <UBadge
                    v-for="tag in project.meta.tags?.slice(0, 3)"
                    :key="tag"
                    color="neutral"
                    variant="soft"
                    size="xs"
                    :icon="getTagIcon(tag)"
                  >
                    {{ tag }}
                  </UBadge>
                </div>
                <!-- GitHub Link or Closed Source -->
                <div
                  class="flex items-center gap-2 pt-2 border-t border-gray-200 dark:border-gray-800"
                >
                  <UButton
                    v-if="project.meta.repo"
                    :to="project.meta.repo"
                    target="_blank"
                    external
                    icon="i-simple-icons-github"
                    variant="ghost"
                    size="xs"
                    color="neutral"
                  >
                    View on GitHub
                  </UButton>
                  <UBadge
                    v-else
                    color="neutral"
                    variant="outline"
                    size="xs"
                    icon="i-heroicons-lock-closed"
                  >
                    Closed Source
                  </UBadge>
                </div>
              </div>
            </template>
          </UPageCard>
        </UPageGrid>
      </div>
    </div>
  </div>
</template>
