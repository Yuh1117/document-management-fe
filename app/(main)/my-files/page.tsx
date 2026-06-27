import type { Metadata } from 'next'
import { getT } from '@/lib/getMetadata'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT()
  return { title: t.pages.my_files }
}

import Files from '@/features/files/components/FilesPage'
import { serverFetch } from '@/lib/serverApi'
import { endpoints } from '@/lib/endpoints'
import type { IFileItem } from '@/types/type'

export default async function MyFilesPage() {
  const data = await serverFetch<{ result: IFileItem[] }>(`${endpoints['my-files']}?page=1`)
  return <Files mode="my-files" initialItems={data?.result ?? []} />
}
