import { cookies } from 'next/headers'
import en from '@/public/locales/en/translation.json'
import vi from '@/public/locales/vi/translation.json'

const translations = { en, vi } as const
type Lang = keyof typeof translations

export async function getT() {
  const cookieStore = await cookies()
  const lang = (cookieStore.get('language')?.value ?? 'vi') as Lang
  return translations[lang] ?? translations.vi
}
