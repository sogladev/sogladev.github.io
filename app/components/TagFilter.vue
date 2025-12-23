<script setup lang="ts">
interface Props {
  tags: string[]
  selectedTag: string | null
}

defineProps<Props>()
const emit = defineEmits<{
  'toggle-tag': [tag: string]
}>()

const { getTagIcon } = useTagIcons()
</script>

<template>
  <div
    v-if="tags.length > 0"
    class="flex flex-wrap gap-2"
  >
    <span class="text-sm text-gray-600 dark:text-gray-400 self-center mr-2">
      Filter by tag:
    </span>
    <UTooltip
      v-for="tag in tags"
      :key="tag"
      :text="`Filter by ${tag}`"
      :shortcuts="[]"
    >
      <UBadge
        :color="selectedTag === tag ? 'primary' : 'neutral'"
        :variant="selectedTag === tag ? 'solid' : 'soft'"
        :icon="getTagIcon(tag)"
        class="cursor-pointer hover:scale-105 transition-transform"
        @click="emit('toggle-tag', tag)"
      >
        {{ tag }}
      </UBadge>
    </UTooltip>
  </div>
</template>
