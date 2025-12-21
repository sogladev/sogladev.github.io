---
title: 'Nuxt Content Tips and Tricks'
description: 'Essential tips for building documentation sites and blogs with Nuxt Content and Nuxt UI.'
tags: ['cpp', 'sql', 'game-dev']
date: 2025-01-10
author: 'Your Name'
---

# Nuxt Content Tips and Tricks

Nuxt Content is a powerful file-based CMS for Nuxt applications. Here are some tips to get the most out of it.

## Querying Content

Use the `queryContent()` composable to fetch content:

```ts
const { data: articles } = await useAsyncData('articles', () =>
  queryContent('/blog').sort({ date: -1 }).limit(10).find()
)
```

## Component Integration

You can use Vue components directly in your markdown:

```vue
<script setup>
  const count = ref(0)
</script>

<template>
  <div>
    <button @click="count++">Count: {{ count }}</button>
  </div>
</template>
```

## Syntax Highlighting

Nuxt Content supports syntax highlighting out of the box for many languages:

```cpp
#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}
```

## Custom Components

Create custom prose components for a unique look:

```typescript
interface ProseComponent {
  name: string
  props: Record<string, any>
  slots: Record<string, any>
}

export const useProseComponents = () => {
  return {
    h1: resolveComponent('ProseH1'),
    p: resolveComponent('ProseP')
  }
}
```

## Search Functionality

Implement full-text search using `queryContent()`:

```ts
const searchQuery = ref('')

const filteredContent = computed(() =>
  articles.value?.filter(
    article =>
      article.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      article.description
        .toLowerCase()
        .includes(searchQuery.value.toLowerCase())
  )
)
```

## Conclusion

These patterns will help you build powerful content-driven sites with Nuxt Content.
