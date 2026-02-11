<script setup lang="ts">
interface Props {
  src: string
  caption?: string
  width?: string
}

const props = withDefaults(defineProps<Props>(), {
  width: '100%',
})

const videoRef = ref<HTMLVideoElement | null>(null)
const isLoaded = ref(false)

const handlePlay = () => {
  isLoaded.value = true
  nextTick(() => {
    videoRef.value?.play()
  })
}
</script>

<template>
  <figure class="my-6">
    <div class="relative">
      <!-- Play button overlay -->
      <button
        v-if="!isLoaded"
        class="absolute inset-0 flex items-center justify-center bg-gray-900/50 rounded-lg hover:bg-gray-900/60 transition-colors cursor-pointer z-10"
        @click="handlePlay"
        aria-label="Play video"
      >
        <div class="w-20 h-20 bg-primary rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
          <UIcon name="i-heroicons-play-solid" class="w-10 h-10 text-white ml-1" />
        </div>
      </button>

      <video
        ref="videoRef"
        controls
        :width="props.width"
        :preload="isLoaded ? 'auto' : 'none'"
        playsinline
        class="rounded-lg shadow-lg mx-auto bg-gray-100 dark:bg-gray-800"
      >
        <source :src="props.src" type="video/mp4">
        Your browser does not support the video tag.
      </video>
    </div>

    <figcaption
      v-if="caption"
      class="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center"
    >
      {{ caption }}
    </figcaption>
  </figure>
</template>
