<script setup lang="ts">
const searchQuery = ref("");
const selectedTag = ref<string | null>(null);

// Fetch all projects
const { data: projects } = await useAsyncData("projects", () =>
  queryCollection("content")
    .where({ _path: { $regex: /^\/projects\/[^/]+$/ } })
    .sort({ featured: -1, stars: -1 })
    .all(),
);

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

  let filtered = projects.value;

  // Filter by tag
  if (selectedTag.value) {
    filtered = filtered.filter((project) =>
      project.tags?.includes(selectedTag.value),
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
      <div class="mb-12">
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
          <UCard
            v-for="project in filteredProjects"
            :key="project._path"
            :ui="{
              body: { padding: 'p-6' },
              header: { padding: 'p-6 pb-0' },
            }"
          >
            <template #header>
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-2">
                    <h2 class="text-2xl font-bold">
                      {{ project.title }}
                    </h2>
                    <UBadge
                      v-if="project.featured"
                      color="yellow"
                      variant="subtle"
                    >
                      Featured
                    </UBadge>
                  </div>
                  <p class="text-gray-600 dark:text-gray-400">
                    {{ project.description }}
                  </p>
                </div>
              </div>
            </template>

            <!-- Tags -->
            <div
              v-if="project.tags && project.tags.length"
              class="flex flex-wrap gap-2 mb-4"
            >
              <UBadge
                v-for="tag in project.tags"
                :key="tag"
                color="gray"
                variant="soft"
                class="cursor-pointer"
                @click="toggleTag(tag)"
              >
                {{ tag }}
              </UBadge>
            </div>

            <!-- Stats -->
            <div
              v-if="project.stars"
              class="flex items-center gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400"
            >
              <div class="flex items-center gap-1">
                <UIcon name="i-heroicons-star" />
                <span>{{ project.stars }}</span>
              </div>
            </div>

            <!-- Actions -->
            <div
              class="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-800"
            >
              <UButton
                v-if="project.repo"
                :to="project.repo"
                target="_blank"
                external
                icon="i-simple-icons-github"
                variant="outline"
                size="sm"
              >
                View on GitHub
              </UButton>
              <UButton :to="project._path" variant="soft" size="sm">
                Learn more
              </UButton>
            </div>
          </UCard>
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
