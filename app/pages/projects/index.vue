<script setup lang="ts">
// SEO
useHead({
  title: 'Projects - Portfolio',
  meta: [
    {
      name: 'description',
      content: 'A collection of my open-source projects and contributions.',
    },
  ],
})
</script>

<template>
  <UContainer>
    <UPageHeader
      title="Projects"
      description="A collection of my open-source projects and contributions"
      :ui="{ root: 'relative border-b border-default py-0' }"
    />

    <UPageBody>
      <ListPage
        collection="projects"
        card-variant="grid"
      />
    </UPageBody>
  </UContainer>
</template>
