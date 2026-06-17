import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tổng quan | Admin',
}

import DashBoard from '@/features/admin/components/DashboardPage'

export default function AdminDashboardPage() {
  return <DashBoard />
}
