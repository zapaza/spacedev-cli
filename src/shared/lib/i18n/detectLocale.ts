const SUPPORTED_LOCALES = ['en', 'ru'];
const FALLBACK_LOCALE = 'en';

export function detectLocale(): 'en' | 'ru' {
  // 1. Проверяем localStorage
  const storedLang = typeof localStorage !== 'undefined' ? localStorage.getItem('terminal.lang') : null;
  if (storedLang && SUPPORTED_LOCALES.includes(storedLang)) {
    return storedLang as 'en' | 'ru';
  }

  // 2. Проверяем navigator (браузер)
  if (typeof navigator !== 'undefined') {
    // Проверяем navigator.languages
    const languages = navigator.languages || [];
    for (const lang of languages) {
      const normalized = lang.split('-')[0]?.toLowerCase();
      if (normalized && SUPPORTED_LOCALES.includes(normalized)) {
        return normalized as 'en' | 'ru';
      }
    }

    // Проверяем navigator.language
    const browserLang = navigator.language.split('-')[0]?.toLowerCase();
    if (browserLang && SUPPORTED_LOCALES.includes(browserLang)) {
      return browserLang as 'en' | 'ru';
    }
  }

  // 3. Fallback
  return FALLBACK_LOCALE as 'en' | 'ru';
}
