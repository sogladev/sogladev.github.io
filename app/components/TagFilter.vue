<script setup lang="ts">
interface Props {
  tags: string[]
  selectedTag: string | null
}

defineProps<Props>()
const emit = defineEmits<{
  'toggle-tag': [tag: string]
}>()

// Icon mapping for tags
const tagIcons: Record<string, string> = {
  // Brand icons
  'rust': 'i-simple-icons-rust',
  'docker': 'i-simple-icons-docker',
  'nodejs': 'i-simple-icons-nodedotjs',
  'typescript': 'i-simple-icons-typescript',
  'javascript': 'i-simple-icons-javascript',
  'python': 'i-simple-icons-python',
  'vue': 'i-simple-icons-vuedotjs',
  'react': 'i-simple-icons-react',
  'nuxt': 'i-simple-icons-nuxtdotjs',
  'tailwind': 'i-simple-icons-tailwindcss',
  'kubernetes': 'i-simple-icons-kubernetes',
  'mysql': 'i-simple-icons-mysql',
  'cpp': 'i-simple-icons-cplusplus',
  'c++': 'i-simple-icons-cplusplus',

  // Generic / fallback icons (Lucide)
  'lua': 'i-lucide-file-code',
  'sql': 'i-lucide-database',
  'game-dev': 'i-lucide-gamepad-2',
  'cli': 'i-lucide-terminal',
  'devtools': 'i-lucide-wrench',
  'tutorial': 'i-lucide-graduation-cap',
  'guide': 'i-lucide-book-open',
  'tips': 'i-lucide-lightbulb',
  'features': 'i-lucide-sparkles',
  'performance': 'i-lucide-zap',
  'security': 'i-lucide-shield',
  'database': 'i-lucide-database',
  'api': 'i-lucide-cloud',
  'web': 'i-lucide-globe',
  'mobile': 'i-lucide-smartphone',
  'backend': 'i-lucide-server',
  'automation': 'i-lucide-workflow',
  'scripting': 'i-lucide-file-code-2',
  'azerothcore': 'i-lucide-gamepad-2',
}

const getTagIcon = (tag: string): string => {
  return tagIcons[tag.toLowerCase()] || 'i-lucide-tag'
}
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
