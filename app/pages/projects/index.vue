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
  api: "i-heroicons-cloud",
  web: "i-heroicons-globe-alt",
  mobile: "i-heroicons-device-phone-mobile",
};

const getTagIcon = (tag: string): string => {
  return tagIcons[tag.toLowerCase()] || "i-heroicons-tag";
};

// Fetch all projects
const { data: allContent } = await useAsyncData("projects", () =>
  queryCollection("content").all(),
);

const projects = computed(() => {
  if (!allContent.value) return [];
  return allContent.value.filter(
    (item) => item.path.startsWith("/projects/") && item.path !== "/projects",
  );
});

// Extract unique tags
const allTags = computed(() => {
  if (!projects.value) return [];
  const tags = new Set<string>();
  projects.value.forEach((project) => {
    project.tags?.forEach((tag: string) => tags.add(tag));
  });
  return Array.from(tags).sort();
});

// Filter projects based on search and tag
const filteredProjects = computed(() => {
  if (!projects.value) return [];

  let filtered = [...projects.value];

  // Filter by tag
  if (selectedTag.value) {
    filtered = filtered.filter((project) =>
      project.tags?.includes(selectedTag.value!),
    );
  }

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (project) =>
        project.title?.toLowerCase().includes(query) ||
        project.description?.toLowerCase().includes(query) ||
        project.tags?.some((tag: string) => tag.toLowerCase().includes(query)),
    );
  }

  // Sort by featured and stars
  return filtered.sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return (b.stars || 0) - (a.stars || 0);
  });
});

const clearSearch = () => {
  searchQuery.value = "";
};

const toggleTag = (tag: string) => {
  selectedTag.value = selectedTag.value === tag ? null : tag;
};

// SEO
useHead({
  title: "Projects - Portfolio",
  meta: [
    {
      name: "description",
      content: "A collection of my open-source projects and contributions.",
    },
  ],
});
</script>

<template>
  <UContainer>
    <div class="py-12">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-4xl font-bold mb-4">Projects</h1>
        <p class="text-xl text-gray-600 dark:text-gray-400">
          A collection of my open-source projects and contributions
        </p>
      </div>

      <!-- Search and Filter -->
      <div class="mb-8 space-y-4">
        <!-- Search Bar -->
        <UInput
          v-model="searchQuery"
          size="lg"
          placeholder="Search projects..."
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
          Showing {{ filteredProjects.length }} project{{
            filteredProjects.length !== 1 ? "s" : ""
          }}
          <span v-if="selectedTag" class="font-medium">
            with tag "{{ selectedTag }}"
          </span>
        </p>
      </div>

      <!-- Projects Grid -->
      <div v-if="filteredProjects.length > 0">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ContentCard
            v-for="project in filteredProjects.filter((p) => p.title)"
            :key="project.path"
            :content="project as ContentItem"
            type="project"
          />
        </div>
      </div>

      <!-- No Results -->
      <div v-else class="text-center py-12">
        <p class="text-gray-600 dark:text-gray-400">
          <span v-if="searchQuery || selectedTag">
            No projects found matching your criteria.
          </span>
          <span v-else> No projects available yet. </span>
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
