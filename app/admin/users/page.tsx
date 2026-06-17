import type { Metadata } from 'next'
import UserAdminPage from '@/features/admin/components/UserPage'
import { serverFetch } from '@/lib/serverApi'
import type { IUser } from '@/types/type'

export const metadata: Metadata = {
  title: 'Người dùng | Admin',
}

interface PagedResult<T> {
  result: T[]
  totalPages: number
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; kw?: string }>
}) {
  const params = await searchParams
  const page = params.page || '1'
  const kw = params.kw || ''

  const query = new URLSearchParams({ page })
  if (kw) query.set('kw', kw)

  const data = await serverFetch<PagedResult<IUser>>(`/api/admin/users?${query}`)

  return (
    <UserAdminPage
      initialUsers={data?.result ?? []}
      initialTotalPages={data?.totalPages ?? 1}
    />
  )
}
