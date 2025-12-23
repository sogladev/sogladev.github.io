<script setup lang="ts">
useHead({
  title: 'Articles - Articles & Tutorials',
  meta: [
    {
      name: 'description',
      content:
          'Technical articles, guides, and tutorials on software development.',
    },
  ],
})
</script>

<template>
  <UContainer>
    <UPageHeader
      title="Articles"
      description="Technical articles, guides, and tutorials"
      :ui="{ root: 'relative border-b border-default py-0' }"
    />

    <UPageBody>
      <ListPage
        collection="articles"
        card-variant="compact"
      />
    </UPageBody>
  </UContainer>
</template>
