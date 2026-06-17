import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tìm kiếm',
}

import Files from '@/features/files/components/FilesPage'

export default function SearchPage() {
  return <Files mode="search" />
}
