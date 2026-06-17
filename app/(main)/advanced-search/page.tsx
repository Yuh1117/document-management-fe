import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tìm kiếm nâng cao',
}

import Files from '@/features/files/components/FilesPage'

export default function AdvancedSearchPage() {
  return <Files mode="search" />
}
