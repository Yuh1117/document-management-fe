'use client'

import DeleteModal from '@/features/admin/components/DeleteModal'
import UserModal from '@/features/admin/components/user/UserModal'
import Access from '@/features/admin/components/Access'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Spinner } from '@/components/ui/spinner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import api, { endpoints } from '@/lib/api'
import { ALL_PERMISSIONS } from '@/constants/permissions'
import type { IUser } from '@/types/type'
import { toast } from 'sonner'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { PencilLine, Plus, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSearchParams } from '@/hooks/useQueryParams'
import { useTranslation } from 'react-i18next'
import { usePermissionStore } from '@/store/permissionStore'

interface Props {
  initialUsers?: IUser[]
  initialTotalPages?: number
}

const UserAdminPage = ({ initialUsers = [], initialTotalPages = 1 }: Props) => {
  const { t } = useTranslation()
  const [users, setUsers] = useState<IUser[]>(initialUsers)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)
  const [q, setQ] = useSearchParams()
  const page = parseInt(q.get('page') || '1')
  const [kwInput, setKwInput] = useState<string>(q.get('kw') || '')
  const [totalPages, setTotalPages] = useState<number>(initialTotalPages)
  const [showModal, setShowModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [data, setData] = useState<IUser | null>()
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const { fetchPermissions } = usePermissionStore()

  const loadUsers = async () => {
    try {
      setLoading(true)
      setError(false)

      let url = `${endpoints['users']}?page=${page}`

      if (kwInput) {
        url = `${url}&kw=${kwInput}`
      }

      const res = await api.get(url)
      setUsers(res.data.data.result)
      setTotalPages(res.data.data.totalPages)
    } catch (err) {
      console.error(err)
      setError(true)
      toast.error(t('common.error_system'))
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    const params = new URLSearchParams(q)
    const trimmed: string = kwInput.trim()

    if (trimmed) {
      params.set('kw', trimmed)
    } else {
      params.delete('kw')
    }

    params.set('page', '1')
    setQ(params)
  }

  const changePage = (newPage: number) => {
    const params = new URLSearchParams(q)
    params.set('page', newPage.toString())
    setQ(params)
  }

  const handleOpenAdd = () => {
    setIsEditing(false)
    setShowModal(true)
    setData(null)
  }

  const handleOpenEdit = (users: IUser) => {
    setIsEditing(true)
    setShowModal(true)
    setData(users)
  }

  const handleDelete = (id: number) => {
    setDeletingId(id)
  }

  useEffect(() => {
    if (page > 0) {
      loadUsers()
    }
  }, [q])

  useEffect(() => {
    const permissionsToCheck = [
      ALL_PERMISSIONS.USERS.LIST,
      ALL_PERMISSIONS.USERS.CREATE,
      ALL_PERMISSIONS.USERS.UPDATE,
      ALL_PERMISSIONS.USERS.DELETE,
    ].map(({ apiPath, method }) => ({ apiPath, method }))

    fetchPermissions(permissionsToCheck)
  }, [])

  return (
    <div className="px-4">
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2">
          <span>{t('admin.users')}</span>
        </div>
      </header>
      <Access permission={ALL_PERMISSIONS.USERS.LIST}>
        <div className="mx-5">
          <div className="flex items-center gap-2 border rounded-xl p-5  shadow-xs">
            <Label>{t('common.name')}:</Label>
            <Input
              className="w-sm"
              type="text"
              placeholder={t('signup.first_name_placeholder')}
              id="name"
              value={kwInput}
              onChange={(e) => setKwInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button variant="secondary" onClick={handleSearch}>
              {t('nav.search')}
            </Button>
          </div>
          <div className="border rounded-xl mt-5 p-5 shadow-xs">
            <div className="flex justify-between items-center mb-3">
              <span className="font-medium">{t('admin.user_list')}</span>
              <Access permission={ALL_PERMISSIONS.USERS.CREATE} hideChildren>
                <Button
                  className="bg-blue-500 dark:bg-blue-500 hover:bg-blue-500/90 dark:hover:bg-blue-500/90"
                  onClick={handleOpenAdd}
                >
                  <Plus strokeWidth={3} /> {t('admin.add_new')}
                </Button>
              </Access>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Id</TableHead>
                  <TableHead>Avatar</TableHead>
                  <TableHead>{t('admin.full_name')}</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>{t('admin.roles')}</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <div className="flex justify-center items-center py-10">
                        <Spinner size={28} />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-sm text-destructive py-10"
                    >
                      {t('common.error_system')}
                    </TableCell>
                  </TableRow>
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-sm text-muted-foreground py-10"
                    >
                      {t('common.no_data')}
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium">{u.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={u.avatar as string} alt="avatar" />
                            <AvatarFallback className="rounded-lg">-</AvatarFallback>
                          </Avatar>
                        </div>
                      </TableCell>
                      <TableCell>{`${u.lastName} ${u.firstName}`}</TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>{u.role.name}</TableCell>
                      <TableCell className="gap-2 flex justify-end">
                        <Access permission={ALL_PERMISSIONS.USERS.UPDATE} hideChildren>
                          <PencilLine
                            className="text-yellow-500 hover:text-yellow-500/50 cursor-pointer me-1"
                            onClick={() => handleOpenEdit(u)}
                          />
                        </Access>
                        <Access permission={ALL_PERMISSIONS.USERS.DELETE} hideChildren>
                          <Trash2
                            className="text-red-500 hover:text-red-500/50 cursor-pointer"
                            onClick={() => handleDelete(u.id)}
                          />
                        </Access>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          {users.length !== 0 && (
            <Pagination className="mt-3">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious onClick={() => page > 1 && changePage(page - 1)} />
                </PaginationItem>

                {[...Array(totalPages)].map((_, idx) => (
                  <PaginationItem key={idx}>
                    <PaginationLink isActive={page === idx + 1} onClick={() => changePage(idx + 1)}>
                      {idx + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext onClick={() => page < totalPages && changePage(page + 1)} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>

        <UserModal
          open={showModal}
          onOpenChange={setShowModal}
          isEditing={isEditing}
          data={data}
          loadUsers={loadUsers}
        />

        <DeleteModal
          open={!!deletingId}
          deletingId={deletingId}
          onCancel={() => setDeletingId(null)}
          name={t('admin.users')}
          load={loadUsers}
          endpoint={endpoints['users-detail']}
        />
      </Access>
    </div>
  )
}

export default UserAdminPage