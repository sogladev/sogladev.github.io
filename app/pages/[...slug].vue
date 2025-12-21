<script setup lang="ts">
const route = useRoute()

const { data: page } = await useAsyncData('page-' + route.path, () => {
  return queryCollection('pages').path(route.path).first()
})

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
    fatal: true,
  })
}

// SEO
useHead({
  title: page.value?.title,
  meta: [{ name: 'description', content: page.value?.description }],
})
</script>

<template>
  <UContainer>
    <article class="py-12">
      <div class="max-w-4xl mx-auto">
        <div class="prose prose-lg dark:prose-invert max-w-none">
          <ContentRenderer
            v-if="page"
            :value="page"
          />
        </div>
      </div>
    </article>
  </UContainer>
</template>
