import type { Metadata } from 'next'
import PermissionAdminPage from '@/features/admin/components/PermissionPage'
import { serverFetch } from '@/lib/serverApi'
import type { IPermission } from '@/types/type'

export const metadata: Metadata = {
  title: 'Quyền hạn | Admin',
}

interface PagedResult<T> {
  result: T[]
  totalPages: number
}

export default async function AdminPermissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; kw?: string }>
}) {
  const params = await searchParams
  const page = params.page || '1'
  const kw = params.kw || ''

  const query = new URLSearchParams({ page })
  if (kw) query.set('kw', kw)

  const data = await serverFetch<PagedResult<IPermission>>(`/api/admin/permissions?${query}`)

  return (
    <PermissionAdminPage
      initialPermissions={data?.result ?? []}
      initialTotalPages={data?.totalPages ?? 1}
    />
  )
}
