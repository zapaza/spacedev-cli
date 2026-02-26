import { defineStore } from 'pinia';
import type { Ref } from 'vue';
import { i18n } from '@/shared/lib/i18n';
import { detectLocale } from '@/shared/lib/i18n/detectLocale';

/** vue-i18n в composition-режиме (legacy: false) хранит locale как Ref<string> */
const localeRef = i18n.global.locale as unknown as Ref<string>;

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    lang: detectLocale()
  }),
  actions: {
    init() {
      localeRef.value = this.lang;
    },
    setLang(newLang: 'ru' | 'en') {
      this.lang = newLang;
      localStorage.setItem('terminal.lang', newLang);
      localeRef.value = newLang;
    }
  }
});
