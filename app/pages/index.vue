<script setup lang="ts">
import type { ContentItem } from "~/types/content";

const searchQuery = ref("");

// Icon mapping for different tech stacks and topics
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

// Fetch articles and projects
const { data: articles } = await useAsyncData("home-articles", async () => {
  const results = await queryCollection("content").all();
  const items = (results as ContentItem[]).filter((item) =>
    item.path?.match(/^\/blog\/[^/]+$/),
  );

  // Prefer articles tagged with "features" first (sorted by date), then recent articles
  const byDateDesc = (arr: ContentItem[]) =>
    arr.sort((a, b) => {
      const dateA = a.meta.date ? new Date(a.meta.date).getTime() : 0;
      const dateB = b.meta.date ? new Date(b.meta.date).getTime() : 0;
      return dateB - dateA;
    });

  const featured = byDateDesc(
    items.filter((i) => i.meta.tags?.includes("features")),
  );
  const others = byDateDesc(
    items.filter((i) => !i.meta.tags?.includes("features")),
  );

  return [...featured, ...others].slice(0, 3);
});

const { data: projects } = await useAsyncData("home-projects", async () => {
  const results = await queryCollection("content").all();
  return (
    (results as ContentItem[])
      .filter((item) => item.path?.match(/^\/projects\/[^/]+$/))
      // Only use the `featured` boolean for ordering; ignore `stars`
      .sort((a, b) => (b.meta.featured ? 1 : 0) - (a.meta.featured ? 1 : 0))
      .slice(0, 3)
  );
});

// Combine and filter content based on search
const allContent = computed(() => {
  const combined = [
    ...(articles.value || []).map((a) => ({ ...a, type: "article" })),
    ...(projects.value || []).map((p) => ({ ...p, type: "project" })),
  ];

  if (!searchQuery.value) return combined;

  const query = searchQuery.value.toLowerCase();
  return combined.filter(
    (item) =>
      item.title?.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query) ||
      item.meta.tags?.some((tag: string) => tag.toLowerCase().includes(query)),
  );
});

const clearSearch = () => {
  searchQuery.value = "";
};
</script>

<template>
  <UContainer>
    <div class="py-12">
      <!-- Hero Section -->
      <div class="mb-12 text-center">
        <h1 class="text-4xl font-bold mb-4">Welcome to My Dev Portfolio</h1>
        <p class="text-xl text-gray-600 dark:text-gray-400 mb-8">
          Exploring software development, system architecture, and open-source
          projects
        </p>

        <!-- Search Bar -->
        <div class="max-w-2xl mx-auto">
          <UInput
            v-model="searchQuery"
            size="xl"
            placeholder="Search articles and projects..."
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
        </div>
      </div>

      <!-- Results Count -->
      <div v-if="searchQuery" class="mb-6">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Found {{ allContent.length }} result{{
            allContent.length !== 1 ? "s" : ""
          }}
        </p>
      </div>

      <!-- Content Grid -->
      <div v-if="allContent.length > 0">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <UCard
            v-for="item in allContent"
            :key="item.path"
            :ui="{
              body: { class: 'p-6' },
              header: { class: 'p-6 pb-0' },
            }"
          >
            <template #header>
              <div class="flex items-start justify-between">
                <NuxtLink
                  :to="item.path"
                  class="hover:text-primary transition-colors"
                >
                  <h3 class="text-lg font-semibold">
                    {{ item.title }}
                  </h3>
                </NuxtLink>
                <UBadge
                  :color="item.type === 'article' ? 'info' : 'success'"
                  variant="subtle"
                >
                  {{ item.type }}
                </UBadge>
              </div>
            </template>

            <p
              class="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3"
            >
              {{ item.description }}
            </p>

            <!-- Tags -->
            <div
              v-if="item.meta.tags && item.meta.tags.length"
              class="flex flex-wrap gap-2 mb-4"
            >
              <UBadge
                v-for="tag in item.meta.tags.slice(0, 3)"
                :key="tag"
                color="neutral"
                variant="soft"
                size="xs"
                :icon="getTagIcon(tag)"
              >
                {{ tag }}
              </UBadge>
            </div>

            <!-- Footer -->
            <div class="flex items-center justify-between text-sm">
              <span
                v-if="item.meta.date"
                class="text-gray-500 dark:text-gray-400"
              >
                {{
                  new Date(item.meta.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                }}
              </span>
              <NuxtLink :to="item.path" class="text-primary hover:underline">
                Read more →
              </NuxtLink>
            </div>
          </UCard>
        </div>

        <!-- View All Links -->
        <div v-if="!searchQuery" class="mt-12 flex gap-4 justify-center">
          <UButton to="/blog" size="lg" variant="outline">
            View All Articles
          </UButton>
          <UButton to="/projects" size="lg" variant="outline">
            View All Projects
          </UButton>
        </div>
      </div>

      <!-- No Results -->
      <div v-else-if="searchQuery" class="text-center py-12">
        <p class="text-gray-600 dark:text-gray-400">
          No results found for "{{ searchQuery }}"
        </p>
      </div>
    </div>
  </UContainer>
</template>
