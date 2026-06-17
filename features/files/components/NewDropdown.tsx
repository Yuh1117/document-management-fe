'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { DropdownMenuGroup } from '@radix-ui/react-dropdown-menu'
import { FileUp, FolderPlus, FolderUp, Plus } from 'lucide-react'
import { useSidebar } from '@/components/ui/sidebar'
import { useParams } from 'next/navigation'

import { useFilesStore } from '@/store/filesStore'
import { useFolderStore } from '@/store/folderStore'
import api, { endpoints } from '@/lib/api'
import { toast } from 'sonner'
import { useState } from 'react'
import { Spinner } from '@/components/ui/spinner'
import { Separator } from '@/components/ui/separator'
import { useTranslation } from 'react-i18next'

const NewDropDown = () => {
  const { openUploadModeModal, triggerReload } = useFilesStore()
  const { openFolderModal } = useFolderStore()
  const { t } = useTranslation()
  const { state } = useSidebar()
  const { id } = useParams<{ id: string }>()

  const [isUploading, setIsUploading] = useState<boolean>(false)

  const handleUpload = async (files: FileList | null) => {
    if (!files?.length) return

    try {
      setIsUploading(true)

      const formData = new FormData()
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i])
      }

      if (id) {
        formData.append('folderId', id)
      }

      const res = await api.post(endpoints['upload-multiple-documents'], formData)

      const conflicts = res.data.data.conflicts
      if (conflicts?.length) {
        openUploadModeModal(Array.from(files).filter((f) => conflicts.includes(f.name)))
      } else {
        triggerReload()
        toast.success(t('upload.upload_success'), {
          duration: 2000,
        })
      }
    } catch (error: any) {
      console.error('Upload file failed: ', error)

      const errors = error.response.data.error
      let errorMsg: string = ''

      if (error.response?.status === 400) {
        if (Array.isArray(errors)) {
          errors.forEach((err: { field: string; message: string }) => {
            errorMsg += err.message + '\n'
          })
        } else {
          errorMsg = errors
        }
      } else {
        errorMsg = t('common.error_system')
      }

      toast.error(t('upload.upload_failed'), {
        duration: 3000,
        description: errorMsg,
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleUploadFolder = async (input: HTMLInputElement) => {
    if (!input.files?.length) return

    try {
      setIsUploading(true)

      const formData = new FormData()

      for (let i = 0; i < input.files.length; i++) {
        const file = input.files[i] as any
        formData.append('files', file)
        formData.append('relativePaths', file.webkitRelativePath || file.name)
      }

      if (id) {
        formData.append('parentId', id)
      }

      await api.post(endpoints['upload-folder'], formData)
      triggerReload()

      toast.success(t('upload.folder_upload_success'), {
        duration: 2000,
      })
    } catch (error: any) {
      console.error('Upload folder failed: ', error)

      const errors = error.response.data.error
      let errorMsg: string = ''

      if (error.response?.status === 400) {
        if (Array.isArray(errors)) {
          errors.forEach((err: { field: string; message: string }) => {
            errorMsg += err.message + '\n'
          })
        } else {
          errorMsg = errors
        }
      } else {
        errorMsg = t('common.error_system')
      }

      toast.error(t('upload.upload_failed'), {
        duration: 3000,
        description: errorMsg,
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleAddFolder = () => {
    openFolderModal(null, false)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className={`rounded-xl ${state !== 'collapsed' && 'w-30 h-13'}`}
          size="icon"
          disabled={isUploading}
        >
          {isUploading ? (
            <Spinner />
          ) : (
            <>
              <Plus strokeWidth={3} />
              {state === 'collapsed' ? '' : t('upload.new_button')}
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-50" align="start">
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => {
              const input = document.createElement('input')
              input.type = 'file'
              input.multiple = true
              input.onchange = (e: any) => handleUpload(e.target.files)
              input.click()
            }}
          >
            <FileUp className="text-black-900" />
            {t('upload.upload_files')}
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => {
              const input = document.createElement('input')
              input.type = 'file'
              input.webkitdirectory = true
              input.multiple = true
              input.onchange = () => handleUploadFolder(input)
              input.click()
            }}
          >
            <FolderUp className="text-black-900" />
            {t('upload.upload_folder')}
          </DropdownMenuItem>

          <Separator />

          <DropdownMenuItem onClick={handleAddFolder}>
            <FolderPlus className="text-black-900" />
            {t('upload.new_folder')}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { NewDropDown }
