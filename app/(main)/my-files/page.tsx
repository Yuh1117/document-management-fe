import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tài liệu của tôi',
}

import Files from '@/features/files/components/FilesPage'

export default function MyFilesPage() {
  return <Files mode="my-files" />
}
