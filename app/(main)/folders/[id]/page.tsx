import Files from '@/features/files/components/FilesPage'
import { serverFetch } from '@/lib/serverApi'
import { endpoints } from '@/lib/endpoints'
import type { IFileItem } from '@/types/type'
import { browseQueryString } from '@/features/files/browseQuery'

export default async function FolderPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const { id } = await params
  const qs = browseQueryString(await searchParams)
  const data = await serverFetch<{ result: IFileItem[] }>(`${endpoints['folder-files'](id)}?${qs}`)
  return <Files mode="folder" initialItems={data?.result ?? []} />
}
