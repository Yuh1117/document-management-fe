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
import { browseQueryString } from '@/features/files/browseQuery'

export default async function SharedPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const qs = browseQueryString(await searchParams)
  const data = await serverFetch<{ result: IFileItem[] }>(`${endpoints['shared-files']}?${qs}`)
  return <Files mode="shared" initialItems={data?.result ?? []} />
}
