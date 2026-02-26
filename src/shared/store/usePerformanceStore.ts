import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePerformanceStore = defineStore('performance', () => {
  const fps = ref(60)
  const isLowPerformance = ref(false)
  const reducedMotion = ref(typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false)

  // Порог для переключения в режим низкой производительности
  const FPS_THRESHOLD = 30
  const LOW_FPS_STREAK_LIMIT = 120
  let lowFpsCount = 0

  function updateFps(currentFps: number) {
    fps.value = Math.round(currentFps)

    if (currentFps < FPS_THRESHOLD) {
      lowFpsCount++
    } else {
      lowFpsCount = Math.max(0, lowFpsCount - 1)
    }

    // Если FPS стабильно низкий (например, более 120 кадров подряд), включаем режим экономии
    if (lowFpsCount > LOW_FPS_STREAK_LIMIT && !isLowPerformance.value) {
      isLowPerformance.value = true
    }
  }

  function initListeners() {
    if (typeof window === 'undefined') {
      return
    }
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    mediaQuery.addEventListener('change', (e) => {
      reducedMotion.value = e.matches
    })
  }

  return {
    fps,
    isLowPerformance,
    reducedMotion,
    updateFps,
    initListeners
  }
})
