<script lang="ts" setup>
const { header } = useAppConfig();
</script>

<template>
  <UHeader>
    <template #title>
      <UBadge
        :label="header.title"
        size="lg"
        color="primary"
        variant="outline"
        class="font-bold text-lg"
      />
    </template>
  </UHeader>
</template>
