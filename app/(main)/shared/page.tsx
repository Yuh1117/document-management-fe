import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Được chia sẻ',
}

import Files from '@/features/files/components/FilesPage'

export default function SharedPage() {
  return <Files mode="shared" />
}
