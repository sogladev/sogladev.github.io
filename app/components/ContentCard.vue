<script setup lang="ts">
import type { ContentItem } from "~/types/content";

interface Props {
  content: ContentItem;
  type: "article" | "project";
  compact?: boolean;
  showSecondaryAction?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  compact: false,
  showSecondaryAction: true,
});

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

const getTagIcon = (tag: string): string => {
  return tagIcons[tag.toLowerCase()] || "i-heroicons-hashtag";
};

// Compute visibility badges
const visibilityBadge = computed(() => {
  if (props.type !== "project") return null;

  const repo = props.content.meta?.repo;
  const isPublic = !!repo;

  if (!isPublic) return { label: "Private", icon: "i-heroicons-lock-closed" };
  return null;
});

// Get tags limited by compact mode
const displayTags = computed(() => {
  const tags = props.content.meta?.tags || [];
  return props.compact ? tags.slice(0, 3) : tags;
});

// Get image URL or placeholder
const imageUrl = computed(() => {
  const metaImage = props.content.meta?.image;
  if (metaImage) return metaImage;
  
  // Use placeholder with dynamic size based on compact mode
  const size = props.compact ? "300x180" : "400x240";
  return `https://placehold.jp/cccccc/ffffff/${size}.png?text=${encodeURIComponent(props.type === "article" ? "Article" : "Project")}`;
});

// Secondary action config (for projects with GitHub)
const hasGitHubLink = computed(() => {
  return (
    props.type === "project" &&
    props.showSecondaryAction &&
    !!props.content.meta?.repo
  );
});
</script>

<template>
  <UCard class="overflow-hidden hover:shadow-lg transition-shadow">
    <div class="flex flex-col">
      <!-- Image -->
      <NuxtLink :to="content.path" class="block">
        <div class="relative aspect-video overflow-hidden bg-gray-100 dark:bg-gray-800">
          <img
            :src="imageUrl"
            :alt="content.title"
            class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          >
        </div>
      </NuxtLink>

      <!-- Content -->
      <div class="flex flex-col gap-4 p-6">
        <!-- Type badge + visibility badge -->
        <div class="flex items-center gap-2">
          <UBadge
            :color="type === 'article' ? 'primary' : 'secondary'"
            variant="subtle"
            size="sm"
            :icon="
              type === 'article'
                ? 'i-heroicons-document-text'
                : 'i-heroicons-code-bracket'
            "
          >
            {{ type === "article" ? "Article" : "Project" }}
          </UBadge>
          <UBadge
            v-if="visibilityBadge"
            color="neutral"
            variant="outline"
            size="sm"
            :icon="visibilityBadge.icon"
          >
            {{ visibilityBadge.label }}
          </UBadge>
        </div>

        <!-- Title (clickable) -->
        <NuxtLink
          :to="content.path"
          class="group"
        >
          <h3
            :class="[
              'font-bold line-clamp-2 group-hover:text-primary transition-colors',
              compact ? 'text-xl' : 'text-2xl',
            ]"
          >
            {{ content.title }}
          </h3>
        </NuxtLink>

        <!-- Description -->
        <p
          :class="[
            'text-gray-600 dark:text-gray-400',
            compact ? 'line-clamp-2' : 'line-clamp-3',
          ]"
        >
          {{ content.description }}
        </p>

        <!-- Tech Icons -->
        <div v-if="displayTags.length > 0" class="flex flex-wrap gap-2">
          <UBadge
            v-for="tag in displayTags"
            :key="tag"
            color="neutral"
            variant="soft"
            size="xs"
            :icon="getTagIcon(tag)"
          >
            {{ tag }}
          </UBadge>
        </div>

        <!-- GitHub Action (projects only) -->
        <div
          v-if="hasGitHubLink"
          class="pt-4 border-t border-gray-200 dark:border-gray-800"
        >
          <UButton
            :to="content.meta.repo"
            external
            target="_blank"
            variant="outline"
            color="neutral"
            size="sm"
            icon="i-simple-icons-github"
          >
            View on GitHub
          </UButton>
        </div>
      </div>
    </div>
  </UCard>
</template>
