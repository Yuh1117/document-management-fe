import MyFilesPage from './MyFiles'
import FolderFilesPage from './FolderFiles'
import TrashFilesPage from './TrashFiles'
import SearchFilesPage from './SearchFiles'
import SharedFilesPage from './SharedFiles'
import RecentFilesPage from './RecentFiles'
import { useTranslation } from 'react-i18next'

const Files = ({ mode }: { mode: string }) => {
  const { t } = useTranslation()

  switch (mode) {
    case 'my-files':
      return <MyFilesPage />
    case 'search':
      return <SearchFilesPage />
    case 'folder':
      return <FolderFilesPage />
    case 'shared':
      return <SharedFilesPage />
    case 'recent':
      return <RecentFilesPage />
    case 'trash':
      return <TrashFilesPage />
    default:
      return <div>{t('common.not_found')}</div>
  }
}

export default Files
