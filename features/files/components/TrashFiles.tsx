'use client'

import { useMemo, useState } from 'react'
import { useFilesStore } from '@/store/filesStore'
import api, { endpoints } from '@/lib/api'
import { Spinner } from '@/components/ui/spinner'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { toast, Toaster } from 'sonner'
import Document from '@/features/files/components/document/Document'
import Folder from '@/features/files/components/folder/Folder'
import { useFilesLoader } from '@/features/files/hooks/useFilesLoader'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'
import type { IFileItem } from '@/types/type'

const TrashFilesPage = ({ initialItems }: { initialItems?: IFileItem[] }) => {
  const { t } = useTranslation()
  const { reloadFlag, triggerReload } = useFilesStore()
  const { files, loading, hasMore, observerRef } = useFilesLoader(
    endpoints['trash-files'],
    reloadFlag,
    undefined,
    initialItems
  )
  const [cleaning, setCleaning] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false)

  const handleCleanTrash = async () => {
    try {
      setCleaning(true)

      await api.delete(endpoints['files-delete-permanent'])

      setOpen(false)
      triggerReload()
      toast.success(t('trash.clean_success'), {
        duration: 2000,
      })
    } catch (error) {
      console.log(error)
      toast.error(t('trash.clean_failed'), {
        duration: 2000,
      })
    } finally {
      setCleaning(false)
    }
  }

  const folders = useMemo(() => files.filter((f) => f.type === 'folder'), [files])
  const documents = useMemo(() => files.filter((f) => f.type === 'document'), [files])

  return (
    <div className="bg-muted dark:bg-muted flex flex-col rounded-xl p-2 select-none">
      <Toaster richColors position="top-center" />

      <div className="bg-muted/60 backdrop-blur flex items-center justify-between rounded-xl p-4 border-b">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <h1 className="text-2xl font-semibold">{t('trash.title')}</h1>
        </div>
        {cleaning ? (
          <Spinner />
        ) : (
          <div
            className="cursor-pointer p-2 rounded-xl hover:bg-input/50 dark:hover:bg-input/50 text-red-500"
            onClick={() => {
              if (documents.length === 0 && folders.length === 0) return
              setOpen(true)
            }}
          >
            {t('trash.clean')}
          </div>
        )}
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
                    />
                  ))}
                </div>
              </div>
            )}

            {documents.length > 0 && (
              <div>
                <h2 className="text-lg mb-2">{t('file.documents')}</h2>
                <div className="grid grid-cols-[repeat(auto-fill,_minmax(220px,_1fr))] gap-4 px-2 py-4">
                  {documents.map((f) => (
                    <Document
                      key={`doc-${f.document.id}`}
                      data={f.document}
                      permission={f.permission}
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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>{t('trash.delete_permanent_title')}</DialogTitle>
            <DialogDescription>{t('trash.delete_permanent_desc')}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button variant="destructive" onClick={handleCleanTrash} disabled={cleaning}>
              {cleaning ? <Spinner size={16} /> : t('common.confirm')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default TrashFilesPage
