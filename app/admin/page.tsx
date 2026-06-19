import type { Metadata } from 'next'
import { getT } from '@/lib/getMetadata'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT()
  return { title: `${t.admin.dashboard} | Admin` }
}

import DashBoard from '@/features/admin/components/DashboardPage'

export default function AdminDashboardPage() {
  return <DashBoard />
}
