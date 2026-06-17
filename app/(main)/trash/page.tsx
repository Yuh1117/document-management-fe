import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Thùng rác',
}

import Files from '@/features/files/components/FilesPage'

export default function TrashPage() {
  return <Files mode="trash" />
}
