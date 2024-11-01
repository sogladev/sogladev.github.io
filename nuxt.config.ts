// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxt/content'],

  routeRules: {
    '/': { prerender: true }
  },

  // Static rendering
  target: 'static',
  ssr: false,

  compatibilityDate: '2024-11-01'
})
