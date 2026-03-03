<template>
  <div
    class="fixed inset-0 bg-background-primary flex items-center justify-center p-0 md:p-4 lg:p-8 select-none overflow-hidden"
    :class="{
      'low-perf': performanceStore.isLowPerformance,
      'reduced-motion': performanceStore.reducedMotion
    }"
    :data-theme="terminalStore.theme"
  >
    <!-- Внешнее обрамление монитора (Bezel) -->
    <div class="relative w-full h-full border-[4px] md:border-[16px] border-background-deep rounded-[1rem] md:rounded-[2rem] shadow-[0_0_80px_rgba(0,0,0,0.9),inset_0_0_20px_rgba(0,0,0,0.5)] bg-background-deep overflow-hidden flex flex-col">

      <!-- Контейнер экрана с CRT эффектами -->
      <div class="crt-screen flex-1 flex overflow-hidden bg-background-panel relative md:rounded-lg">
        <!-- CRT Overlay (Scanlines, Vignette, Flicker) -->
        <CRTOverlay />

        <!-- Split Layout Structure -->
        <div class="flex w-full h-full relative z-10">
          <div
            class="h-full border-neon-dim/10 relative overflow-hidden flex flex-col animate-panel-appear transition-all duration-500 ease-in-out"
            :class="{
              'w-full md:w-1/2 md:border-r pointer-events-auto': !isFullscreen,
              'md:w-0 opacity-0 pointer-events-none !border-r-0 overflow-hidden': isDoom,
              'md:absolute md:inset-0 md:z-20 md:bg-transparent md:pointer-events-none w-full h-full': isFullscreen && !isDoom
            }"
          >
            <slot name="terminal">
              <div class="p-6 font-mono text-neon-soft/40 italic">
                > Initializing terminal buffer...
              </div>
            </slot>
          </div>

          <!-- Render Pane -->
          <div
            class="h-full relative overflow-hidden flex flex-col items-center justify-center bg-background-primary/30 animate-panel-appear [animation-delay:200ms] transition-all duration-500 ease-in-out"
            :class="{
              'w-0 opacity-0 pointer-events-none md:w-1/2 md:opacity-100 md:pointer-events-auto md:flex': !isFullscreen,
              'w-full flex opacity-100 pointer-events-auto': isFullscreen
            }"
          >
            <slot name="render">
              <div class="flex flex-col items-center gap-4 opacity-30">
                <div class="w-24 h-24 border-2 border-dashed border-neon-glow rounded-full animate-spin-slow"></div>
                <div class="font-mono text-neon-glow text-xs tracking-[0.2em] uppercase">
                  Awaiting Visual Stream
                </div>
              </div>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import CRTOverlay from '@/shared/components/CRTOverlay.vue'
import { useTerminalStore } from '@/features/terminal/store/useTerminalStore'
import { useSceneStore } from '@/features/scenes/store/useSceneStore'
import { usePerformanceStore } from '@/shared/store/usePerformanceStore'
import { isFullscreenScene, SCENE_NAMES } from '@/shared/constants/scenes'

const terminalStore = useTerminalStore()
const sceneStore = useSceneStore()
const performanceStore = usePerformanceStore()
const isFullscreen = computed(() => {
  const current = isFullscreenScene(sceneStore.currentScene);
  const next = sceneStore.nextScene ? isFullscreenScene(sceneStore.nextScene as string) : false;
  return current || next;
})
const isDoom = computed(() => {
  return sceneStore.currentScene === SCENE_NAMES.DOOM || sceneStore.nextScene === SCENE_NAMES.DOOM;
})
</script>

<style scoped>
.animate-spin-slow {
  animation: spin 8s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Дополнительные стили для имитации глубины экрана */
.crt-screen {
  box-shadow: 0 0 10px rgba(51, 255, 102, 0.05);
}
</style>
