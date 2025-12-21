<script setup lang="ts">
  import type { ContentItem } from '~/types/content'

  interface Props {
    content: ContentItem
    type: 'article' | 'project'
    compact?: boolean
    showSecondaryAction?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    compact: false,
    showSecondaryAction: true
  })

  // Icon mapping for different tech stacks and topics
  // Prefer brand/simple-icons for well-known tech, fallback to Lucide
  const tagIcons: Record<string, string> = {
    // Brand icons
    rust: 'i-simple-icons-rust',
    docker: 'i-simple-icons-docker',
    nodejs: 'i-simple-icons-nodedotjs',
    typescript: 'i-simple-icons-typescript',
    javascript: 'i-simple-icons-javascript',
    python: 'i-simple-icons-python',
    vue: 'i-simple-icons-vuedotjs',
    react: 'i-simple-icons-react',
    nuxt: 'i-simple-icons-nuxtdotjs',
    tailwind: 'i-simple-icons-tailwindcss',
    kubernetes: 'i-simple-icons-kubernetes',
    mysql: 'i-simple-icons-mysql',
    cpp: 'i-simple-icons-cplusplus',
    'c++': 'i-simple-icons-cplusplus',

    // Generic / fallback icons (Lucide)
    lua: 'i-lucide-file-code',
    sql: 'i-lucide-database',
    'game-dev': 'i-lucide-gamepad-2',
    cli: 'i-lucide-terminal',
    devtools: 'i-lucide-wrench',
    tutorial: 'i-lucide-graduation-cap',
    guide: 'i-lucide-book-open',
    tips: 'i-lucide-lightbulb',
    features: 'i-lucide-sparkles',
    performance: 'i-lucide-zap',
    security: 'i-lucide-shield',
    database: 'i-lucide-database',
    api: 'i-lucide-cloud',
    web: 'i-lucide-globe',
    mobile: 'i-lucide-smartphone',
    backend: 'i-lucide-server',
    automation: 'i-lucide-workflow',
    scripting: 'i-lucide-file-code-2',
    azerothcore: 'i-lucide-gamepad-2'
  }

  const getTagIcon = (tag: string): string => {
    return tagIcons[tag.toLowerCase()] || 'i-lucide-tag'
  }

  // Compute visibility badges
  const visibilityBadge = computed(() => {
    if (props.type !== 'project') return null

    const repo = props.content.meta?.repo
    const isPublic = !!repo

    if (!isPublic) return { label: 'Private', icon: 'i-heroicons-lock-closed' }
    return null
  })

  // Get tags limited by compact mode
  const displayTags = computed(() => {
    const tags = props.content.tags || props.content.meta?.tags || []
    return props.compact ? tags.slice(0, 3) : tags
  })

  // Get image URL or placeholder
  const imageUrl = computed(() => {
    const metaImage = props.content.meta?.image
    if (metaImage) return metaImage

    // Use placeholder with dynamic size based on compact mode
    const size = props.compact ? '300x180' : '400x240'
    return `https://placehold.jp/cccccc/ffffff/${size}.png?text=${encodeURIComponent(props.type === 'article' ? 'Article' : 'Project')}`
  })

  // Secondary action config (for projects with GitHub)
  const hasGitHubLink = computed(() => {
    return (
      props.type === 'project' &&
      props.showSecondaryAction &&
      !!props.content.meta?.repo
    )
  })
</script>

<template>
  <UCard class="overflow-hidden hover:shadow-lg transition-shadow">
    <div class="flex flex-col">
      <!-- Image -->
      <NuxtLink :to="content.path" class="block">
        <div
          class="relative aspect-video overflow-hidden bg-gray-100 dark:bg-gray-800"
        >
          <img
            :src="imageUrl"
            :alt="content.title"
            class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      </NuxtLink>

      <!-- Content -->
      <div class="flex flex-col gap-4 p-6">
        <!-- Type badge + visibility badge + primary tag -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <UBadge
              :color="type === 'article' ? 'primary' : 'secondary'"
              variant="subtle"
              size="sm"
              :icon="
                type === 'article'
                  ? 'i-heroicons-document-text'
                  : 'i-heroicons-code-bracket'
              "
            >
              {{ type === 'article' ? 'Article' : 'Project' }}
            </UBadge>
            <UBadge
              v-if="visibilityBadge"
              color="neutral"
              variant="outline"
              size="sm"
              :icon="visibilityBadge.icon"
            >
              {{ visibilityBadge.label }}
            </UBadge>
          </div>
        </div>

        <!-- Title (clickable) -->
        <NuxtLink :to="content.path" class="group">
          <h3
            :class="[
              'font-bold line-clamp-2 group-hover:text-primary transition-colors',
              compact ? 'text-xl' : 'text-2xl'
            ]"
          >
            {{ content.title }}
          </h3>
        </NuxtLink>

        <!-- Description -->
        <p
          :class="[
            'text-gray-600 dark:text-gray-400',
            compact ? 'line-clamp-2' : 'line-clamp-3'
          ]"
        >
          {{ content.description }}
        </p>

        <!-- Tech Icons -->
        <div v-if="displayTags.length > 0" class="flex flex-wrap gap-2">
          <UTooltip
            v-for="tag in displayTags"
            :key="tag"
            :text="`Technology: ${tag}`"
            :shortcuts="[]"
          >
            <UBadge
              color="neutral"
              variant="soft"
              size="sm"
              :icon="getTagIcon(tag)"
            >
              {{ tag }}
            </UBadge>
          </UTooltip>
        </div>

        <!-- GitHub Action (projects only) -->
        <div
          v-if="hasGitHubLink"
          class="pt-4 border-t border-gray-200 dark:border-gray-800"
        >
          <UButton
            :to="content.meta.repo"
            external
            target="_blank"
            variant="outline"
            color="neutral"
            size="sm"
            icon="i-simple-icons-github"
          >
            View on GitHub
          </UButton>
        </div>
      </div>
    </div>
  </UCard>
</template>
