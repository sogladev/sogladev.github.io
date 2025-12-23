<script setup lang="ts">
const searchQuery = ref('')
const selectedTag = ref<string | null>(null)

// Fetch all projects from the projects collection
const { data: projects } = await useAsyncData('projects', () => {
  return queryCollection('projects')
    .order('featured', 'DESC')
    .order('stars', 'DESC')
    .all()
})

// Extract unique tags
const allTags = computed(() => {
  if (!projects.value) return []
  const tags = new Set<string>()
  projects.value.forEach((project) => {
    project.tags?.forEach((tag: string) => tags.add(tag))
  })
  return Array.from(tags).sort()
})

// Filter projects based on search and tag
const filteredProjects = computed(() => {
  if (!projects.value) return []

  let filtered = [...projects.value]

  // Filter by tag
  if (selectedTag.value) {
    filtered = filtered.filter(project =>
      project.tags?.includes(selectedTag.value!),
    )
  }

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      project =>
        project.title?.toLowerCase().includes(query)
        || project.description?.toLowerCase().includes(query)
        || project.tags?.some((tag: string) => tag.toLowerCase().includes(query)),
    )
  }

  return filtered
})

const toggleTag = (tag: string) => {
  selectedTag.value = selectedTag.value === tag ? null : tag
}

// SEO
useHead({
  title: 'Projects - Portfolio',
  meta: [
    {
      name: 'description',
      content: 'A collection of my open-source projects and contributions.',
    },
  ],
})
</script>

<template>
  <UContainer>
    <UPageHeader
      title="Projects"
      description="A collection of my open-source projects and contributions"
      :ui="{ root: 'relative border-b border-default py-0' }"
    />

    <UPageBody>
      <!-- Search and Filter -->
      <div class="mb-8 space-y-4">
        <!-- Search Bar -->
        <UInput
          v-model="searchQuery"
          type="search"
          enter-key-hint="search"
          leading
          :leading-icon="'i-heroicons-magnifying-glass-20-solid'"
          size="lg"
          placeholder="Search projects..."
          aria-label="Search projects"
        />

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
          Showing {{ filteredProjects.length }} project{{
            filteredProjects.length !== 1 ? 's' : ''
          }}
          <span
            v-if="selectedTag"
            class="font-medium"
          >
            with tag "{{ selectedTag }}"
          </span>
        </p>
      </div>

      <!-- Projects Grid -->
      <div v-if="filteredProjects.length > 0">
        <UPageGrid>
          <ContentCard
            v-for="project in filteredProjects.filter(p => p.title)"
            :key="project.path"
            :content="project"
            type="project"
          />
        </UPageGrid>
      </div>

      <!-- No Results -->
      <div
        v-else
        class="text-center py-12"
      >
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
