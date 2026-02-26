import { createI18n } from 'vue-i18n'
import en from './messages/en'
import ru from './messages/ru'
import { detectLocale } from './detectLocale'

export const i18n = createI18n({
  legacy: false,
  locale: detectLocale(),
  fallbackLocale: 'en',
  messages: {
    en,
    ru
  }
})
