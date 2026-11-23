'use client'

import { ArrowDownNarrowWide, ArrowUpNarrowWide, LayoutGrid, List, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

import {
  MODIFIED_OPTIONS,
  SORT_OPTIONS,
  TYPE_OPTIONS,
  type BrowseQuery,
  type SortBy,
  type ViewMode,
} from '@/features/files/browseQuery'

export type { BrowseQuery, SortBy, ViewMode }

const ANY = 'any'

type Props = {
  query: BrowseQuery
  onQueryChange: (query: BrowseQuery) => void
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  /** Hide filters and sort, keep only the grid/list toggle. */
  viewOnly?: boolean
}

const FileToolbar = ({
  query,
  onQueryChange,
  viewMode,
  onViewModeChange,
  viewOnly = false,
}: Props) => {
  const { t } = useTranslation()
  const update = (patch: Partial<BrowseQuery>) => onQueryChange({ ...query, ...patch })
  const hasFilter = !!query.type || !!query.modified

  return (
    <div className="flex flex-wrap items-center gap-2 px-4 py-2">
      {!viewOnly && (
        <>
          <Select
            value={query.type || ANY}
            onValueChange={(v: string) => update({ type: v === ANY ? '' : v })}
          >
            <SelectTrigger
              size="sm"
              className={cn('min-w-[130px]', query.type && 'border-primary')}
            >
              <SelectValue>
                {query.type ? t(`browse.type_${query.type}`) : t('browse.type')}
              </SelectValue>
            </SelectTrigger>
            <SelectContent alignItemWithTrigger={false} align="start">
              <SelectItem value={ANY}>{t('browse.any_type')}</SelectItem>
              {TYPE_OPTIONS.map((o) => (
                <SelectItem key={o} value={o}>
                  {t(`browse.type_${o}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={query.modified || ANY}
            onValueChange={(v: string) => update({ modified: v === ANY ? '' : v })}
          >
            <SelectTrigger
              size="sm"
              className={cn('min-w-[150px]', query.modified && 'border-primary')}
            >
              <SelectValue>
                {query.modified ? t(`browse.modified_${query.modified}`) : t('browse.modified')}
              </SelectValue>
            </SelectTrigger>
            <SelectContent alignItemWithTrigger={false} align="start">
              <SelectItem value={ANY}>{t('browse.any_time')}</SelectItem>
              {MODIFIED_OPTIONS.map((o) => (
                <SelectItem key={o} value={o}>
                  {t(`browse.modified_${o}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {hasFilter && (
            <Button variant="ghost" size="sm" onClick={() => update({ type: '', modified: '' })}>
              <X />
              {t('browse.clear_filters')}
            </Button>
          )}
        </>
      )}
      <div className="ml-auto flex items-center gap-1">
        {!viewOnly && (
          <>
            <Select value={query.sortBy} onValueChange={(v: SortBy) => update({ sortBy: v })}>
              <SelectTrigger size="sm" className="min-w-[140px]">
                <SelectValue>{t(`browse.sort_${query.sortBy}`)}</SelectValue>
              </SelectTrigger>
              <SelectContent alignItemWithTrigger={false} align="start">
                {SORT_OPTIONS.map((o) => (
                  <SelectItem key={o} value={o}>
                    {t(`browse.sort_${o}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="ghost"
              size="icon-sm"
              title={t(query.sortDir === 'asc' ? 'browse.asc' : 'browse.desc')}
              onClick={() => update({ sortDir: query.sortDir === 'asc' ? 'desc' : 'asc' })}
            >
              {query.sortDir === 'asc' ? <ArrowUpNarrowWide /> : <ArrowDownNarrowWide />}
            </Button>
          </>
        )}
        <div className="ml-2 flex gap-0.5 rounded-xl border p-0.5">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            aria-pressed={viewMode === 'grid'}
            size="icon-sm"
            title={t('browse.grid_view')}
            onClick={() => onViewModeChange('grid')}
          >
            <LayoutGrid />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            aria-pressed={viewMode === 'list'}
            size="icon-sm"
            title={t('browse.list_view')}
            onClick={() => onViewModeChange('list')}
          >
            <List />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default FileToolbar
