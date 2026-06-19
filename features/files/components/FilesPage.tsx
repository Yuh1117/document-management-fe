'use client'

import { lazy, Suspense } from 'react'
import { Spinner } from '@/components/ui/spinner'
import { useTranslation } from 'react-i18next'

const MyFilesPage = lazy(() => import('./MyFiles'))
const FolderFilesPage = lazy(() => import('./FolderFiles'))
const TrashFilesPage = lazy(() => import('./TrashFiles'))
const SearchFilesPage = lazy(() => import('./SearchFiles'))
const SharedFilesPage = lazy(() => import('./SharedFiles'))
const RecentFilesPage = lazy(() => import('./RecentFiles'))

const Files = ({ mode }: { mode: string }) => {
  const { t } = useTranslation()

  let page: React.ReactNode
  switch (mode) {
    case 'my-files':
      page = <MyFilesPage />
      break
    case 'search':
      page = <SearchFilesPage />
      break
    case 'folder':
      page = <FolderFilesPage />
      break
    case 'shared':
      page = <SharedFilesPage />
      break
    case 'recent':
      page = <RecentFilesPage />
      break
    case 'trash':
      page = <TrashFilesPage />
      break
    default:
      return <div>{t('common.not_found')}</div>
  }

  return (
    <Suspense fallback={<div className="flex justify-center items-center h-full"><Spinner /></div>}>
      {page}
    </Suspense>
  )
}

export default Files
