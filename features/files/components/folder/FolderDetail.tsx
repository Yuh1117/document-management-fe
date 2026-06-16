'use client'

﻿import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Spinner } from '@/components/ui/spinner'
import api, { endpoints } from '@/lib/api'
import { formatTime } from '@/lib/format'
import { useAppSelector } from '@/store/hooks'
import type { IFolder } from '@/types/type'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

type Props = {
  data: IFolder | null
  isSheetOpen: boolean
  setIsSheetOpen: (open: boolean) => void
}

const FolderDetail = ({ isSheetOpen, setIsSheetOpen, data }: Props) => {
  const { t } = useTranslation()
  const userId = useAppSelector((state) => state.users.user?.id)
  const [loadingDetail, setLoadingDetail] = useState<boolean>(false)
  const [folderDetail, setFolderDetail] = useState<IFolder | null>(null)

  const loadViewDetail = async () => {
    if (!data) return
    try {
      setLoadingDetail?.(true)
      const res = await api.get(endpoints['folder-detail'](data.id))

      setFolderDetail?.(res.data.data)
      setIsSheetOpen?.(true)
    } catch (error) {
      console.error('Lỗi khi tải chi tiết thư mục', error)
    } finally {
      setLoadingDetail?.(false)
    }
  }

  useEffect(() => {
    if (isSheetOpen) {
      loadViewDetail()
    }
  }, [isSheetOpen])

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetContent className="rounded-l-xl" aria-describedby={undefined}>
        <SheetHeader>
          <SheetTitle className="text-lg mb-2">{t('folder.detail_title')}</SheetTitle>
          <div>
            {loadingDetail ? (
              <Spinner />
            ) : folderDetail ? (
              <div className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Label className="me-2 medium text-md">{t('common.name')}:</Label>
                    <span>{folderDetail.name}</span>
                  </div>
                  <div className="flex items-center">
                    <Label className="me-2 medium text-md">{t('common.type')}:</Label>
                    <span>{t('folder.type_label')}</span>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Label className="me-2 medium text-md">{t('common.created_by')}:</Label>
                    <Badge variant="secondary">
                      {folderDetail.createdBy?.id === userId
                        ? t('common.me')
                        : folderDetail.createdBy?.email}
                    </Badge>
                  </div>
                  <div className="flex items-center">
                    <Label className="me-2 medium text-md">{t('common.updated_by')}:</Label>
                    <Badge variant="secondary">
                      {folderDetail.updatedBy?.id === userId
                        ? t('common.me')
                        : folderDetail.updatedBy?.email}
                    </Badge>
                  </div>
                  <div className="flex items-center">
                    <Label className="me-2 medium text-md">{t('common.created_at')}:</Label>
                    <Badge variant="secondary">{formatTime(folderDetail?.createdAt)}</Badge>
                  </div>
                  <div className="flex items-center">
                    <Label className="me-2 medium text-md">{t('common.updated_at')}:</Label>
                    <Badge variant="secondary">{formatTime(folderDetail?.updatedAt)}</Badge>
                  </div>
                </div>
              </div>
            ) : (
              <p>{t('folder.not_found')}</p>
            )}
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
}

export default FolderDetail
