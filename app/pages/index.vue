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
</script>

<template>
  <div>
    <!-- Hero Section -->
    <UPageHeader
      title="Welcome to My Dev Portfolio"
      description="Exploring software development, system architecture, and open-source projects"
    />

    <!-- Recent Blog Posts Section -->
    <UPageSection
      v-if="articles && articles.length > 0"
      headline="Latest Articles"
      title="Recent Blog Posts"
      description="Technical articles, guides, and tutorials on software development"
      :links="[
        {
          label: 'View All Articles',
          to: '/blog',
          size: 'lg',
          variant: 'outline',
        },
      ]"
    >
      <UPageGrid>
        <UPageCard
          v-for="article in articles"
          :key="article.path"
          :title="article.title"
          :description="article.description"
          :to="article.path"
          icon="i-heroicons-newspaper"
        >
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
    </UPageSection>

    <!-- Featured Projects Section -->
    <UPageSection
      v-if="projects && projects.length > 0"
      headline="Showcase"
      title="Featured Projects"
      description="A collection of my open-source projects and contributions"
      :links="[
        {
          label: 'View All Projects',
          to: '/projects',
          size: 'lg',
          variant: 'outline',
        },
      ]"
    >
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
          <template v-if="project.meta.featured" #leading>
            <UBadge color="primary" variant="subtle" size="sm">
              Featured
            </UBadge>
          </template>
          <template #footer>
            <div class="flex flex-wrap gap-2">
              <UBadge
                v-for="tag in project.meta.tags?.slice(0, 3)"
                :key="tag"
                color="primary"
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
    </UPageSection>
  </div>
</template>
