import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import NotFoundView from '@/pages/NotFoundView.vue'

const GLITCH_CHARS = '█▓▒░╗╔╚╝║═@#$%&?!<>{}[]^~'

function corruptTitle(text: string): string {
  const chars = text.split('')
  const count = 2 + Math.floor(Math.random() * (chars.length * 0.4))
  for (let i = 0; i < count; i++) {
    const idx = Math.floor(Math.random() * chars.length)
    chars[idx] = GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)] || '?'
  }
  return chars.join('')
}

let titleGlitchTimer: ReturnType<typeof setTimeout> | null = null
let titleGlitchRestoreTimer: ReturnType<typeof setTimeout> | null = null

function stopTitleGlitch() {
  if (titleGlitchTimer) { clearTimeout(titleGlitchTimer); titleGlitchTimer = null }
  if (titleGlitchRestoreTimer) { clearTimeout(titleGlitchRestoreTimer); titleGlitchRestoreTimer = null }
}

function startTitleGlitch() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReducedMotion) return

  function scheduleNext() {
    const interval = 2000 + Math.random() * 2000
    titleGlitchTimer = setTimeout(() => {
      if (document.hidden) {
        scheduleNext()
        return
      }
      const currentTitle = document.title
      document.title = corruptTitle(currentTitle)
      const restoreDelay = 80 + Math.random() * 60
      titleGlitchRestoreTimer = setTimeout(() => {
        document.title = currentTitle
        scheduleNext()
      }, restoreDelay)
    }, interval)
  }

  scheduleNext()
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
      meta: {
        title: 'SpaceDev CLI',
      }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundView,
      meta: {
        title: '404 | Not Found',
      }
    }
  ],
})

router.afterEach((to) => {
  stopTitleGlitch()

  const title = to.meta?.title
  if (typeof title === 'string') {
    document.title = title
  }

  if (to.name === 'not-found') {
    startTitleGlitch()
  }
})

export default router
