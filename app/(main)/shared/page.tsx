import type { Metadata } from 'next'
import { getT } from '@/lib/getMetadata'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT()
  return { title: t.pages.shared_files }
}

import Files from '@/features/files/components/FilesPage'
import { serverFetch } from '@/lib/serverApi'
import { endpoints } from '@/lib/endpoints'
import type { IFileItem } from '@/types/type'

export default async function SharedPage() {
  const data = await serverFetch<{ result: IFileItem[] }>(`${endpoints['shared-files']}?page=1`)
  return <Files mode="shared" initialItems={data?.result ?? []} />
}
