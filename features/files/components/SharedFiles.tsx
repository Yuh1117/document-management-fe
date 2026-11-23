'use client'

import { useTranslation } from 'react-i18next'
import { endpoints } from '@/lib/api'
import FileBrowser from '@/features/files/components/FileBrowser'
import type { IFileItem } from '@/types/type'

const SharedFilesPage = ({ initialItems }: { initialItems?: IFileItem[] }) => {
  const { t } = useTranslation()
  return (
    <FileBrowser
      endpoint={endpoints['shared-files']}
      title={<h1 className="text-2xl font-semibold">{t('pages.shared_files')}</h1>}
      initialItems={initialItems}
      resetAfterDownload
    />
  )
}

export default SharedFilesPage
