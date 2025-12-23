import { defineNuxtConfig } from 'nuxt/config'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/test-utils',
    '@nuxt/ui',
    '@nuxt/icon',
  ],
  devtools: { enabled: true, viteDevTools: true },
  app: {
    // Use NUXT_APP_BASE_URL (set to '/repo-name/') when deploying under a subpath (GitHub project pages).
    baseURL: process.env.NUXT_APP_BASE_URL || '/',
  },
  css: ['~/assets/css/main.css'],
  content: {
    build: {
      markdown: {
        highlight: {
          theme: {
            default: 'github-light',
            dark: 'github-dark',
          },
          langs: ['sql', 'cpp', 'yaml', 'bash', 'shell', 'zsh', 'typescript', 'javascript', 'markdown'],
        },
      },
    },
  },
  runtimeConfig: {
    public: {
      // Expose base URL to the client if components need it
      baseURL: process.env.NUXT_APP_BASE_URL || '/',
    },
  },
  routeRules: {
    '/.well-known/**': { cache: { maxAge: 60 * 10 } },
  },
  compatibilityDate: '2024-04-03',
  icon: {
    provider: 'iconify',
    // Collections are fetched from Iconify CDN at runtime (works on static hosts)
    collections: ['lucide', 'heroicons', 'simple-icons'],
  },
  image: {
    provider: 'github',
  },
})
