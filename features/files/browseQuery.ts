export type ViewMode = 'grid' | 'list'
export type SortBy = 'name' | 'updatedAt' | 'size'
export type SortDir = 'asc' | 'desc'

export type BrowseQuery = {
  type: string
  modified: string
  sortBy: SortBy
  sortDir: SortDir
}

export const DEFAULT_BROWSE_QUERY: BrowseQuery = {
  type: '',
  modified: '',
  sortBy: 'name',
  sortDir: 'asc',
}

export const TYPE_OPTIONS = ['folder', 'pdf', 'word', 'image'] as const
export const MODIFIED_OPTIONS = ['today', '7d', '30d', '365d'] as const
export const SORT_OPTIONS: SortBy[] = ['name', 'updatedAt', 'size']

type ParamSource = URLSearchParams | Record<string, string | string[] | undefined>

const read = (src: ParamSource, key: string) => {
  const v = src instanceof URLSearchParams ? src.get(key) : src[key]
  return (Array.isArray(v) ? v[0] : v) ?? ''
}

/** Reads the browse query from URL params, dropping anything unknown so bad links fall back to defaults. */
export function parseBrowseQuery(src: ParamSource): BrowseQuery {
  const type = read(src, 'type')
  const modified = read(src, 'modified')
  const sortBy = read(src, 'sortBy') as SortBy
  return {
    type: (TYPE_OPTIONS as readonly string[]).includes(type) ? type : '',
    modified: (MODIFIED_OPTIONS as readonly string[]).includes(modified) ? modified : '',
    sortBy: SORT_OPTIONS.includes(sortBy) ? sortBy : DEFAULT_BROWSE_QUERY.sortBy,
    sortDir: read(src, 'sortDir') === 'desc' ? 'desc' : 'asc',
  }
}

/** Only non-default values, so the plain URL (/my-files) stays clean. */
export function browseQueryToParams(query: BrowseQuery): URLSearchParams {
  const params = new URLSearchParams()
  if (query.type) params.set('type', query.type)
  if (query.modified) params.set('modified', query.modified)
  if (query.sortBy !== DEFAULT_BROWSE_QUERY.sortBy) params.set('sortBy', query.sortBy)
  if (query.sortDir !== DEFAULT_BROWSE_QUERY.sortDir) params.set('sortDir', query.sortDir)
  return params
}

/** Query string for the first-page server fetch, matching what the client loader will request. */
export function browseQueryString(src: ParamSource): string {
  const params = browseQueryToParams(parseBrowseQuery(src))
  params.set('page', '1')
  return params.toString()
}
