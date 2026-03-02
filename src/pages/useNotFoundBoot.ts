import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useTerminalStore } from '@/features/terminal/store/useTerminalStore'
import { useCommandEngine } from '@/features/terminal/logic/commandEngine'
import { useSceneStore } from '@/features/scenes/store/useSceneStore'
import { SCENE_NAMES } from '@/shared/constants/scenes'
import { i18n } from '@/shared/lib/i18n'

const t = i18n.global.t

const MORPH_CHARS = '█▓▒░╗╔╚╝║═@#$%&?!<>{}[]^~'

const ASCII_404 = `
 ██╗  ██╗ ██████╗ ██╗  ██╗
 ██║  ██║██╔═══██╗██║  ██║
 ███████║██║   ██║███████║
 ╚════██║██║   ██║╚════██║
      ██║╚██████╔╝     ██║
      ╚═╝ ╚═════╝      ╚═╝
`.trim()

export function useNotFoundBoot() {
  const router = useRouter()
  const store = useTerminalStore()
  const engine = useCommandEngine()
  const sceneStore = useSceneStore()

  const glitchActive = ref(false)
  const scanCanvas = ref<HTMLCanvasElement | null>(null)
  const noiseCanvas = ref<HTMLCanvasElement | null>(null)

  let disposed = false
  const timers: ReturnType<typeof setTimeout>[] = []
  let scanRafId = 0
  let noiseRafId = 0

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const requestedPath = window.location.pathname

  // --- Helpers ---
  function delay(ms: number): Promise<void> {
    return new Promise(resolve => {
      const t = setTimeout(resolve, ms)
      timers.push(t)
    })
  }

  function randomGarbage(len: number): string {
    let s = ''
    for (let i = 0; i < len; i++) {
      s += MORPH_CHARS[Math.floor(Math.random() * MORPH_CHARS.length)]
    }
    return s
  }

  // --- Glitch pulse ---
  async function glitchPulse(duration = 150) {
    if (prefersReducedMotion || disposed) return
    glitchActive.value = true
    await delay(duration)
    glitchActive.value = false
  }

  // --- Progress bar ---
  async function progressBar() {
    if (disposed) return
    const total = 13
    store.addEntry('[░░░░░░░░░░░░░] 0%', 'output')

    const steps = [
      { pct: 12, text: t('notFound.seekingSector') },
      { pct: 27, text: null },
      { pct: 41, text: null },
      { pct: 48, text: t('notFound.checksumMismatch') },
      { pct: 48, text: null },
    ]

    for (const step of steps) {
      if (disposed) return
      const filled = Math.round((step.pct / 100) * total)
      const bar = '█'.repeat(filled) + '░'.repeat(total - filled)
      store.updateLastEntry(`[${bar}] ${step.pct}%`)
      if (step.text) {
        await delay(300)
        store.addEntry(step.text, step.text === t('notFound.checksumMismatch') ? 'error' : 'system')
      }
      await delay(prefersReducedMotion ? 100 : 400)
    }
  }

  // --- Morph ASCII effect ---
  async function morphReveal(targetText: string) {
    if (disposed) return
    const targetLines = targetText.split('\n')
    const iterations = 6

    if (prefersReducedMotion) {
      for (const tl of targetLines) store.addEntry(tl, 'error')
      return
    }

    // Add placeholder lines with garbage
    const entryIds: string[] = []
    for (const tl of targetLines) {
      store.addEntry(randomGarbage(tl.length), 'error')
      const lastEntry = store.history[store.history.length - 1]
      if (lastEntry) entryIds.push(lastEntry.id)
    }

    for (let iter = 0; iter < iterations; iter++) {
      if (disposed) break
      const progress = (iter + 1) / iterations
      for (let li = 0; li < targetLines.length; li++) {
        const entry = store.history.find(e => e.id === entryIds[li])
        const target = targetLines[li] || ''
        if (!entry) continue
        let result = ''
        for (let ci = 0; ci < target.length; ci++) {
          if (Math.random() < progress) {
            result += target[ci]
          } else {
            result += MORPH_CHARS[Math.floor(Math.random() * MORPH_CHARS.length)]
          }
        }
        entry.content = result
      }
      await delay(80)
    }

    // Final pass
    for (let li = 0; li < targetLines.length; li++) {
      const entry = store.history.find(e => e.id === entryIds[li])
      if (entry) entry.content = targetLines[li] || ''
    }
  }

  // --- Register 404-specific commands ---
  function register404Commands() {
    engine.register({
      name: 'home',
      descKey: 'notFound.homeDesc',
      execute: async () => {
        await store.addTypewriterEntry(t('notFound.returning'), 'success')
        store.clearHistory()
        sceneStore.setScene(SCENE_NAMES.IDLE)
        engine.setAllowedCommands(null)
        const timer = setTimeout(() => router.push('/'), 600)
        timers.push(timer)
      }
    })

    // Ограничить команды только home
    engine.setAllowedCommands(['home'])
  }

  // --- Boot sequence ---
  async function bootSequence() {
    // Clear default welcome and start 404 sequence
    store.clearHistory()

    // Активировать 404 сцену в RenderPane
    sceneStore.setScene(SCENE_NAMES.NOT_FOUND)

    // Phase 1: Boot / typewriter
    await store.addTypewriterEntry(t('notFound.navigating', { path: requestedPath }), 'system', 30)
    await delay(400)
    await store.addTypewriterEntry(t('notFound.resolving'), 'system', 30)
    await delay(600)
    await store.addTypewriterEntry(t('notFound.syncing'), 'system', 25)
    await delay(500)

    // Phase 2: Scan + progress
    await store.addTypewriterEntry(t('notFound.scanning'), 'system', 20)
    await delay(300)
    await progressBar()

    // Phase 3: Glitch peaks
    await glitchPulse(150)
    await delay(200)
    await glitchPulse(180)
    await delay(200)
    await glitchPulse(120)

    // Phase 4: Error reveal
    await delay(400)
    store.addEntry('', 'output')
    store.addEntry(t('notFound.temporalDesync'), 'error')
    await delay(300)

    // Morph ASCII 404
    store.addEntry('', 'output')
    await morphReveal(ASCII_404)
    await delay(400)

    // Final glitch
    await glitchPulse(200)

    // Status lines
    store.addEntry('', 'output')
    await store.addTypewriterEntry(t('notFound.routeNotFound'), 'error', 20)
    await store.addTypewriterEntry(t('notFound.outsideMap'), 'warning', 20)
    store.addEntry('', 'output')
    await store.addTypewriterEntry(t('notFound.typeHome'), 'success', 15)
  }

  // --- Scan beam canvas ---
  function initScanBeam() {
    const canvas = scanCanvas.value
    if (!canvas || prefersReducedMotion) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let beamX = 0
    const speed = 2.5

    function resize() {
      if (!canvas) return
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    function draw() {
      if (disposed || !ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const gradient = ctx.createLinearGradient(beamX - 40, 0, beamX + 40, 0)
      gradient.addColorStop(0, 'rgba(51, 255, 102, 0)')
      gradient.addColorStop(0.5, 'rgba(51, 255, 102, 0.06)')
      gradient.addColorStop(1, 'rgba(51, 255, 102, 0)')
      ctx.fillStyle = gradient
      ctx.fillRect(beamX - 40, 0, 80, canvas.height)

      ctx.fillStyle = 'rgba(51, 255, 102, 0.12)'
      ctx.fillRect(beamX - 1, 0, 2, canvas.height)

      beamX += speed
      if (beamX > canvas.width + 40) beamX = -40

      scanRafId = requestAnimationFrame(draw)
    }
    draw()
  }

  // --- Noise canvas ---
  function initNoise() {
    const canvas = noiseCanvas.value
    if (!canvas || prefersReducedMotion) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    function resize() {
      if (!canvas) return
      canvas.width = Math.floor(window.innerWidth / 4)
      canvas.height = Math.floor(window.innerHeight / 4)
    }
    resize()
    window.addEventListener('resize', resize)

    let frame = 0
    function draw() {
      if (disposed || !ctx || !canvas) return
      frame++
      if (frame % 3 === 0) {
        const imageData = ctx.createImageData(canvas.width, canvas.height)
        const data = imageData.data
        for (let i = 0; i < data.length; i += 4) {
          const v = Math.random() > 0.97 ? 255 : 0
          data[i] = 0
          data[i + 1] = v
          data[i + 2] = 0
          data[i + 3] = v ? 8 : 0
        }
        ctx.putImageData(imageData, 0, 0)
      }
      noiseRafId = requestAnimationFrame(draw)
    }
    draw()
  }

  // --- Lifecycle ---
  onMounted(() => {
    register404Commands()
    initScanBeam()
    initNoise()
    bootSequence()
  })

  onBeforeUnmount(() => {
    disposed = true
    timers.forEach(clearTimeout)
    if (scanRafId) cancelAnimationFrame(scanRafId)
    if (noiseRafId) cancelAnimationFrame(noiseRafId)
    // Снять ограничение команд при уходе со страницы
    engine.setAllowedCommands(null)
  })

  return {
    glitchActive,
    scanCanvas,
    noiseCanvas,
    ascii404: ASCII_404,
  }
}
