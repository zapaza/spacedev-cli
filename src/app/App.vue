<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePerformanceStore } from '@/shared/store/usePerformanceStore'
import { useSettingsStore } from '@/shared/store/useSettingsStore'
import { useSceneStore } from '@/features/scenes/store/useSceneStore'
import { projects } from '@/content/projects'

const performanceStore = usePerformanceStore()
const settingsStore = useSettingsStore()
const sceneStore = useSceneStore()
const { t } = useI18n()

watch(() => [sceneStore.currentScene, settingsStore.lang], ([newScene, newLang]) => {
  if (typeof newLang === 'string') {
    document.documentElement.lang = newLang
  }

  if (typeof newScene === 'string' && newScene.startsWith('project-')) {
    const slug = newScene.replace('project-', '')
    const project = projects.find(p => p.slug === slug)
    if (project) {
      document.title = `${t(project.name)} | ${t('terminal.title')}`
    }
  }
}, { immediate: true })

onMounted(() => {
  performanceStore.initListeners()
  settingsStore.init()
})
</script>
