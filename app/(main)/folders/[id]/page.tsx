import Files from '@/features/files/components/FilesPage'
import { serverFetch } from '@/lib/serverApi'
import { endpoints } from '@/lib/endpoints'
import type { IFileItem } from '@/types/type'

export default async function FolderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const data = await serverFetch<{ result: IFileItem[] }>(`${endpoints['folder-files'](id)}?page=1`)
  return <Files mode="folder" initialItems={data?.result ?? []} />
}
