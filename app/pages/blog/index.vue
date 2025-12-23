<script setup lang="ts">
useHead({
  title: 'Blog - Articles & Tutorials',
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
      title="Blog"
      description="Technical articles, guides, and tutorials"
      :ui="{ root: 'relative border-b border-default py-0' }"
    />

    <UPageBody>
      <ListPage
        collection="blog"
        card-variant="compact"
      />
    </UPageBody>
  </UContainer>
</template>
