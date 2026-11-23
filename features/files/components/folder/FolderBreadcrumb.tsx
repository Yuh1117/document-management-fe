'use client'

import { Fragment, useEffect, useState } from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import api, { endpoints } from '@/lib/api'
import { useRouter } from 'next/navigation'

type PathItem = { id: string; name: string }
type FolderPath = { root: 'my-files' | 'shared'; items: PathItem[] }

/** Number of trailing folders always shown; anything before them collapses into "…". */
const VISIBLE_TAIL = 2

const FolderBreadcrumb = ({ folderId, reloadFlag }: { folderId: string; reloadFlag?: unknown }) => {
  const { t } = useTranslation()
  const nav = useRouter()
  const [path, setPath] = useState<FolderPath | null>(null)

  useEffect(() => {
    let cancelled = false
    api
      .get(endpoints['folder-path'](folderId))
      .then((res) => {
        if (!cancelled) setPath(res.data.data)
      })
      .catch((err) => console.error(err))
    return () => {
      cancelled = true
    }
  }, [folderId, reloadFlag])

  if (!path) {
    return <h1 className="text-2xl font-semibold">{t('pages.folder_files')}</h1>
  }

  const rootHref = path.root === 'my-files' ? '/my-files' : '/shared'
  const rootLabel = path.root === 'my-files' ? t('pages.my_files') : t('pages.shared_files')
  const current = path.items[path.items.length - 1]
  const ancestors = path.items.slice(0, -1)
  const hidden = ancestors.length > VISIBLE_TAIL ? ancestors.slice(0, -VISIBLE_TAIL) : []
  const shown = ancestors.slice(hidden.length)

  return (
    <Breadcrumb className="min-w-0">
      <BreadcrumbList className="text-base flex-nowrap">
        <BreadcrumbItem>
          <BreadcrumbLink render={<Link href={rootHref} />}>{rootLabel}</BreadcrumbLink>
        </BreadcrumbItem>

        {hidden.length > 0 && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center">
                  <BreadcrumbEllipsis />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {hidden.map((f) => (
                    <DropdownMenuItem key={f.id} onClick={() => nav.push(`/folders/${f.id}`)}>
                      {f.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItem>
          </>
        )}

        {shown.map((f) => (
          <Fragment key={f.id}>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                className="max-w-[160px] truncate"
                title={f.name}
                render={<Link href={`/folders/${f.id}`} />}
              >
                {f.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Fragment>
        ))}

        {current && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage
                className="max-w-[240px] truncate text-xl font-semibold"
                title={current.name}
              >
                {current.name}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export default FolderBreadcrumb
