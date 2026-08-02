import type { Metadata } from 'next'
import { getT } from '@/lib/getMetadata'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT()
  return { title: t.pages.advanced_search }
}

import Files from '@/features/files/components/FilesPage'

export default function AdvancedSearchPage() {
  return <Files mode="search" />
}
