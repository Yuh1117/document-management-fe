import type { Metadata } from 'next'
import RoleAdminPage from '@/features/admin/components/RolePage'
import { serverFetch } from '@/lib/serverApi'
import type { IRole } from '@/types/type'

export const metadata: Metadata = {
  title: 'Vai trò | Admin',
}

interface PagedResult<T> {
  result: T[]
  totalPages: number
}

export default async function AdminRolesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; kw?: string }>
}) {
  const params = await searchParams
  const page = params.page || '1'
  const kw = params.kw || ''

  const query = new URLSearchParams({ page })
  if (kw) query.set('kw', kw)

  const data = await serverFetch<PagedResult<IRole>>(`/api/admin/roles?${query}`)

  return (
    <RoleAdminPage
      initialRoles={data?.result ?? []}
      initialTotalPages={data?.totalPages ?? 1}
    />
  )
}
