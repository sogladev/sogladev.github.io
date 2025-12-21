<script setup lang="ts">
  // Fetch recent articles
  const { data: articles } = await useAsyncData('home-articles', () => {
    return queryCollection('blog').order('date', 'DESC').limit(3).all()
  })

  // Fetch featured projects
  const { data: projects } = await useAsyncData('home-projects', () => {
    return queryCollection('projects')
      .where('featured', '=', true)
      .order('stars', 'DESC')
      .limit(3)
      .all()
  })
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

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ContentCard
            v-for="article in articles"
            :key="article.path"
            :content="article"
            type="article"
            compact
            :show-secondary-action="false"
          />
        </div>
      </div>
    </div>

    <!-- Featured Projects Section -->
    <div
      v-if="projects && projects.length > 0"
      class="py-6 bg-gray-50 dark:bg-gray-900/50"
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

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ContentCard
            v-for="project in projects"
            :key="project.path"
            :content="project"
            type="project"
            compact
          />
        </div>
      </div>
    </div>
  </div>
</template>
