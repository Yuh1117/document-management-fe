'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Folder as FolderIcon } from 'lucide-react'
import type { IFolder } from '@/types/type'
import api, { endpoints } from '@/lib/api'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import EllipsisDropDown from '../EllipsisDropdown'

import { useFilesStore } from '@/store/filesStore'
import { useFolderStore } from '@/store/folderStore'
import EllipsisDropDownDeleted from '../EllipsisDropdownDeleted'
import { Spinner } from '@/components/ui/spinner'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'

type Props = {
  data: IFolder
  permission: string
  isMultiSelectMode?: boolean
  selectedFolders?: string[]
  setSelectedFolders?: (data: string[]) => void
  withCardContent?: boolean
}

const Folder = ({
  data,
  permission,
  isMultiSelectMode,
  selectedFolders,
  setSelectedFolders,
  withCardContent = false,
}: Props) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false)
  const nav = useRouter()
  const [, setDownloading] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const { openShareModal, setPermission, openTransferModal, triggerReload } = useFilesStore()
  const { openFolderDetail, openFolderModal } = useFolderStore()
  const { t } = useTranslation()

  const handleDropdownToggle = (open: boolean) => {
    setIsDropdownOpen(open)
  }

  const handleToggleCheck = () => {
    if (isMultiSelectMode && selectedFolders && setSelectedFolders) {
      if (selectedFolders.includes(data.id)) {
        setSelectedFolders(selectedFolders.filter((id) => id !== data.id))
      } else {
        setSelectedFolders([...selectedFolders, data.id])
      }
    }
  }

  const handleViewDetail = () => {
    openFolderDetail(data)
  }

  const handleDownload = async () => {
    try {
      setDownloading(true)

      const res = await api.get(endpoints['download-single-folder'](data.id), {
        responseType: 'blob',
      })

      const url = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement('a')

      link.href = url
      link.setAttribute('download', `${data.name}.zip`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)

      toast.success(t('document.download_success'), {
        duration: 2000,
      })
    } catch (error) {
      console.error('Download failed:', error)
      toast.error(t('document.download_failed'), {
        duration: 2000,
      })
    } finally {
      setDownloading(false)
    }
  }

  const handleOpenEdit = () => {
    openFolderModal(data, true)
  }

  const handleSoftDelete = async () => {
    try {
      setLoading(true)

      const req: string[] = [data.id]
      await api.patch(endpoints['folders'], req)

      triggerReload()
      toast.success(t('common.trash_success'), {
        duration: 2000,
      })
    } catch (error) {
      console.error('Soft delete failed:', error)
      toast.error(t('common.trash_failed'), {
        duration: 2000,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRestore = async () => {
    try {
      setLoading(true)

      const req: string[] = [data.id]
      await api.patch(endpoints['folder-restore'], req)

      triggerReload()
      toast.success(t('common.restore_success'), {
        duration: 2000,
      })
    } catch (error) {
      console.error('Restore failed:', error)
      toast.error(t('common.restore_failed'), {
        duration: 2000,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleHardDelete = async () => {
    try {
      setLoading(true)

      const req: string[] = [data.id]
      await api.delete(endpoints['folder-delete-permanent'], {
        data: req,
      })

      triggerReload()
      toast.success(t('common.delete_success'), {
        duration: 2000,
      })
    } catch (error) {
      console.error('Hard delete failed:', error)
      toast.error(t('common.delete_failed'), {
        duration: 2000,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleOpenShare = () => {
    openShareModal(data)
    setPermission(permission)
  }

  const handleOpenTransfer = (mode: 'copy' | 'move') => {
    openTransferModal(data, mode)
  }

  return (
    <Card
      onDoubleClick={() => {
        if (!isMultiSelectMode) nav.push(`/folders/${data.id}`)
      }}
      onClick={handleToggleCheck}
      className={cn(
        'bg-background hover:bg-input/50 py-4 rounded-2xl border-1 transition-all duration-200',
        isDropdownOpen && 'bg-input/50'
      )}
    >
      <CardHeader className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FolderIcon size={20} />
          <Label className="truncate max-w-[110px]">{data.name}</Label>
        </div>
        <div>
          {loading ? (
            <Spinner />
          ) : data.deleted ? (
            <EllipsisDropDownDeleted
              handleDropdownToggle={handleDropdownToggle}
              handleRestore={handleRestore}
              handleHardDelete={handleHardDelete}
            />
          ) : isMultiSelectMode && selectedFolders && setSelectedFolders ? (
            <Checkbox
              className="border-2 border-black dark:border-white"
              checked={selectedFolders.includes(data.id)}
              onCheckedChange={handleToggleCheck}
            />
          ) : (
            <EllipsisDropDown
              type={'folder'}
              permission={permission}
              handleDropdownToggle={handleDropdownToggle}
              handleDownload={handleDownload}
              handleViewDetail={handleViewDetail}
              handleOpenEdit={handleOpenEdit}
              handleSoftDelete={handleSoftDelete}
              handleOpenTransfer={handleOpenTransfer}
              handleOpenShare={handleOpenShare}
            />
          )}
        </div>
      </CardHeader>
      {withCardContent && (
        <CardContent>
          <div className="flex justify-center items-center h-[150px] bg-muted rounded-xl">
            <FolderIcon size={50} />
          </div>
        </CardContent>
      )}
    </Card>
  )
}

export default Folder
