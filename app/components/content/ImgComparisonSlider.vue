<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

interface Props {
  leftImage: string
  rightImage: string
}

const props = defineProps<Props>()

const VueCompareImage = defineAsyncComponent(() =>
  import('vue3-compare-image').then((m) => m.VueCompareImage)
)
</script>

<template>
  <ClientOnly>
    <component
      :is="VueCompareImage"
      :left-image="leftImage"
      :right-image="rightImage"
    />
  </ClientOnly>
</template>

<style scoped>
/* Optional: Add styling for the comparison slider */
:deep(.compare-image-container) {
  max-width: 100%;
  height: auto;
}
</style>
