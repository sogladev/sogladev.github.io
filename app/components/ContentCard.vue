<script setup lang="ts">
interface Props {
  content: any
  type: 'article' | 'project'
  compact?: boolean
  variant?: 'grid' | 'compact' | 'featured' | 'list'
  showSecondaryAction?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  compact: false,
  variant: 'grid',
  showSecondaryAction: true,
})

const { getTagIcon } = useTagIcons()

// Derived compact flag (either explicit `compact` or via `variant`)
const isCompact = computed(() => props.compact || props.variant === 'compact' || props.variant === 'grid')

// Compute visibility badges
const visibilityBadge = computed(() => {
  if (props.type !== 'project') return null

  const isPublic = !!props.content.repo

  if (!isPublic) return { label: 'Private', icon: 'i-heroicons-lock-closed' }
  return null
})

// Compute open-source badge (articles and projects can both be OSS)
const ossBadge = computed(() => {
  const isOSS = props.content.openSource === true || !!props.content.repo
  return isOSS ? { label: 'Open Source', icon: 'i-simple-icons-github' } : null
})

// Get tags limited by compact mode
const displayTags = computed(() => {
  const tags = props.content.tags || []
  return isCompact.value ? tags.slice(0, 3) : tags
})

// Get image URL or placeholder
const imageUrl = computed(() => {
  if (props.content.image) return props.content.image

  // Use placeholder with dynamic size based on compact mode
  const size = isCompact.value ? '300x180' : '400x240'
  return `https://placehold.jp/cccccc/ffffff/${size}.png?text=${encodeURIComponent(props.type === 'article' ? 'Article' : 'Project')}`
})
</script>

<template>
  <UCard class="overflow-hidden hover:shadow-lg transition-shadow">
    <div class="flex flex-col">
      <!-- Image -->
      <NuxtLink
        :to="content.path"
        class="block"
      >
        <div
          class="relative aspect-video overflow-hidden bg-gray-100 dark:bg-gray-800"
        >
          <img
            :src="imageUrl"
            :alt="content.title"
            class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          >
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

            <!-- Open Source Badge -->
            <UBadge
              v-if="ossBadge"
              color="success"
              variant="subtle"
              size="sm"
              :icon="ossBadge.icon"
            >
              {{ ossBadge.label }}
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
        <NuxtLink
          :to="content.path"
          class="group"
        >
          <h3
            :class="[
              'font-bold line-clamp-2 group-hover:text-primary transition-colors',
              isCompact ? 'text-xl' : 'text-2xl',
            ]"
          >
            {{ content.title }}
          </h3>
        </NuxtLink>

        <!-- Description -->
        <p
          :class="[
            'text-gray-600 dark:text-gray-400',
            isCompact ? 'line-clamp-2' : 'line-clamp-3',
          ]"
        >
          {{ content.description }}
        </p>

        <!-- Tech Icons -->
        <div
          v-if="displayTags.length > 0"
          class="flex flex-wrap gap-2"
        >
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
        <!-- Temporary disabled -->
        <!-- <div
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
        </div> -->
      </div>
    </div>
  </UCard>
</template>
