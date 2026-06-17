import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Phản hồi tóm tắt | Admin',
}

import SummaryFeedbackAdminPage from '@/features/admin/components/SummaryFeedbackPage'

export default function AdminSummaryFeedbackPage() {
  return <SummaryFeedbackAdminPage />
}
