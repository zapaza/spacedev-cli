<template>
  <AppLayout>
    <template #terminal>
      <TerminalShell />
    </template>

    <template #render>
      <RenderPane />
    </template>
  </AppLayout>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import AppLayout from '@/widgets/layout/AppLayout.vue'
import TerminalShell from '@/features/terminal/components/TerminalShell.vue'

const RenderPane = defineAsyncComponent(() => import('@/widgets/render/RenderPane.vue'))
</script>

