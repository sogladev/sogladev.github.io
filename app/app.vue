<template>
  <div class="min-h-screen flex flex-col">
    <NuxtRouteAnnouncer />

    <!-- Header -->
    <header
      class="border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 bg-white dark:bg-gray-950"
    >
      <UContainer>
        <div class="flex items-center justify-between h-16">
          <!-- Logo/Brand -->
          <NuxtLink
            to="/"
            class="font-bold text-xl hover:text-primary transition-colors"
          >
            DevPortfolio
          </NuxtLink>

          <!-- Navigation -->
          <nav class="flex items-center gap-6">
            <NuxtLink
              to="/"
              class="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
              active-class="!text-primary font-medium"
            >
              Home
            </NuxtLink>
            <NuxtLink
              to="/blog"
              class="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
              active-class="!text-primary font-medium"
            >
              Blog
            </NuxtLink>
            <NuxtLink
              to="/projects"
              class="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
              active-class="!text-primary font-medium"
            >
              Projects
            </NuxtLink>

            <!-- Color Mode Toggle -->
            <ClientOnly>
              <UColorModeButton />
            </ClientOnly>
          </nav>
        </div>
      </UContainer>
    </header>

    <!-- Main Content -->
    <main class="flex-1">
      <NuxtPage />
    </main>

    <!-- Footer -->
    <footer class="border-t border-gray-200 dark:border-gray-800 py-8 mt-12">
      <UContainer>
        <div
          class="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-600 dark:text-gray-400"
        >
          <p>
            © {{ new Date().getFullYear() }} DevPortfolio. Built with Nuxt &
            Nuxt UI.
          </p>
          <div class="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              class="hover:text-primary transition-colors"
            >
              <UIcon name="i-simple-icons-github" class="w-5 h-5" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              class="hover:text-primary transition-colors"
            >
              <UIcon name="i-simple-icons-twitter" class="w-5 h-5" />
            </a>
          </div>
        </div>
      </UContainer>
    </footer>
  </div>
</template>
