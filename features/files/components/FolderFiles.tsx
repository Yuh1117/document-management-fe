'use client'

import { useParams } from 'next/navigation'
import { endpoints } from '@/lib/api'
import { useFilesStore } from '@/store/filesStore'
import FileBrowser from '@/features/files/components/FileBrowser'
import FolderBreadcrumb from '@/features/files/components/folder/FolderBreadcrumb'
import type { IFileItem } from '@/types/type'

const FolderFilesPage = ({ initialItems }: { initialItems?: IFileItem[] }) => {
  const { id } = useParams<{ id: string }>()
  const reloadFlag = useFilesStore((s) => s.reloadFlag)
  return (
    <FileBrowser
      endpoint={endpoints['folder-files'](id!)}
      title={<FolderBreadcrumb folderId={id!} reloadFlag={reloadFlag} />}
      initialItems={initialItems}
    />
  )
}

export default FolderFilesPage
