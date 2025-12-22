<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  owner: string
  repo: string
  number: string | number
  title?: string
  showIcon?: boolean
  target?: string
  rel?: string
}

const props = defineProps<Props>()

const url = computed(
  () =>
    `https://github.com/${props.owner}/${props.repo}/issues/${props.number}`,
)
const label = computed(
  () => props.title ?? `${props.owner}/${props.repo}#${props.number}`,
)
</script>

<template>
  <a
    :href="url"
    :aria-label="`Open GitHub issue ${props.number} on GitHub`"
    :target="props.target ?? '_blank'"
    :rel="props.rel ?? 'noopener noreferrer'"
    class="github-issue-link"
  >
    <svg
      v-if="props.showIcon ?? true"
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
      class="gh-icon"
    >
      <path
        fill-rule="evenodd"
        d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.073.55-.173.55-.386 0-.19-.007-.693-.01-1.36-2.01.368-2.43-.49-2.58-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.073-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.083-.2-.36-1.02.078-2.12 0 0 .67-.215 2.2.82.64-.178 1.33-.267 2.02-.27.69.003 1.38.092 2.02.27 1.53-1.035 2.2-.82 2.2-.82.438 1.1.16 1.92.078 2.12.51.56.82 1.28.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.19 0 .214.15.463.55.385C13.71 14.53 16 11.54 16 8c0-4.42-3.58-8-8-8z"
      />
    </svg>

    <span class="issue-badge">#{{ props.number }}</span>
    <span
      v-if="props.title"
      class="issue-title"
    >{{ props.title }}</span>
    <span
      v-else
      class="issue-title"
    >{{ label }}</span>
  </a>
</template>

<style scoped>
.github-issue-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #0969da;
  /* GitHub link blue */
  text-decoration: none;
  border: 1px solid rgba(9, 105, 218, 0.08);
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.95rem;
}

.gh-icon {
  width: 1rem;
  height: 1rem;
}

.issue-badge {
  background: #f1f8ff;
  color: #0f1720;
  padding: 0.12rem 0.36rem;
  border-radius: 9999px;
  font-weight: 600;
  font-size: 0.85rem;
}

.issue-title {
  color: inherit;
  opacity: 0.95;
}

.github-issue-link:hover {
  background: rgba(9, 105, 218, 0.04);
}
</style>
