<template>
  <div ref="containerRef" class="w-full h-full relative overflow-hidden flex items-center justify-center">
    <!-- Задача 9: Canvas mount -->
    <canvas ref="canvasRef" class="block outline-none" :class="{ 'opacity-0': isFullscreen }"></canvas>

    <canvas
      v-if="isFullscreen"
      ref="matrixCanvasRef"
      class="absolute inset-0 block outline-none pointer-events-none"
    ></canvas>

    <div
      class="absolute inset-0 pointer-events-none p-4 md:p-6 flex flex-col justify-between"
      style="
        padding-top: env(safe-area-inset-top);
        padding-bottom: env(safe-area-inset-bottom);
        padding-right: env(safe-area-inset-right);
      "
    >
      <div class="flex justify-between items-start">
        <div class="space-y-1">
          <div class="text-[8px] md:text-[10px] text-neon-dim tracking-[0.3em] uppercase">{{ t('render.engine') }}</div>
          <div class="text-[10px] md:text-xs text-neon-glow font-bold tracking-widest uppercase flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-neon-glow" :class="{ 'animate-ping': !sceneStore.isLoading && !performanceStore.reducedMotion }"></span>
            {{ sceneStore.isLoading ? t('render.processing') : t('render.stable') }}
          </div>
          <div v-if="performanceStore.isLowPerformance" class="text-[8px] text-system-warning uppercase font-bold tracking-widest">
            {{ t('render.lowPerf') }}
          </div>
        </div>
        <div class="text-[8px] md:text-[10px] text-neon-dim font-mono text-right">
          {{ t('render.resolution') }} {{ containerRef?.clientWidth }}x{{ containerRef?.clientHeight }}<br/>
          {{ t('render.fps') }} {{ performanceStore.fps }}
        </div>
      </div>

      <div
        v-if="!isFullscreen && sceneStore.currentScene !== SCENE_NAMES.ABOUT"
        class="flex flex-col items-center gap-4 transition-all duration-500"
        :class="{ 'opacity-0': sceneStore.isLoading }"
      >
        <div class="h-[1px] w-16 md:w-24 bg-neon-dim/30"></div>
        <div class="text-neon-glow text-lg md:text-xl tracking-[0.5em] uppercase font-bold neon-text text-center animate-glow-pulse">
          {{ sceneStore.currentScene }}
        </div>
        <div class="h-[1px] w-16 md:w-24 bg-neon-dim/30"></div>
      </div>

      <div class="flex justify-between items-end">
        <div class="text-[9px] text-neon-dim max-w-[120px] uppercase leading-tight italic">
          {{ t('render.neural') }}
        </div>
        <div class="flex gap-1">
          <div v-for="i in 4" :key="i" class="w-1 h-3 bg-neon-dim/20" :class="{ 'bg-neon-soft/60': !sceneStore.isLoading && i <= 2 }"></div>
        </div>
      </div>
    </div>

    <!-- Загрузка -->
    <div v-if="sceneStore.isLoading" class="absolute inset-0 bg-background-primary/40 backdrop-blur-[2px] flex items-center justify-center z-20">
      <div class="flex flex-col items-center gap-4">
        <div class="relative w-16 h-16">
          <div class="absolute inset-0 border-2 border-neon-dim/20 rounded-full"></div>
          <div class="absolute inset-0 border-t-2 border-neon-glow rounded-full animate-spin"></div>
        </div>
        <div class="text-neon-glow text-[10px] tracking-[0.4em] uppercase animate-pulse flex items-center">
          {{ t('render.loading') }}<span class="loading-dots"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import type * as THREE_TYPES from 'three'
import { useSceneStore } from '@/features/scenes/store/useSceneStore'
import { useTerminalStore } from '@/features/terminal/store/useTerminalStore'
import { usePerformanceStore } from '@/shared/store/usePerformanceStore'
import { SCENE_NAMES, isFullscreenScene } from '@/shared/constants/scenes'
import { THEME_COLORS, SCENE_COLORS } from '@/shared/constants/theme'
import type { ThemeName } from '@/shared/constants/theme'

import type { MatrixScene } from '@/features/scenes/logic/MatrixScene'
import type { AsciiAssembleScene } from '@/features/scenes/logic/AsciiAssembleScene'
import type { NotFound404Scene } from '@/features/scenes/logic/NotFound404Scene'

const { t } = useI18n()
const sceneStore = useSceneStore()
const terminalStore = useTerminalStore()
const performanceStore = usePerformanceStore()
const containerRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const matrixCanvasRef = ref<HTMLCanvasElement | null>(null)

const isFullscreen = computed(() => isFullscreenScene(sceneStore.currentScene))

/** Освобождение geometry/material/texture у Three.js объекта и его потомков */
function disposeObject3D(obj: THREE_TYPES.Object3D) {
  obj.traverse((child) => {
    const meshChild = child as THREE_TYPES.Mesh
    if (meshChild.geometry) {
      meshChild.geometry.dispose()
    }
    if (meshChild.material) {
      const materials = Array.isArray(meshChild.material) ? meshChild.material : [meshChild.material]
      for (const mat of materials) {
        if ('map' in mat && mat.map) (mat.map as THREE_TYPES.Texture).dispose()
        mat.dispose()
      }
    }
  })
}

function themeColor(theme: ThemeName) {
  return THEME_COLORS[theme].hex
}

let renderer: THREE_TYPES.WebGLRenderer | null = null
let scene: THREE_TYPES.Scene | null = null
let camera: THREE_TYPES.PerspectiveCamera | null = null
let animationFrameId: number | null = null
let THREE: typeof THREE_TYPES | null = null
let mesh: THREE_TYPES.Mesh<THREE_TYPES.BufferGeometry, THREE_TYPES.MeshBasicMaterial> | null = null
let projectCube: THREE_TYPES.Mesh | null = null
let starDust: THREE_TYPES.Points | null = null

// Переменные для FPS мониторинга
let lastTime = performance.now()
let frameCount = 0
let lastFrameTime = performance.now()
const FPS_LIMIT = 60
const FRAME_MIN_TIME = 1000 / FPS_LIMIT

// Переменные для анимации куба
let cubeVelocity = 0
const mouse = { x: 0, y: 0 }
const targetMouse = { x: 0, y: 0 }

// Переменные для Матрицы
let matrixCtx: CanvasRenderingContext2D | null = null
let activeMatrixScene: MatrixScene | null = null
let activeAsciiScene: AsciiAssembleScene | null = null
let activeNotFoundScene: NotFound404Scene | null = null

const initMatrix = () => {
  if (!matrixCanvasRef.value) {
    return
  }
  matrixCtx = matrixCanvasRef.value.getContext('2d')
  if (!matrixCtx) {
    return
  }

  const { clientWidth, clientHeight } = containerRef.value!
  matrixCanvasRef.value.width = clientWidth
  matrixCanvasRef.value.height = clientHeight
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (sceneStore.currentScene === SCENE_NAMES.MATRIX && activeMatrixScene) {
    activeMatrixScene.handleKeyDown(e.key)
  }
}

// Динамическая инициализация Three.js
const initThree = async () => {
  if (!canvasRef.value) {
    return
  }

  try {
    // Задача 9: Динамический import Three.js
    THREE = await import('three')

    // Базовая настройка
    scene = new THREE.Scene()
    camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
    camera.position.z = 3

    renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.value,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    })

    // Добавим фоновый объект (Икосаэдр)
    const geometry = new THREE.IcosahedronGeometry(1.5, performanceStore.isLowPerformance ? 0 : 1)
    const material = new THREE.MeshBasicMaterial({
      color: THEME_COLORS.default.hex,
      wireframe: true,
      transparent: true,
      opacity: 0.2
    })
    mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    const starsGeometry = new THREE.BufferGeometry()
    const starsCount = performanceStore.isLowPerformance ? 500 : 1500
    const posArray = new Float32Array(starsCount * 3)

    for (let i = 0; i < starsCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 12
    }

    starsGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3))
    const starsMaterial = new THREE.PointsMaterial({
      size: 0.02,
      color: THEME_COLORS.default.hex,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    })

    starDust = new THREE.Points(starsGeometry, starsMaterial)
    scene.add(starDust)

    handleResize()
    initMatrix()
    animate()
  } catch {
    // Fail silently in production or log via other methods if needed
  }
}

const handleResize = () => {
  if (!containerRef.value || !renderer || !camera) {
    return
  }
  const { clientWidth, clientHeight } = containerRef.value
  renderer.setSize(clientWidth, clientHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  camera.aspect = clientWidth / clientHeight
  camera.updateProjectionMatrix()

  if (matrixCanvasRef.value) {
    matrixCanvasRef.value.width = clientWidth
    matrixCanvasRef.value.height = clientHeight
    initMatrix()
  }

  if (activeMatrixScene) {
    activeMatrixScene.resize(performanceStore.isLowPerformance)
  }
  if (activeAsciiScene) {
    activeAsciiScene.resize(performanceStore.isLowPerformance)
  }
  if (activeNotFoundScene) {
    activeNotFoundScene.resize(performanceStore.isLowPerformance)
  }
}

const handleMouseMove = (event: MouseEvent) => {
  if (!containerRef.value) {
    return
  }
  const { clientWidth, clientHeight } = containerRef.value
  const rect = containerRef.value.getBoundingClientRect()
  targetMouse.x = ((event.clientX - rect.left) / clientWidth) * 2 - 1
  targetMouse.y = -((event.clientY - rect.top) / clientHeight) * 2 + 1
}

const animate = () => {
  if (!renderer || !scene || !camera) {
    return
  }
  animationFrameId = requestAnimationFrame(animate)

  const now = performance.now()
  const deltaTime = now - lastFrameTime

  if (deltaTime < FRAME_MIN_TIME) {
    return
  }

  // Компенсируем дрифт времени
  lastFrameTime = now - (deltaTime % FRAME_MIN_TIME)

  // FPS мониторинг
  frameCount++
  if (now >= lastTime + 1000) {
    performanceStore.updateFps((frameCount * 1000) / (now - lastTime))
    frameCount = 0
    lastTime = now
  }

  // Плавное движение мыши
  mouse.x += (targetMouse.x - mouse.x) * 0.1
  mouse.y += (targetMouse.y - mouse.y) * 0.1

  if (mesh) {
    mesh.rotation.y += 0.002
    mesh.rotation.x += 0.001

    // Динамика от состояния стора
    if (sceneStore.isLoading) {
      mesh.rotation.y += 0.05
      if (!performanceStore.reducedMotion) {
        mesh.scale.setScalar(Math.sin(Date.now() * 0.01) * 0.2 + 0.8)
      }
    } else if (THREE) {
      mesh.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1)
    }
  }

  if (projectCube) {
    const targetScale = 1
    const spring = 0.15
    const friction = 0.8

    const force = (targetScale - projectCube.scale.x) * spring
    cubeVelocity += force
    cubeVelocity *= friction

    const newScale = projectCube.scale.x + cubeVelocity
    projectCube.scale.setScalar(newScale)

    // Hover tilt + Easing towards target rotation
    const targetRotX = performanceStore.reducedMotion ? 0 : mouse.y * 0.5
    const targetRotY = (performanceStore.reducedMotion ? 0 : mouse.x * 0.5) + Date.now() * 0.0005 // Subtle rotate base

    projectCube.rotation.x += (targetRotX - projectCube.rotation.x) * 0.05
    projectCube.rotation.y += (targetRotY - projectCube.rotation.y) * 0.05
  }

  if (starDust) {
    starDust.rotation.y += performanceStore.reducedMotion ? 0.0001 : 0.0005
    starDust.rotation.x += performanceStore.reducedMotion ? 0.00005 : 0.0002
  }

  if (sceneStore.currentScene === SCENE_NAMES.MATRIX && activeMatrixScene) {
    activeMatrixScene.draw(terminalStore.theme === 'senior', performanceStore.isLowPerformance)
  } else if (sceneStore.currentScene === SCENE_NAMES.ASCII_ASSEMBLE && activeAsciiScene) {
    activeAsciiScene.draw(terminalStore.theme === 'senior', performanceStore.isLowPerformance)
  } else if (sceneStore.currentScene === SCENE_NAMES.NOT_FOUND && activeNotFoundScene) {
    activeNotFoundScene.draw(terminalStore.theme === 'senior', performanceStore.isLowPerformance)
  } else {
    renderer.render(scene, camera)
  }
}

// Задача 9: Lifecycle dispose
const dispose = () => {
  if (animationFrameId) cancelAnimationFrame(animationFrameId)

  window.removeEventListener('resize', handleResize)
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('keydown', handleKeyDown)

  if (activeMatrixScene) {
    activeMatrixScene.dispose()
  }
  if (activeAsciiScene) {
    activeAsciiScene.dispose()
  }
  if (activeNotFoundScene) {
    activeNotFoundScene.dispose()
  }

  if (renderer) {
    renderer.dispose()
  }

  if (scene) {
    disposeObject3D(scene)
  }

  THREE = null
  scene = null
  camera = null
  renderer = null
  mesh = null
  projectCube = null
  starDust = null
}

onMounted(() => {
  initThree()
  window.addEventListener('resize', handleResize)
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('keydown', handleKeyDown)
})

onBeforeUnmount(() => {
  dispose()
})

// Реакция на смену сцены
watch(() => sceneStore.currentScene, async (newScene) => {
  if (!mesh || !THREE) {
    return
  }

  // Сброс активных 2D сцен при смене режима
  if (activeMatrixScene) {
    activeMatrixScene.dispose()
  }
  if (activeAsciiScene) {
    activeAsciiScene.dispose()
  }
  if (activeNotFoundScene) {
    activeNotFoundScene.dispose()
  }
  activeMatrixScene = null
  activeAsciiScene = null
  activeNotFoundScene = null

  if (newScene.startsWith('project-')) {
    const slug = newScene.replace('project-', '')
    const { createProjectCube } = await import('@/features/scenes/logic/ProjectCubeScene')

    // Очистка предыдущего куба
    if (projectCube) {
      scene?.remove(projectCube)
      disposeObject3D(projectCube)
    }

    projectCube = createProjectCube(THREE, slug, terminalStore.theme)
    cubeVelocity = 0
    scene?.add(projectCube)
    mesh.visible = false
  } else {
    // Возвращаем икосаэдр для обычных сцен
    mesh.visible = true
    if (projectCube) {
      scene?.remove(projectCube)
      projectCube = null
    }

    if (isFullscreenScene(newScene)) {
      mesh.material.color.setHex(themeColor(terminalStore.theme))
      mesh.visible = false
      if (starDust) {
        starDust.visible = false
      }

      await nextTick()
      initMatrix()

      if (matrixCtx && matrixCanvasRef.value) {
        if (newScene === SCENE_NAMES.MATRIX) {
          const { MatrixScene: MatrixClass } = await import('@/features/scenes/logic/MatrixScene')
          activeMatrixScene = new MatrixClass(matrixCtx, matrixCanvasRef.value, performanceStore.isLowPerformance)
        } else if (newScene === SCENE_NAMES.ASCII_ASSEMBLE && sceneStore.sceneParams?.ascii) {
          const { AsciiAssembleScene: AsciiClass } = await import('@/features/scenes/logic/AsciiAssembleScene')
          activeAsciiScene = new AsciiClass(matrixCtx, matrixCanvasRef.value, sceneStore.sceneParams.ascii as string, performanceStore.isLowPerformance)
        } else if (newScene === SCENE_NAMES.NOT_FOUND) {
          const { NotFound404Scene: NotFoundClass } = await import('@/features/scenes/logic/NotFound404Scene')
          activeNotFoundScene = new NotFoundClass(matrixCtx, matrixCanvasRef.value, performanceStore.isLowPerformance, t('notFound.sceneSubText'))
        }
      }
    } else {
      mesh.visible = true
      if (starDust) {
        starDust.visible = true
      }

      if (newScene === SCENE_NAMES.ABOUT) {
        mesh.material.color.setHex(SCENE_COLORS.about)
      } else if (newScene === SCENE_NAMES.PROJECTS) {
        mesh.material.color.setHex(SCENE_COLORS.projects)
      } else {
        mesh.material.color.setHex(themeColor(terminalStore.theme))
      }
    }
  }
})

// Реакция на смену темы
watch(() => terminalStore.theme, (newTheme) => {
  if (!mesh || !THREE) return

  // Обновляем цвет икосаэдра если он в дефолтной сцене
  if (sceneStore.currentScene === SCENE_NAMES.IDLE || sceneStore.currentScene === SCENE_NAMES.LOADING) {
    mesh.material.color.setHex(themeColor(newTheme))
  }

  // Обновляем цвет звездной пыли
  if (starDust) {
    (starDust.material as THREE_TYPES.PointsMaterial).color.setHex(themeColor(newTheme))
  }
})
</script>
