<template>
  <div class="relative" :class="{ 'glitch-pulse': glitchActive }">
    <!-- Scan beam canvas (fullscreen) -->
    <canvas
      ref="scanCanvas"
      class="fixed inset-0 z-[200] pointer-events-none"
    />

    <!-- Noise/particle canvas (fullscreen) -->
    <canvas
      ref="noiseCanvas"
      class="fixed inset-0 z-[190] pointer-events-none opacity-40"
    />

    <AppLayout>
      <template #terminal>
        <TerminalShell />
      </template>

      <template #render>
        <RenderPane />
      </template>
    </AppLayout>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import AppLayout from '@/widgets/layout/AppLayout.vue'
import TerminalShell from '@/features/terminal/components/TerminalShell.vue'
import { useNotFoundBoot } from './useNotFoundBoot'

const RenderPane = defineAsyncComponent(() => import('@/widgets/render/RenderPane.vue'))

const { glitchActive, scanCanvas, noiseCanvas } = useNotFoundBoot()
</script>

<style scoped>
/* Glitch pulse – RGB split + shift */
.glitch-pulse {
  animation: glitch-shift 150ms steps(2) forwards;
}

@keyframes glitch-shift {
  0% {
    transform: translateX(0);
    filter: none;
  }
  25% {
    transform: translateX(-3px);
    filter: drop-shadow(2px 0 0 rgba(255, 0, 0, 0.5)) drop-shadow(-2px 0 0 rgba(0, 255, 255, 0.5));
  }
  50% {
    transform: translateX(2px);
    filter: drop-shadow(-2px 0 0 rgba(255, 0, 0, 0.4)) drop-shadow(2px 0 0 rgba(0, 255, 255, 0.4));
  }
  75% {
    transform: translateX(-1px);
    filter: drop-shadow(1px 0 0 rgba(255, 0, 0, 0.3)) drop-shadow(-1px 0 0 rgba(0, 255, 255, 0.3));
  }
  100% {
    transform: translateX(0);
    filter: none;
  }
}

/* Reduced motion: disable all heavy animations */
@media (prefers-reduced-motion: reduce) {
  .glitch-pulse {
    animation: none !important;
    filter: none !important;
    transform: none !important;
  }

  canvas {
    display: none !important;
  }
}
</style>
