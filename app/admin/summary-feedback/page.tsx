import type { Metadata } from 'next'
import { getT } from '@/lib/getMetadata'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT()
  return { title: `${t.admin.summary_feedback} | Admin` }
}

import SummaryFeedbackAdminPage from '@/features/admin/components/SummaryFeedbackPage'

export default function AdminSummaryFeedbackPage() {
  return <SummaryFeedbackAdminPage />
}
