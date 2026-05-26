import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import type { IPermission, IRole } from '@/types/type'
import { useForm } from 'react-hook-form'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useEffect, useState, type ChangeEvent } from 'react'
import api, { endpoints } from '@/config/api'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircleIcon } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { formatTime, groupedPermissions } from '@/config/utils'
import RolePermissionSelector from './PermissionSelector'
import { useTranslation } from 'react-i18next'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  isEditing: boolean
  data: IRole | null | undefined
  loadRoles: () => void
}

const RoleModal = ({ open, onOpenChange, isEditing, data, loadRoles }: Props) => {
  const form = useForm<IRole>()
  const [loading, setLoading] = useState<boolean>(false)
  const [msg, setMsg] = useState<string>('')
  const [listPermissions, setListPermissions] = useState<
    { module: string; permissions: IPermission[] }[]
  >([])
  const { t } = useTranslation()

  const fieldNames: { [key: string]: string } = {
    name: t('common.name'),
    description: t('common.description'),
  }

  const setError = (field: keyof IRole, message: string): void => {
    form.setError(field, { type: 'manual', message: message })
  }

  const validateEmpty = (field: keyof IRole, value: string): boolean => {
    form.clearErrors(field)
    if (!value) {
      setError(field, t('validation.required', { field: fieldNames[field] }))
      return false
    }
    return true
  }

  const validate = (data: IRole): boolean => {
    let flag = true
    if (!validateEmpty('name', data.name)) {
      flag = false
    }

    return flag
  }

  const onSubmit = async (data: IRole) => {
    form.clearErrors()
    setMsg('')

    if (validate(data) === true) {
      try {
        setLoading(true)

        if (isEditing) {
          await api.patch(endpoints['roles-detail'](data.id), data)
          onOpenChange(false)
          loadRoles()
        } else {
          await api.post(endpoints['roles'], data)
          onOpenChange(false)
          loadRoles()
        }
      } catch (error: any) {
        if (error.response?.status === 400 && Array.isArray(error.response.data.error)) {
          const errors = error.response.data.error
          errors.forEach((err: any) => {
            setError(err.field, err.message)
          })
        } else {
          setMsg(t('validation.system_error'))
        }
      } finally {
        setLoading(false)
      }
    }
  }

  const loadPermissions = async () => {
    try {
      setLoading(true)

      const res = await api.get(`${endpoints['permissions']}?all=true`)
      setListPermissions(Object.values(groupedPermissions(res.data.data.result)))
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (open) {
      if (data) {
        form.reset(data)
      } else {
        form.reset()
      }
      form.clearErrors()
      setMsg('')
    }
  }, [open])

  useEffect(() => {
    loadPermissions()
  }, [])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full md:max-w-2xl" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? t('admin.role_title_edit') : t('admin.role_title_add')}
          </DialogTitle>
        </DialogHeader>
        {msg && (
          <Alert className="border-red-500" variant="destructive">
            <AlertCircleIcon />
            <AlertDescription>{msg}</AlertDescription>
          </Alert>
        )}
        <Form {...form}>
          <form className="p-1">
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('common.name')}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value || ''}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            form.setValue('name', e.target.value)
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('common.description')}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value || ''}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            form.setValue('description', e.target.value)
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="permissions"
                render={({ field }) => (
                  <RolePermissionSelector
                    value={field.value || []}
                    onChange={(selectedPermissions) => {
                      form.setValue('permissions', selectedPermissions)
                    }}
                    listPermissions={listPermissions}
                  />
                )}
              />

              {isEditing && (
                <>
                  <div className="flex items-center">
                    <Label className="me-2">{t('common.created_at')}</Label>
                    <Badge variant="secondary">{formatTime(data?.createdAt)}</Badge>
                  </div>

                  <div className="flex items-center">
                    <Label className="me-2">{t('common.updated_at')}</Label>
                    <Badge variant="secondary">{formatTime(data?.updatedAt)}</Badge>
                  </div>
                </>
              )}
            </div>
          </form>
        </Form>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('common.cancel')}
          </Button>
          <Button
            onClick={() => form.handleSubmit(onSubmit)()}
            className={
              isEditing
                ? 'bg-yellow-500 dark:bg-yellow-500 hover:bg-yellow-500/90 dark:hover:bg-yellow-500/90'
                : 'bg-blue-500 dark:bg-blue-500 hover:bg-blue-500/90 dark:hover:bg-blue-500/90'
            }
            disabled={loading}
          >
            {loading ? <Spinner size={16} /> : t('common.save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default RoleModal
