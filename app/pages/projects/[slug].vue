<script setup lang="ts">
const route = useRoute();

// Fetch the project
const { data: project } = await useAsyncData(
  `project-${route.params.slug}`,
  () => queryCollection("content").path(route.path).first(),
);

// Handle 404
if (!project.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Project not found",
    fatal: true,
  });
}

// Fetch related projects (same tags)
const { data: relatedProjects } = await useAsyncData(
  `related-${route.params.slug}`,
  async () => {
    if (!project.value?.tags?.length) return [];

    type ContentItem = {
      path: string;
      tags?: string[];
      title?: string;
      description?: string;
      repo?: string;
      stars?: number;
      featured?: boolean;
    };
    const related = (await queryCollection("content")
      // Use correct API: where(field, operator, value)
      .where("_path", "LIKE", "/projects/%")
      .where("_path", "<>", route.path)
      // fetch a few more and filter client-side for safety
      .limit(10)
      .all()) as unknown as ContentItem[];

    // Filter by matching tags, ensure path matches project pattern, exclude current, and limit to 3
    const projectPathRegex = /^\/projects\/[^/]+$/;
    return related
      .filter(
        (r: ContentItem) =>
          projectPathRegex.test(r.path) &&
          r.path !== route.path &&
          r.tags?.some((tag: string) => project.value?.tags?.includes(tag)),
      )
      .slice(0, 3);
  },
);

// SEO
useHead({
  title: project.value?.title,
  meta: [{ name: "description", content: project.value?.description }],
});
</script>

<template>
  <UContainer>
    <article class="py-12">
      <!-- Project Header -->
      <div class="mb-12 max-w-4xl mx-auto">
        <!-- Back Link -->
        <NuxtLink
          to="/projects"
          class="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-primary mb-6"
        >
          <UIcon name="i-heroicons-arrow-left" class="mr-1" />
          Back to projects
        </NuxtLink>

        <!-- Title -->
        <div class="flex items-start gap-3 mb-4">
          <h1 class="text-4xl md:text-5xl font-bold flex-1">
            {{ project?.title }}
          </h1>
          <UBadge
            v-if="project?.featured"
            color="primary"
            variant="subtle"
            size="lg"
          >
            Featured
          </UBadge>
        </div>

        <!-- Description -->
        <p class="text-xl text-gray-600 dark:text-gray-400 mb-6">
          {{ project?.description }}
        </p>

        <!-- Stats and Links -->
        <div class="flex flex-wrap items-center gap-4 mb-6">
          <div
            v-if="project?.stars"
            class="flex items-center gap-1 text-gray-600 dark:text-gray-400"
          >
            <UIcon name="i-heroicons-star" />
            <span>{{ project.stars }} stars</span>
          </div>

          <UButton
            v-if="project?.repo"
            :to="project.repo"
            target="_blank"
            external
            icon="i-simple-icons-github"
            color="primary"
          >
            View on GitHub
          </UButton>
        </div>

        <!-- Tags -->
        <div v-if="project?.tags?.length" class="flex flex-wrap gap-2">
          <UBadge
            v-for="tag in project.tags"
            :key="tag"
            color="primary"
            variant="soft"
          >
            {{ tag }}
          </UBadge>
        </div>
      </div>

      <!-- Project Content -->
      <div class="max-w-4xl mx-auto">
        <div class="prose prose-lg dark:prose-invert max-w-none">
          <ContentRenderer v-if="project" :value="project" />
        </div>
      </div>

      <!-- Related Projects -->
      <div
        v-if="relatedProjects && relatedProjects.length > 0"
        class="mt-16 max-w-4xl mx-auto"
      >
        <h2 class="text-2xl font-bold mb-6">Related Projects</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <UCard v-for="related in relatedProjects" :key="related.path">
            <NuxtLink :to="related.path" class="block">
              <h3
                class="font-semibold mb-2 hover:text-primary transition-colors"
              >
                {{ related.title }}
              </h3>
              <p
                class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3"
              >
                {{ related.description }}
              </p>
              <div v-if="related.tags?.length" class="flex flex-wrap gap-1">
                <UBadge
                  v-for="tag in related.tags.slice(0, 3)"
                  :key="tag"
                  color="primary"
                  variant="soft"
                  size="xs"
                >
                  {{ tag }}
                </UBadge>
              </div>
            </NuxtLink>
          </UCard>
        </div>
      </div>
    </article>
  </UContainer>
</template>
