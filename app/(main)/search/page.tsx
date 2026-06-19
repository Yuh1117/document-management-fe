import type { Metadata } from 'next'
import { getT } from '@/lib/getMetadata'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT()
  return { title: t.pages.search }
}

import Files from '@/features/files/components/FilesPage'

export default function SearchPage() {
  return <Files mode="search" />
}
