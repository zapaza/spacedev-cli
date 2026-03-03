<template>
  <div
    class="flex h-full font-mono overflow-hidden pointer-events-auto"
    @click="focusInput"
  >
    <div
      class="flex-1 flex flex-col p-4 md:p-6 min-w-0 overflow-hidden relative"
      :style="{
        paddingTop: 'env(safe-area-inset-top)',
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)',
        paddingBottom: inputBottomOffset > 0 ? `${inputBottomOffset}px` : undefined,
      }"
      @click="focusInput"
    >
      <div
        ref="terminalHistory"
        class="p-4 flex-1 overflow-y-auto mb-4 space-y-1 scrollbar-thin transition-opacity duration-500 pointer-events-auto select-text"
      >
        <div v-for="entry in store.history" :key="entry.id" :class="[
          'break-all whitespace-pre-wrap cursor-text',
          entry.type === 'command' ? 'text-neon-glow font-bold' : '',
          entry.type === 'system' ? 'text-neon-soft italic opacity-80' : '',
          entry.type === 'error' ? 'text-system-error' : '',
          entry.type === 'warning' ? 'text-system-warning' : '',
          entry.type === 'success' ? 'text-neon-primary' : '',
          entry.type === 'output' ? 'text-neon-primary opacity-90' : '',
        ]">
          <template v-if="entry.type === 'system'">
            <span class="text-[10px] opacity-50 mr-2 select-none">[{{ new Date(entry.timestamp).toLocaleTimeString() }}]</span>
            <template v-for="(part, idx) in formatContent(entry.content)" :key="idx">
              <a v-if="part.type === 'link'" :href="part.value" target="_blank" class="underline hover:text-neon-glow transition-colors pointer-events-auto">{{ part.value }}</a>
              <span v-else>{{ part.value }}</span>
            </template>
          </template>
          <template v-else>
            <template v-for="(part, idx) in formatContent(entry.content)" :key="idx">
              <a v-if="part.type === 'link'" :href="part.value" target="_blank" class="underline hover:text-neon-glow transition-colors pointer-events-auto">{{ part.value }}</a>
              <span v-else>{{ part.value }}</span>
            </template>
          </template>
        </div>
      </div>

      <div
        class="flex items-center gap-2 relative bg-background-panel/80 backdrop-blur-sm pointer-events-auto shrink-0"
        :style="{
          paddingBottom: inputBottomOffset > 0 ? '4px' : 'env(safe-area-inset-bottom)',
        }"
      >
        <span class="text-neon-glow font-bold shrink-0 animate-glow-pulse text-xs md:text-sm">{{ t('terminal.prompt') }}</span>

        <input
          ref="inputRef"
          v-model="currentInput"
          type="text"
          class="terminal-input flex-1 min-h-[1.5em] text-xs md:text-sm"
          autofocus
          spellcheck="false"
          autocomplete="off"
          @keydown.enter="handleEnter"
          @keydown.up.prevent="handleArrowUp"
          @keydown.down.prevent="handleArrowDown"
          @keydown.tab="handleTab"
          @keydown.l.ctrl.prevent="handleCtrlL"
        />
      </div>
    </div>

    <StatusPanel />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useTerminalStore } from '../store/useTerminalStore';
import { useCommandEngine } from '../logic/commandEngine';
import { useSceneStore } from '../../scenes/store/useSceneStore';
import { SCENE_NAMES } from '@/shared/constants/scenes';
import StatusPanel from './StatusPanel.vue';

const { t } = useI18n();
const store = useTerminalStore();
const engine = useCommandEngine();
const sceneStore = useSceneStore();

const currentInput = ref('');
const terminalHistory = ref<HTMLElement | null>(null);
const inputRef = ref<HTMLInputElement | null>(null);
const inputBottomOffset = ref(0);

// Обработка экранной клавиатуры через visualViewport
function handleViewportResize() {
  if (window.visualViewport) {
    const vv = window.visualViewport;
    const offsetFromBottom = window.innerHeight - (vv.offsetTop + vv.height);
    inputBottomOffset.value = Math.max(0, offsetFromBottom);
    // Scroll after layout adjusts to new padding
    scrollToBottom();
    // Fallback scroll with delay for slower devices
    setTimeout(scrollToBottom, 150);
  }
}

const formatContent = (content: string) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = content.split(urlRegex);
  return parts.map(part => {
    if (part.match(urlRegex)) {
      return { type: 'link', value: part };
    }
    return { type: 'text', value: part };
  });
};

const scrollToBottom = async () => {
  await nextTick();
  // Double rAF ensures layout is fully recalculated (especially after keyboard open/close)
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      if (terminalHistory.value) {
        terminalHistory.value.scrollTop = terminalHistory.value.scrollHeight;
      }
    });
  });
};

watch(() => store.history.length, scrollToBottom);
watch(() => store.history.map(e => e.content), scrollToBottom, { deep: true });
watch(inputBottomOffset, scrollToBottom);

// Автофокус при завершении печати
watch(() => store.isTyping, (newVal) => {
  if (!newVal) {
    nextTick(() => focusInput());
  }
});

// Автофокус при переключении на IDLE сцену (или любую другую интерактивную)
watch(() => sceneStore.currentScene, (newScene, oldScene) => {
  if (newScene === SCENE_NAMES.DOOM) {
    inputRef.value?.blur();
  }

  // Возврат фокуса при переходе ИЗ Doom или ПРИ переходе в IDLE
  if ((oldScene === SCENE_NAMES.DOOM && newScene !== SCENE_NAMES.DOOM) || newScene === SCENE_NAMES.IDLE) {
    nextTick(() => {
      // Задержка чтобы дождаться конца анимации AppLayout
      setTimeout(focusInput, 550);
    });
  }
});

const handleEnter = async () => {
  if (store.isTyping) {
    store.skipTyping = true;
    return;
  }
  const input = currentInput.value;
  currentInput.value = '';
  await engine.execute(input);
};

const setCursorToEnd = async () => {
  await nextTick();
  if (inputRef.value) {
    const len = currentInput.value.length;
    inputRef.value.setSelectionRange(len, len);
  }
};

const handleArrowUp = async () => {
  const prev = store.getPreviousCommand();
  if (prev !== null) {
    currentInput.value = prev;
    await setCursorToEnd();
  }
};

const handleArrowDown = async () => {
  const next = store.getNextCommand();
  if (next !== null) {
    currentInput.value = next;
    await setCursorToEnd();
  }
};

const handleTab = async (e: KeyboardEvent) => {
  e.preventDefault();
  const completed = engine.autocomplete(currentInput.value);
  if (completed) {
    currentInput.value = completed;
    await setCursorToEnd();
  }
};

const handleCtrlL = () => {
  store.clearHistory();
};

const focusInput = () => {
  if (sceneStore.currentScene === SCENE_NAMES.DOOM) return;
  inputRef.value?.focus();
};

onMounted(() => {
  focusInput();
  scrollToBottom();
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', handleViewportResize);
    window.visualViewport.addEventListener('scroll', handleViewportResize);
  }
});

onBeforeUnmount(() => {
  if (window.visualViewport) {
    window.visualViewport.removeEventListener('resize', handleViewportResize);
    window.visualViewport.removeEventListener('scroll', handleViewportResize);
  }
});
</script>

<style scoped>
.scrollbar-thin::-webkit-scrollbar {
  width: 4px;
}

/* Стилизация стандартного инпута */
.terminal-input {
  background: transparent;
  border: none;
  outline: none;
  font-family: inherit;
  color: var(--neon-primary);
  caret-color: var(--neon-primary);
  /* Для некоторых браузеров можно попробовать block курсор */
  caret-shape: block;
}
</style>
