'use client'

import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from '../public/locales/en/translation.json'
import vi from '../public/locales/vi/translation.json'

i18n.use(initReactI18next).init({
  lng: (typeof window !== 'undefined' && localStorage.getItem('language')) || 'vi',
  fallbackLng: 'vi',
  resources: {
    en: { translation: en },
    vi: { translation: vi },
  },
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
