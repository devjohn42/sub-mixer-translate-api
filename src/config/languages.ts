export const LANGUAGES = {
  pt: {
    code: 'pt',
    name: 'Português',
    flag: '🇧🇷',
    googleCode: 'pt'
  },
  en: {
    code: 'en',
    name: 'English',
    flag: '🇺🇸',
    googleCode: 'en'
  },
  ja: {
    code: 'ja',
    name: '日本語',
    flag: '🇯🇵',
    googleCode: 'ja'
  }
} as const

export type LanguageCode = keyof typeof LANGUAGES

export const isValidLanguage = (lang: string): lang is LanguageCode => {
  return lang in LANGUAGES
}

export const getLanguageName = (code: LanguageCode): string => {
  return LANGUAGES[code].name
}

export const getGoogleLanguageCode = (code: LanguageCode): string => {
  return LANGUAGES[code].googleCode
}
