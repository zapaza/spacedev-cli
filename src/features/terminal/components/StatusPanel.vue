<template>
  <div class="hidden md:flex h-full w-32 border-l border-neon-dim/20 flex-col py-4 px-2 font-mono text-[10px] select-none bg-background-panel/50">
    <!-- Time Section -->
    <div class="mb-6">
      <div class="text-neon-dim mb-1 tracking-widest">{{ t('status.time') }}</div>
      <div class="text-neon-glow font-bold tabular-nums">{{ formattedTime }}</div>
    </div>

    <!-- Mode Section -->
    <div class="mb-6">
      <div class="text-neon-dim mb-1 tracking-widest">{{ t('status.mode') }}</div>
      <div class="text-neon-primary font-bold break-all">{{ modeDisplay }}</div>
      <div class="mt-2 flex gap-1">
        <div v-for="i in 3" :key="i" class="w-1 h-1 bg-neon-glow" :class="{ 'animate-pulse': !sceneStore.isLoading && i === 1 }"></div>
      </div>
    </div>

    <!-- Lang Section -->
    <div class="mb-6">
      <div class="text-neon-dim mb-1 tracking-widest">{{ t('status.lang') }}</div>
      <div class="text-neon-primary font-bold">{{ settingsStore.lang.toUpperCase() }}</div>
    </div>

    <!-- Tip Section -->
    <div class="flex-1 flex flex-col justify-end pb-4">
      <div class="text-neon-dim mb-2 tracking-widest uppercase">{{ t('status.tip') }}</div>
      <div class="text-neon-soft italic leading-relaxed text-[9px] min-h-[4em]">
        > {{ currentTip }}
      </div>
    </div>

    <!-- System Decoration -->
    <div class="mt-4 pt-4 border-t border-neon-dim/10">
      <div class="flex flex-col gap-1 opacity-30">
        <div class="h-[2px] w-full bg-neon-dim/40"></div>
        <div class="h-[2px] w-2/3 bg-neon-dim/40"></div>
        <div class="h-[2px] w-1/3 bg-neon-dim/40"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSceneStore } from '@/features/scenes/store/useSceneStore'
import { useSettingsStore } from '@/shared/store/useSettingsStore'

const { t, tm } = useI18n()
const sceneStore = useSceneStore()
const settingsStore = useSettingsStore()
const TIME_UPDATE_MS = 1000
const TIP_UPDATE_MS = 10000

const currentTime = ref(new Date())
let timer: number | null = null

const tips = computed(() => tm('status.tips') as string[])

const currentTipIndex = ref(0)
let tipTimer: number | null = null

const formattedTime = computed(() => {
  return currentTime.value.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
})

const modeDisplay = computed(() => {
  if (sceneStore.isLoading) {
    return 'SYNCING...'
  }
  return sceneStore.currentScene.toUpperCase()
})

const currentTip = computed(() => tips.value[currentTipIndex.value])

onMounted(() => {
  timer = window.setInterval(() => {
    currentTime.value = new Date()
  }, TIME_UPDATE_MS)

  tipTimer = window.setInterval(() => {
    currentTipIndex.value = (currentTipIndex.value + 1) % tips.value.length
  }, TIP_UPDATE_MS)
})

onBeforeUnmount(() => {
  if (timer) {
    clearInterval(timer)
  }
  if (tipTimer) {
    clearInterval(tipTimer)
  }
})
</script>

<style scoped>
.tabular-nums {
  font-variant-numeric: tabular-nums;
}
</style>
