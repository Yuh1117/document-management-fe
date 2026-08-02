'use client'

import api, { endpoints } from '@/lib/api'
import { useState } from 'react'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'

export function useDownloadFiles() {
  const { t } = useTranslation()
  const [downloading, setDownloading] = useState(false)

  const download = async (docs: string[], folders: string[]) => {
    if (docs.length === 0 && folders.length === 0) return
    try {
      setDownloading(true)

      let res
      let filename = 'files.zip'

      if (docs.length > 0 && folders.length === 0) {
        res = await api.post(endpoints['download-multiple-documents'], docs, {
          responseType: 'blob',
        })
        filename = 'documents.zip'
      } else if (docs.length === 0 && folders.length > 0) {
        res = await api.post(endpoints['download-multiple-folders'], folders, {
          responseType: 'blob',
        })
        filename = 'folders.zip'
      } else {
        res = await api.post(
          endpoints['download-multiple-files'],
          {
            folderIds: folders,
            documentIds: docs,
          },
          {
            responseType: 'blob',
          }
        )
        filename = 'folders-documents.zip'
      }

      const blob = new Blob([res.data], { type: 'application/zip' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', filename)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)

      toast.success(t('document.download_success'), { duration: 2000 })
    } catch (err) {
      console.error('Download error', err)
      toast.error(t('document.download_failed'), { duration: 2000 })
    } finally {
      setDownloading(false)
    }
  }

  return { downloading, download }
}
