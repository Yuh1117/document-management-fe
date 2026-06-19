import type { Metadata } from 'next'
import { getT } from '@/lib/getMetadata'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT()
  return { title: `${t.admin.settings} | Admin` }
}

import SettingAdminPage from '@/features/admin/components/SettingPage'

export default function AdminSettingsPage() {
  return <SettingAdminPage />
}
