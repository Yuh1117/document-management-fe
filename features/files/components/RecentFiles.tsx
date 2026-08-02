'use client'

import { useFilesStore } from '@/store/filesStore'
import { useDocumentStore } from '@/store/documentStore'
import { useFolderStore } from '@/store/folderStore'
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
import DocumentVersionModal from '@/features/files/components/document/DocumentVersionModal'
import DocumentPreviewModal from '@/features/files/components/document/DocumentPreviewModal'
import DocumentSummarizeModal from '@/features/files/components/document/DocumentSummarizeModal'
import UploadModeModal from '@/features/files/components/UploadModeModal'
import { useTranslation } from 'react-i18next'
import type { IFileItem } from '@/types/type'

const RecentFilesPage = ({ initialItems }: { initialItems?: IFileItem[] }) => {
  const { t } = useTranslation()
  const fileState = useFilesStore()
  const documentState = useDocumentStore()
  const folderState = useFolderStore()
  const { closeShareModal, closeTransferModal, closeUploadModeModal } = fileState
  const {
    closeDocumentDetail,
    closeDocumentModal,
    closePreviewModal,
    closeShareUrlModal,
    closeSummarizeModal,
    closeVersionModal,
  } = documentState
  const { closeFolderDetail, closeFolderModal } = folderState
  const { files, loading, hasMore, observerRef } = useFilesLoader(
    endpoints['recent-files'],
    fileState.reloadFlag,
    undefined,
    initialItems
  )
  const multi = useMultiSelect()
  const { downloading, download } = useDownloadFiles()

  return (
    <div className="bg-muted dark:bg-muted flex flex-col rounded-xl p-2 select-none">
      <Toaster richColors position="top-center" />

      <div className="bg-muted/60 backdrop-blur flex items-center justify-between rounded-xl p-4 border-b">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <h1 className="text-2xl font-semibold">{t('pages.recent_files')}</h1>
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
            {files.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg mb-2">{t('file.files')}</h2>
                <div className="grid grid-cols-[repeat(auto-fill,_minmax(220px,_1fr))] gap-4 px-2 py-4">
                  {files.map((f) =>
                    f.type === 'folder' ? (
                      <Folder
                        key={`folder-${f.folder.id}`}
                        data={f.folder}
                        permission={f.permission}
                        isMultiSelectMode={multi.isMultiSelectMode}
                        selectedFolders={multi.selectedFolders}
                        setSelectedFolders={multi.setSelectedFolders}
                        withCardContent={true}
                      />
                    ) : (
                      <Document
                        key={`doc-${f.document.id}`}
                        data={f.document}
                        permission={f.permission}
                        isMultiSelectMode={multi.isMultiSelectMode}
                        selectedDocs={multi.selectedDocs}
                        setSelectedDocs={multi.setSelectedDocs}
                      />
                    )
                  )}
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
        onOpenChange={(open) => !open && closeUploadModeModal()}
      />

      <FolderDetail
        data={folderState.folderDetail.data}
        isSheetOpen={folderState.folderDetail.open}
        setIsSheetOpen={(open) => !open && closeFolderDetail()}
      />
      <DocumentDetail
        data={documentState.documentDetail.data}
        isSheetOpen={documentState.documentDetail.open}
        setIsSheetOpen={(open) => !open && closeDocumentDetail()}
      />

      <DocumentPreviewModal
        data={documentState.previewModal.data}
        open={documentState.previewModal.open}
        onOpenChange={(open) => !open && closePreviewModal()}
      />

      <FolderModal
        open={folderState.folderModal.open}
        onOpenChange={(open) => !open && closeFolderModal()}
        isEditing={folderState.folderModal.isEditing}
        data={folderState.folderModal.data}
      />
      <DocumentModal
        open={documentState.documentModal.open}
        onOpenChange={(open) => !open && closeDocumentModal()}
        data={documentState.documentModal.data}
      />

      <ShareUrlModal
        doc={documentState.shareUrlModal.data}
        open={documentState.shareUrlModal.open}
        onOpenChange={(open) => !open && closeShareUrlModal()}
      />
      <ShareModal
        data={fileState.shareModal.data}
        open={fileState.shareModal.open}
        onOpenChange={(open) => !open && closeShareModal()}
      />

      <TransferModal
        data={fileState.transferModal.data}
        open={fileState.transferModal.open}
        onOpenChange={(open) => !open && closeTransferModal()}
        mode={fileState.transferModal.mode}
      />

      <DocumentVersionModal
        data={documentState.documentVersion.data}
        open={documentState.documentVersion.open}
        onOpenChange={(open) => !open && closeVersionModal()}
      />

      <DocumentSummarizeModal
        data={documentState.summarizeModal.data}
        open={documentState.summarizeModal.open}
        onOpenChange={(open) => !open && closeSummarizeModal()}
      />
    </div>
  )
}

export default RecentFilesPage
