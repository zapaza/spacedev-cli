<template>
  <div
    ref="doomContainer"
    class="doom-container absolute inset-0 w-full h-full bg-black z-10 overflow-hidden flex flex-col outline-none focus:outline-none"
    tabindex="0"
    @click="focusDoom"
  >
    <div class="flex-1 relative overflow-hidden flex items-center justify-center bg-black">
      <iframe
        ref="doomIframe"
        src="/games/doom/player.html"
        class="w-full h-full border-none"
        allow="autoplay; keyboard"
      ></iframe>

      <!-- Индикация загрузки внутри компонента -->
      <div
        v-if="!isReady"
        class="absolute inset-0 flex flex-col items-center justify-center bg-black text-neon-glow font-mono z-30"
      >
        <div class="mb-4 animate-pulse">{{ status }}</div>
        <div class="w-48 h-1 bg-neon-dim/20 relative">
          <div
            class="absolute inset-y-0 left-0 bg-neon-glow transition-all duration-300"
            :style="{ width: progress + '%' }"
          ></div>
        </div>
      </div>
    </div>

    <!-- Панель управления -->
    <div
      class="h-12 bg-background-deep border-t border-neon-dim/20 flex items-center justify-between px-4 z-20"
    >
      <div class="flex items-center gap-4">
        <div class="text-[10px] text-neon-dim font-mono tracking-widest uppercase">
          DOOM_OS v1.6.6
        </div>
      </div>
      <div class="flex items-center gap-2">
        <button
          @click="toggleFullscreen"
          class="px-3 py-1 border border-neon-dim/40 text-neon-dim hover:text-neon-glow hover:border-neon-glow text-[10px] uppercase tracking-tighter transition-colors font-mono"
        >
          [ {{ t('cmd.doom.fullscreen') }} ]
        </button>
        <button
          @click="closeGame"
          class="px-3 py-1 border border-system-error/40 text-system-error/60 hover:text-system-error hover:border-system-error text-[10px] uppercase tracking-tighter transition-colors font-mono"
        >
          [ {{ t('cmd.doom.close') }} ]
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSceneStore } from '@/features/scenes/store/useSceneStore'
import { useTerminalStore } from '@/features/terminal/store/useTerminalStore'
import { SCENE_NAMES } from '@/shared/constants/scenes'

declare global {
  interface Window {
    Dos: any
  }
}

const { t } = useI18n()
const sceneStore = useSceneStore()
const terminalStore = useTerminalStore()

const doomIframe = ref<HTMLIFrameElement | null>(null)
const doomContainer = ref<HTMLElement | null>(null)
const isReady = ref(false)
const status = ref('Initializing...')
const progress = ref(0)
const isClosing = ref(false)

const handleIframeMessage = (event: MessageEvent) => {
  if (event.data.type === 'doom-ready') {
    isReady.value = true
    progress.value = 100
    status.value = 'Ready'
    // Фокусируем iframe чтобы он начал ловить клавиши
    doomIframe.value?.focus()
  } else if (event.data.type === 'doom-terminated') {
    closeGame()
  }
}

const focusDoom = () => {
  doomIframe.value?.focus()
}

const toggleFullscreen = () => {
  if (!doomContainer.value) return
  if (!document.fullscreenElement) {
    doomContainer.value.requestFullscreen().catch((err) => {
      console.error(`Error attempting to enable full-screen mode: ${err.message}`)
    })
  } else {
    document.exitFullscreen()
  }
}

const closeGame = async () => {
  if (isClosing.value) return
  isClosing.value = true

  if (doomIframe.value?.contentWindow) {
    doomIframe.value.contentWindow.postMessage({ type: 'doom-exit' }, '*')
  }

  // Выходим из фуллскрина если он был активен
  if (document.fullscreenElement) {
    try {
      await document.exitFullscreen()
    } catch {
      // Ignore
    }
  }

  sceneStore.setScene(SCENE_NAMES.IDLE)
  terminalStore.setTheme('default')
  await terminalStore.addTypewriterEntry(t('cmd.doom.closed'), 'system')
}

onMounted(() => {
  window.addEventListener('message', handleIframeMessage)
  status.value = 'Waking up engine...'
  progress.value = 20
})

onBeforeUnmount(() => {
  window.removeEventListener('message', handleIframeMessage)
})
</script>

<style scoped>
.doom-container {
  /* Гарантируем, что игра не вылезет за пределы */
  touch-action: none;
}

:deep(canvas) {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: 100%;
  object-fit: contain;
  image-rendering: pixelated;
}

:deep(.dosbox-container) {
  height: 100%;
  width: auto;
}
</style>
