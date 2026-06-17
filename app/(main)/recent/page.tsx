import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gần đây',
}

import Files from '@/features/files/components/FilesPage'

export default function RecentPage() {
  return <Files mode="recent" />
}
