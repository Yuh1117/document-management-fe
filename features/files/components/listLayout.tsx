import type { IUser } from '@/types/type'

/** Column template shared by the list header and rows: name | owner | modified | size | actions. */
export const LIST_COLUMNS =
  'grid grid-cols-[minmax(0,1fr)_100px_40px] md:grid-cols-[minmax(0,1fr)_180px_150px_100px_40px] items-center gap-3'

/** Flat table row (no card): bottom divider + subtle hover. */
export const LIST_ROW = 'border-b px-3 py-2 transition-colors hover:bg-input/40'

export const ownerName = (user?: IUser) => {
  if (!user) return ''
  const full = [user.lastName, user.firstName].filter(Boolean).join(' ').trim()
  return full || user.email
}
