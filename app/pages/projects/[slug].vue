<script setup lang="ts">
const route = useRoute()

// Icon mapping for different tech stacks
const tagIcons: Record<string, string> = {
  'rust': 'i-simple-icons-rust',
  'cpp': 'i-simple-icons-cplusplus',
  'c++': 'i-simple-icons-cplusplus',
  'typescript': 'i-simple-icons-typescript',
  'javascript': 'i-simple-icons-javascript',
  'python': 'i-simple-icons-python',
  'lua': 'i-simple-icons-lua',
  'sql': 'i-simple-icons-mysql',
  'game-dev': 'i-heroicons-puzzle-piece',
  'cli': 'i-heroicons-command-line',
  'devtools': 'i-heroicons-wrench-screwdriver',
  'docker': 'i-simple-icons-docker',
  'kubernetes': 'i-simple-icons-kubernetes',
  'nodejs': 'i-simple-icons-nodedotjs',
  'vue': 'i-simple-icons-vuedotjs',
  'react': 'i-simple-icons-react',
  'nuxt': 'i-simple-icons-nuxtdotjs',
  'next': 'i-simple-icons-nextdotjs',
  'tailwind': 'i-simple-icons-tailwindcss',
  'api': 'i-heroicons-cloud',
  'web': 'i-heroicons-globe-alt',
  'mobile': 'i-heroicons-device-phone-mobile',
}

// Get icon for a tag, fallback to a default icon
const getTagIcon = (tag: string): string => {
  return tagIcons[tag.toLowerCase()] || 'i-heroicons-tag'
}

// Fetch the project
const { data: project } = await useAsyncData(
  `project-${route.params.slug}`,
  () => queryCollection('projects').path(route.path).first(),
)

// Handle 404
if (!project.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Project not found',
    fatal: true,
  })
}

// Fetch related projects (same tags)
const { data: relatedProjects } = await useAsyncData(
  `related-${route.params.slug}`,
  async () => {
    if (!project.value?.tags?.length) return []

    return queryCollection('projects')
      .where('path', '<>', route.path)
      .where('tags', 'LIKE', `%${project.value.tags[0]}%`)
      .limit(3)
      .all()
  },
)

// Fetch surround projects for navigation
const { data: surround } = await useAsyncData(`${route.path}-surround`, () =>
  queryCollectionItemSurroundings('projects', route.path),
)

// SEO
useHead({
  title: project.value?.title,
  meta: [{ name: 'description', content: project.value?.description }],
})
</script>

<template>
  <UPage v-if="project">
    <UPageBody
      prose
      class="max-w-none"
    >
      <div class="max-w-[65ch] mx-auto">
        <!-- Project Header -->
        <div class="mb-8">
          <NuxtLink
            to="/projects"
            class="inline-flex items-center text-sm hover:text-primary mb-4"
          >
            <UIcon
              name="i-heroicons-arrow-left"
              class="mr-1"
            />
            Back to projects
          </NuxtLink>

          <h1 class="text-3xl sm:text-4xl font-bold text-highlighted mb-4">
            {{ project.title }}
          </h1>

          <p
            v-if="project.description"
            class="text-lg text-muted mb-4"
          >
            {{ project.description }}
          </p>

          <!-- Stats and Action Buttons -->
          <div class="flex flex-wrap items-center gap-3 mb-4">
            <div
              v-if="project.stars"
              class="flex items-center gap-1.5 text-sm text-muted"
            >
              <UIcon
                name="i-heroicons-star"
                class="size-4"
              />
              <span>{{ project.stars }} stars</span>
            </div>

            <UBadge
              v-if="project.featured"
              color="primary"
              variant="subtle"
              size="lg"
              icon="i-heroicons-star"
            >
              Featured
            </UBadge>

            <UBadge
              v-if="project.role === 'contributor'"
              color="info"
              variant="subtle"
              size="lg"
              icon="i-heroicons-user"
            >
              Contributor
            </UBadge>

            <UButton
              v-if="project.repo"
              :to="project.repo"
              target="_blank"
              external
              icon="i-simple-icons-github"
              color="primary"
              size="lg"
            >
              View on GitHub
            </UButton>
          </div>

          <!-- Tags -->
          <div
            v-if="project.tags?.length"
            class="flex flex-wrap gap-2 pb-6 border-b border-default"
          >
            <UBadge
              v-for="tag in project.tags"
              :key="tag"
              color="primary"
              variant="soft"
              :icon="getTagIcon(tag)"
            >
              {{ tag }}
            </UBadge>
          </div>
        </div>

        <ContentRenderer
          v-if="project.body"
          :value="project"
        />

        <USeparator
          v-if="surround?.filter(Boolean).length"
          class="my-8"
        />

        <UContentSurround :surround="surround as any" />

        <!-- Related Projects -->
        <div
          v-if="relatedProjects && relatedProjects.length > 0"
          class="mt-16"
        >
          <h2 class="text-2xl font-bold mb-6">
            Related Projects
          </h2>
          <UPageGrid>
            <UPageCard
              v-for="related in relatedProjects"
              :key="related.path"
              :title="related.title"
              :description="related.description"
              :to="related.path"
              icon="i-heroicons-cube"
              variant="soft"
            >
              <template #footer>
                <div class="flex flex-wrap gap-1">
                  <UBadge
                    v-for="tag in related.tags?.slice(0, 3)"
                    :key="tag"
                    color="primary"
                    variant="soft"
                    size="sm"
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
    </UPageBody>

    <template
      v-if="project.body?.toc?.links?.length"
      #right
    >
      <UPageAside>
        <UContentToc :links="project.body.toc.links" />
      </UPageAside>
    </template>
  </UPage>
</template>
