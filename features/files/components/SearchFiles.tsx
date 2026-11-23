'use client'

import { useMemo } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { endpoints } from '@/lib/api'
import FileBrowser from '@/features/files/components/FileBrowser'

const ADVANCED_KEYS = ['kw', 'kwType', 'type', 'size', 'sizeType'] as const

const SearchFilesPage = () => {
  const { t } = useTranslation()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isAdvanced = pathname.includes('/advanced-search')

  // Advanced search owns `type`/`size` itself and results are ranked by relevance,
  // so it only gets the view toggle; basic search gets the full toolbar.
  const baseQuery = useMemo(() => {
    const keys = isAdvanced ? ADVANCED_KEYS : (['kw'] as const)
    return Object.fromEntries(keys.map((k) => [k, searchParams.get(k) || '']))
  }, [isAdvanced, searchParams])

  return (
    <FileBrowser
      endpoint={isAdvanced ? endpoints['advanced-search'] : endpoints['search-files']}
      title={<h1 className="text-2xl font-semibold">{t('pages.search')}</h1>}
      toolbar={isAdvanced ? 'view-only' : 'full'}
      baseQuery={baseQuery}
      showSnippet={isAdvanced}
      documentGridClassName={
        isAdvanced
          ? 'grid grid-cols-[repeat(auto-fill,_minmax(560px,_1fr))] gap-4 px-2 py-4 max-[700px]:grid-cols-1'
          : undefined
      }
      resetAfterDownload
    />
  )
}

export default SearchFilesPage
