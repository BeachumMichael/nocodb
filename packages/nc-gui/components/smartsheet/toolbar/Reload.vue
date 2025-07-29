<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'
import type { WatchHandle } from 'vue'

const { $e, $state } = useNuxtApp()
const { isPaginationLoading } = storeToRefs(useViewsStore())
const reloadHook = inject(ReloadViewDataHookInj)!

const isReloading = ref(false)

const onClick = () => {
  $e('a:table:reload:navbar')
  const stop: WatchHandle = watch($state.isLoading, (isLoading) => {
    if (!isLoading) {
      isReloading.value = false
      stop?.()
    }
  })
  isReloading.value = true
  reloadHook.trigger()
}

watch(isReloading, () => {
  isPaginationLoading.value = isReloading.value
})

let intervalId: ReturnType<typeof setInterval> | null = null

// Reload the View Every 1m
onMounted(() => {
  // Call once immediately
  onClick()
  // Call every 60 seconds
  intervalId = setInterval(onClick, 60 * 1000)
})

onBeforeUnmount(() => {
  if (intervalId) clearInterval(intervalId)
})
</script>


<template>
  <NcTooltip placement="bottom">
    <template #title> {{ $t('general.reload') }} </template>

    <div
      class="flex ml-1 items-center justify-center select-none cursor-pointer text-gray-500 w-5.5 h-5.5 hover:(bg-gray-100 text-black) rounded"
    >
      <component
        :is="iconMap.reload"
        class="group-hover:(text-primary) h-4 nc-icon-reload text-gray-400"
        :class="isReloading ? 'animate-spin' : ''"
        @click="onClick"
      />
    </div>
  </NcTooltip>
</template>
