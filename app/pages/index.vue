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
          Software Engineer focused on open-source systems
        </h1>
        <p class="text-lg text-gray-600 dark:text-gray-400">
          Building open-source tools, systems, and long-running projects, from low-level C++ cores to modern cross-platform applications.
        </p>
      </div>
    </div>

    <!-- Featured Projects Section -->
    <div class="py-12">
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

        <ListPage
          collection="projects"
          card-variant="compact"
          :limit="3"
          :featured-only="true"
          :show-controls="false"
          :show-results-count="false"
        />
      </div>
    </div>

    <!-- Recent Articles Section -->
    <div class="py-12 bg-gray-50 dark:bg-gray-900/50">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
            Recent Articles
          </h2>
          <UButton
            to="/articles"
            variant="outline"
            trailing-icon="i-heroicons-arrow-right"
          >
            View All Articles
          </UButton>
        </div>

        <ListPage
          collection="articles"
          card-variant="compact"
          :limit="3"
          :show-controls="false"
          :show-results-count="false"
        />
      </div>
    </div>
  </div>
</template>
