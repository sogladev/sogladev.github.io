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
  routeRules: {
    '/.well-known/**': { cache: { maxAge: 60 * 10 } },
  },
  compatibilityDate: '2024-04-03',
  image: {
    provider: 'github',
  },
})
