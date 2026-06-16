'use client'

import { useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { endpoints } from '@/lib/api'
import { Spinner } from '@/components/ui/spinner'
import { Button } from '@/components/ui/button'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Download, ListChecks, X } from 'lucide-react'
import { Toaster } from 'sonner'
import Document from '@/features/files/components/document/Document'
import DocumentDetail from '@/features/files/components/document/DocumentDetail'
import DocumentModal from '@/features/files/components/document/DocumentModal'
import Folder from '@/features/files/components/folder/Folder'
import FolderDetail from '@/features/files/components/folder/FolderDetail'
import FolderModal from '@/features/files/components/folder/FolderModal'
import { useFilesLoader } from '@/features/files/hooks/useFilesLoader'
import { useMultiSelect } from '@/features/files/hooks/useMultiSelect'
import { useDownloadFiles } from '@/features/files/hooks/useDownloadFiles'
import ShareUrlModal from '@/features/files/components/document/ShareUrlModal'
import TransferModal from '@/features/files/components/TransferModal'
import ShareModal from '@/features/files/components/ShareModal'
import {
  closeDocumentDetail,
  closeDocumentModal,
  closePreviewModal,
  closeShareUrlModal,
  closeSummarizeModal,
  closeVersionModal,
} from '@/store/slices/documentSlice'
import {
  closeShareModal,
  closeTransferModal,
  closeUploadModeModal,
} from '@/store/slices/filesSlice'
import { closeFolderDetail, closeFolderModal } from '@/store/slices/folderSlice'
import { usePathname, useSearchParams } from 'next/navigation'
import DocumentVersionModal from '@/features/files/components/document/DocumentVersionModal'
import DocumentPreviewModal from '@/features/files/components/document/DocumentPreviewModal'
import DocumentSummarizeModal from '@/features/files/components/document/DocumentSummarizeModal'
import UploadModeModal from '@/features/files/components/UploadModeModal'
import { useTranslation } from 'react-i18next'

const SearchFilesPage = () => {
  const { t } = useTranslation()
  const pathname = usePathname()

  const isAdvanced = pathname.includes('/advanced-search')

  const queryParams = useSearchParams()
  const basicQuery = queryParams.get('kw') || ''
  const advancedQuery = {
    kw: queryParams.get('kw') || '',
    kwType: queryParams.get('kwType') || '',
    type: queryParams.get('type') || '',
    size: queryParams.get('size') || '',
    sizeType: queryParams.get('sizeType') || '',
  }

  const query = isAdvanced ? advancedQuery : basicQuery
  const endpoint = isAdvanced ? endpoints['advanced-search'] : endpoints['search-files']

  const fileState = useAppSelector((state) => state.files)
  const documentState = useAppSelector((state) => state.documents)
  const folderState = useAppSelector((state) => state.folders)
  const { files, loading, hasMore, observerRef } = useFilesLoader(
    endpoint,
    fileState.reloadFlag,
    query
  )
  const multi = useMultiSelect()
  const { downloading, download } = useDownloadFiles()
  const dispatch = useAppDispatch()

  const folders = useMemo(() => files.filter((f) => f.type === 'folder'), [files])
  const documents = useMemo(() => files.filter((f) => f.type === 'document'), [files])

  return (
    <div className="bg-muted dark:bg-muted flex flex-col rounded-xl p-2 select-none">
      <Toaster richColors position="top-center" />

      <div className="bg-muted/60 backdrop-blur flex items-center justify-between rounded-xl p-4 border-b">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <h1 className="text-2xl font-semibold">{t('pages.search')}</h1>
        </div>
        <div
          className="cursor-pointer p-2 rounded-xl hover:bg-input/50 dark:hover:bg-input/50"
          onClick={multi.toggleMode}
        >
          {multi.isMultiSelectMode ? <X size={20} /> : <ListChecks size={20} />}
        </div>
      </div>

      <ScrollArea className="p-2 h-[calc(100vh-160px)]">
        {files.length === 0 && !loading ? (
          <div className="flex justify-center items-center py-8 text-muted-foreground">
            {t('common.no_data')}
          </div>
        ) : (
          <>
            {folders.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg mb-2">{t('file.folders')}</h2>
                <div className="grid grid-cols-[repeat(auto-fill,_minmax(220px,_1fr))] gap-4 px-2 py-4">
                  {folders.map((f) => (
                    <Folder
                      key={`folder-${f.folder.id}`}
                      data={f.folder}
                      permission={f.permission}
                      isMultiSelectMode={multi.isMultiSelectMode}
                      selectedFolders={multi.selectedFolders}
                      setSelectedFolders={multi.setSelectedFolders}
                    />
                  ))}
                </div>
              </div>
            )}

            {documents.length > 0 && (
              <div>
                <h2 className="text-lg mb-2">{t('file.documents')}</h2>
                <div
                  className={
                    isAdvanced
                      ? 'grid grid-cols-[repeat(auto-fill,_minmax(560px,_1fr))] gap-4 px-2 py-4 max-[700px]:grid-cols-1'
                      : 'grid grid-cols-[repeat(auto-fill,_minmax(220px,_1fr))] gap-4 px-2 py-4'
                  }
                >
                  {documents.map((f) => (
                    <Document
                      key={`doc-${f.document.id}`}
                      data={f.document}
                      permission={f.permission}
                      isMultiSelectMode={multi.isMultiSelectMode}
                      selectedDocs={multi.selectedDocs}
                      setSelectedDocs={multi.setSelectedDocs}
                      showSnippet={isAdvanced}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {loading && (
          <div className="flex justify-center items-center py-8">
            <Spinner />
          </div>
        )}

        {hasMore && !loading && <div ref={observerRef} className="h-10" />}

        {!hasMore && files.length > 0 && (
          <p className="text-center text-muted-foreground py-4">{t('common.all_loaded')}</p>
        )}
      </ScrollArea>

      {multi.isMultiSelectMode && (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 flex justify-between items-center z-50 shadow-lg">
          <span className="text-sm text-muted-foreground">
            {t('multiselect.selected_summary', {
              folders: multi.selectedFolders.length,
              docs: multi.selectedDocs.length,
            })}
          </span>
          <div className="flex gap-2">
            <Button
              onClick={() => {
                download(multi.selectedDocs, multi.selectedFolders)
                multi.reset()
              }}
              disabled={
                (multi.selectedDocs.length === 0 && multi.selectedFolders.length === 0) ||
                downloading
              }
            >
              {downloading ? (
                <Spinner />
              ) : (
                <>
                  <Download className="text-black-900" />
                  {t('multiselect.download_zip')}
                </>
              )}
            </Button>
            <Button variant="outline" onClick={multi.reset} disabled={downloading}>
              {t('common.cancel')}
            </Button>
          </div>
        </div>
      )}

      <UploadModeModal
        files={fileState.uploadModeModal.files}
        open={fileState.uploadModeModal.open}
        onOpenChange={(open) => !open && dispatch(closeUploadModeModal())}
      />

      <FolderDetail
        data={folderState.folderDetail.data}
        isSheetOpen={folderState.folderDetail.open}
        setIsSheetOpen={(open) => !open && dispatch(closeFolderDetail())}
      />
      <DocumentDetail
        data={documentState.documentDetail.data}
        isSheetOpen={documentState.documentDetail.open}
        setIsSheetOpen={(open) => !open && dispatch(closeDocumentDetail())}
      />

      <DocumentPreviewModal
        data={documentState.previewModal.data}
        open={documentState.previewModal.open}
        onOpenChange={(open) => !open && dispatch(closePreviewModal())}
      />

      <FolderModal
        open={folderState.folderModal.open}
        onOpenChange={(open) => !open && dispatch(closeFolderModal())}
        isEditing={folderState.folderModal.isEditing}
        data={folderState.folderModal.data}
      />
      <DocumentModal
        open={documentState.documentModal.open}
        onOpenChange={(open) => !open && dispatch(closeDocumentModal())}
        data={documentState.documentModal.data}
      />

      <ShareUrlModal
        doc={documentState.shareUrlModal.data}
        open={documentState.shareUrlModal.open}
        onOpenChange={(open) => !open && dispatch(closeShareUrlModal())}
      />
      <ShareModal
        data={fileState.shareModal.data}
        open={fileState.shareModal.open}
        onOpenChange={(open) => !open && dispatch(closeShareModal())}
      />

      <TransferModal
        data={fileState.transferModal.data}
        open={fileState.transferModal.open}
        onOpenChange={(open) => !open && dispatch(closeTransferModal())}
        mode={fileState.transferModal.mode}
      />

      <DocumentVersionModal
        data={documentState.documentVersion.data}
        open={documentState.documentVersion.open}
        onOpenChange={(open) => !open && dispatch(closeVersionModal())}
      />

      <DocumentSummarizeModal
        data={documentState.summarizeModal.data}
        open={documentState.summarizeModal.open}
        onOpenChange={(open) => !open && dispatch(closeSummarizeModal())}
      />
    </div>
  )
}

export default SearchFilesPage
