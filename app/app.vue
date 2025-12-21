<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

const route = useRoute();

// Navigation items for the header
const navItems = computed<NavigationMenuItem[]>(() => [
  {
    label: "Home",
    to: "/",
    active: route.path === "/",
  },
  {
    label: "Blog",
    to: "/blog",
    active: route.path.startsWith("/blog"),
  },
  {
    label: "Projects",
    to: "/projects",
    active: route.path.startsWith("/projects"),
  },
]);

// Footer links
const footerLinks: NavigationMenuItem[] = [
  {
    label: "GitHub",
    to: "https://github.com",
    target: "_blank",
  },
  {
    label: "Twitter",
    to: "https://twitter.com",
    target: "_blank",
  },
];

// Content search setup (for @nuxt/content integration)
const { data: files } = useLazyAsyncData(
  "search",
  () => queryCollectionSearchSections("content"),
  {
    server: false,
  },
);

const { data: navigation } = await useAsyncData("navigation", () =>
  queryCollectionNavigation("content"),
);

const searchTerm = ref("");
</script>

<template>
  <UApp>
    <NuxtRouteAnnouncer />

    <!-- Content Search Component -->
    <ClientOnly>
      <LazyUContentSearch
        v-model:search-term="searchTerm"
        :files="files"
        :navigation="navigation"
        :fuse="{ resultLimit: 42 }"
        shortcut="meta_k"
      />
    </ClientOnly>

    <!-- Header with UHeader -->
    <UHeader title="DevPortfolio">
      <template #title>
        <span class="font-bold text-xl hover:text-primary transition-colors">
          DevPortfolio
        </span>
      </template>

      <!-- Navigation Menu in center -->
      <UNavigationMenu :items="navItems" />

      <template #right>
        <ClientOnly>
          <UContentSearchButton collapsed />
          <UColorModeButton />
        </ClientOnly>
      </template>

      <!-- Mobile menu body (shown when toggle is clicked) -->
      <template #body>
        <UNavigationMenu :items="navItems" orientation="vertical" />
      </template>
    </UHeader>

    <!-- Main Content -->
    <UMain>
      <NuxtPage />
    </UMain>

    <!-- Footer with UFooter -->
    <UFooter>
      <template #left>
        <p class="text-sm text-muted">
          © {{ new Date().getFullYear() }} DevPortfolio. Built with Nuxt & Nuxt
          UI.
        </p>
      </template>

      <UNavigationMenu :items="footerLinks" variant="link" />

      <template #right>
        <UButton
          icon="i-simple-icons-github"
          color="neutral"
          variant="ghost"
          to="https://github.com"
          target="_blank"
          aria-label="GitHub"
        />
        <UButton
          icon="i-simple-icons-twitter"
          color="neutral"
          variant="ghost"
          to="https://twitter.com"
          target="_blank"
          aria-label="Twitter"
        />
      </template>
    </UFooter>
  </UApp>
</template>
