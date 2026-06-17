import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cài đặt hệ thống | Admin',
}

import SettingAdminPage from '@/features/admin/components/SettingPage'

export default function AdminSettingsPage() {
  return <SettingAdminPage />
}
