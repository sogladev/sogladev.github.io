<script setup lang="ts">
import { computed, ref } from 'vue'
import type { PropType } from 'vue'

const props = defineProps({
  collection: { type: String, required: true },
  cardVariant: { type: String as PropType<'grid' | 'compact' | 'featured' | 'list'>, default: 'grid' },
  limit: { type: Number, default: undefined },
  featuredOnly: { type: Boolean, default: false },
  showControls: { type: Boolean, default: true },
  showResultsCount: { type: Boolean, default: true },
})

const searchQuery = ref('')
const selectedTag = ref<string | null>(null)

// Fetch items from the content collection
const { data: items } = await useAsyncData<any[]>(`list-${props.collection}`, () => {
  // Use a loose-typed query to avoid strict collection field typing issues
  let q: any = queryCollection(props.collection as any)
    .order('date', 'DESC')

  if (props.featuredOnly) q = q.where('featured', '=', true)
  if (props.limit) q = q.limit(props.limit)

  return q.all()
})

// Extract unique tags
const allTags = computed(() => {
  if (!items.value) return []
  const tags = new Set<string>()
  items.value.forEach((i: any) => {
    i.tags?.forEach((t: string) => tags.add(t))
  })
  return Array.from(tags).sort()
})

// Filtered items
const filteredItems = computed(() => {
  if (!items.value) return []

  let filtered = [...items.value]

  // Filter by tag
  if (selectedTag.value) {
    filtered = filtered.filter((i: any) => i.tags?.includes(selectedTag.value!))
  }

  // Filter by search query
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    filtered = filtered.filter((i: any) =>
      (i.title && i.title.toLowerCase().includes(q))
      || (i.description && i.description.toLowerCase().includes(q))
      || (i.tags && i.tags.some((t: string) => t.toLowerCase().includes(q))),
    )
  }

  return filtered
})

const toggleTag = (tag: string) => {
  selectedTag.value = selectedTag.value === tag ? null : tag
}

// Determine content type mapping
const itemType = computed(() => (props.collection === 'projects' ? 'project' : 'article'))
</script>

<template>
  <div>
    <!-- Controls: Search & Tags -->
    <div
      v-if="showControls"
      class="mb-8 space-y-4"
    >
      <UInput
        v-model="searchQuery"
        type="search"
        enter-key-hint="search"
        leading
        :leading-icon="'i-heroicons-magnifying-glass-20-solid'"
        size="lg"
        placeholder="Search..."
        aria-label="Search"
      />

      <TagFilter
        :tags="allTags"
        :selected-tag="selectedTag"
        @toggle-tag="toggleTag"
      />
    </div>

    <!-- Results Count -->
    <div
      v-if="showResultsCount"
      class="mb-6"
    >
      <p class="text-sm text-gray-600 dark:text-gray-400">
        Showing {{ filteredItems.length }} item{{ filteredItems.length !== 1 ? 's' : '' }}
        <span
          v-if="selectedTag"
          class="font-medium"
        > with tag "{{ selectedTag }}"</span>
      </p>
    </div>

    <!-- Items -->
    <div v-if="filteredItems.length > 0">
      <UPageGrid v-if="cardVariant !== 'list'">
        <ContentCard
          v-for="item in filteredItems.filter(i => i.title)"
          :key="item.path"
          :content="item"
          :type="itemType"
          :variant="cardVariant"
          :show-secondary-action="false"
        />
      </UPageGrid>

      <div
        v-else
        class="space-y-6"
      >
        <ContentCard
          v-for="item in filteredItems"
          :key="item.path"
          :content="item"
          :type="itemType"
          :show-secondary-action="false"
        />
      </div>
    </div>

    <!-- No Results -->
    <div
      v-else
      class="text-center py-12"
    >
      <p class="text-gray-600 dark:text-gray-400">
        <span v-if="searchQuery || selectedTag">No items found matching your criteria.</span>
        <span v-else> No items available yet. </span>
      </p>
      <UButton
        v-if="searchQuery || selectedTag"
        variant="outline"
        class="mt-4"
        @click="() => { searchQuery = ''; selectedTag = null }"
      >
        Clear filters
      </UButton>
    </div>
  </div>
</template>
