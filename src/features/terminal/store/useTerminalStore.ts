import { defineStore } from 'pinia';
import type { TerminalState, TerminalEntry, EntryType } from '../types';
import { i18n } from '@/shared/lib/i18n';

const DEFAULT_TYPEWRITER_SPEED_MS = 20;

export const useTerminalStore = defineStore('terminal', {
  state: (): TerminalState & { isTyping: boolean; skipTyping: boolean; theme: 'default' | 'senior' } => ({
    history: [
      {
        id: crypto.randomUUID(),
        type: 'system',
        content: i18n.global.t('terminal.welcome'),
        timestamp: Date.now(),
      }
    ],
    commandHistory: [],
    historyIndex: -1,
    isTyping: false,
    skipTyping: false,
    theme: 'default',
  }),

  actions: {
    addEntry(content: string, type: EntryType = 'output') {
      const entry: TerminalEntry = {
        id: crypto.randomUUID(),
        type,
        content,
        timestamp: Date.now(),
      };
      this.history.push(entry);
    },

    async addTypewriterEntry(content: string, type: EntryType = 'output', speed: number = DEFAULT_TYPEWRITER_SPEED_MS) {
      this.isTyping = true;
      const id = crypto.randomUUID();
      const entry: TerminalEntry = {
        id,
        type,
        content: '',
        timestamp: Date.now(),
      };
      this.history.push(entry);

      const targetEntry = this.history.find(e => e.id === id);
      if (!targetEntry) {
        this.isTyping = false;
        return;
      }

      for (let i = 0; i <= content.length; i++) {
        if (this.skipTyping) {
          targetEntry.content = content;
          break;
        }
        targetEntry.content = content.slice(0, i);
        await new Promise(resolve => setTimeout(resolve, speed));
      }
      this.isTyping = false;
    },

    clearHistory() {
      this.history = [];
      this.addEntry(i18n.global.t('terminal.cleared'), 'system');
    },

    addToCommandHistory(command: string) {
      if (command.trim() && this.commandHistory[this.commandHistory.length - 1] !== command) {
        this.commandHistory.push(command);
      }
      this.historyIndex = -1;
    },

    getPreviousCommand(): string | null {
      if (this.commandHistory.length === 0) return null;

      if (this.historyIndex === -1) {
        this.historyIndex = this.commandHistory.length - 1;
      } else if (this.historyIndex > 0) {
        this.historyIndex--;
      }

      return this.commandHistory[this.historyIndex] ?? null;
    },

    getNextCommand(): string | null {
      if (this.commandHistory.length === 0 || this.historyIndex === -1) return null;

      if (this.historyIndex < this.commandHistory.length - 1) {
        this.historyIndex++;
        return this.commandHistory[this.historyIndex] ?? null;
      } else {
        this.historyIndex = -1;
        return '';
      }
    },

    setTheme(theme: 'default' | 'senior') {
      this.theme = theme;
    },

    updateLastEntry(content: string) {
      const lastEntry = this.history[this.history.length - 1];
      if (lastEntry) {
        lastEntry.content = content;
      }
    }
  }
});
