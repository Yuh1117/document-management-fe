'use client'

import { type FormEvent, useEffect, useRef, useState } from 'react'
import { Camera } from 'lucide-react'
import { toast, Toaster } from 'sonner'
import { useTranslation } from 'react-i18next'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Spinner } from '@/components/ui/spinner'
import api, { endpoints } from '@/lib/api'
import { formatTime } from '@/lib/format'
import { useAuthStore } from '@/store/authStore'
import type { IAccount } from '@/types/type'

const MAX_AVATAR_BYTES = 5 * 1024 * 1024
const MIN_PASSWORD_LENGTH = 6

type FieldErrors = Record<string, string>

/** Backend errors come either as a message string or as a list of { field, message }. */
function readApiError(err: unknown): { message?: string; fields: FieldErrors } {
  const data = (err as { response?: { data?: { error?: unknown } } })?.response?.data?.error
  if (Array.isArray(data)) {
    const fields: FieldErrors = {}
    for (const e of data as { field: string; message: string }[]) fields[e.field] = e.message
    return { fields }
  }
  return { message: typeof data === 'string' ? data : undefined, fields: {} }
}

const ProfileSection = ({ user }: { user: IAccount }) => {
  const { t } = useTranslation()
  const [firstName, setFirstName] = useState(user.firstName)
  const [lastName, setLastName] = useState(user.lastName)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [saving, setSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!file) return setPreview(null)
    const url = URL.createObjectURL(file)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  const dirty = !!file || firstName.trim() !== user.firstName || lastName.trim() !== user.lastName

  const pickFile = (picked: File | undefined) => {
    if (!picked) return
    if (!picked.type.startsWith('image/')) {
      toast.error(t('account.avatar_invalid_type'))
      return
    }
    if (picked.size > MAX_AVATAR_BYTES) {
      toast.error(t('account.avatar_too_large'))
      return
    }
    setFile(picked)
  }

  const reset = () => {
    setFirstName(user.firstName)
    setLastName(user.lastName)
    setFile(null)
    setErrors({})
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const next: FieldErrors = {}
    if (!firstName.trim()) next.firstName = t('account.required')
    if (!lastName.trim()) next.lastName = t('account.required')
    setErrors(next)
    if (Object.keys(next).length) return

    const form = new FormData()
    form.append('firstName', firstName.trim())
    form.append('lastName', lastName.trim())
    if (file) form.append('file', file)

    try {
      setSaving(true)
      const res = await api.patch(endpoints.profile, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      const updated = res.data.data as IAccount
      useAuthStore.setState({ user: { ...user, ...updated } })
      setFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
      toast.success(t('account.profile_saved'))
    } catch (err) {
      const { message, fields } = readApiError(err)
      setErrors(fields)
      toast.error(message ?? t('account.profile_save_failed'))
    } finally {
      setSaving(false)
    }
  }

  const initial = (user.firstName || user.email || '?').charAt(0).toUpperCase()

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('account.profile')}</CardTitle>
        <CardDescription>{t('account.profile_desc')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="flex flex-col gap-6 md:flex-row">
          <div className="flex flex-col items-center gap-3">
            <button
              type="button"
              className="group relative rounded-full"
              onClick={() => fileInputRef.current?.click()}
              title={t('account.change_avatar')}
            >
              <Avatar className="size-28">
                <AvatarImage src={preview ?? user.avatar} alt="avatar" />
                <AvatarFallback className="text-3xl">{initial}</AvatarFallback>
              </Avatar>
              <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100">
                <Camera size={24} />
              </span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => pickFile(e.target.files?.[0])}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              {t('account.change_avatar')}
            </Button>
            <p className="text-xs text-muted-foreground">{t('account.avatar_hint')}</p>
          </div>

          <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="lastName">{t('account.last_name')}</Label>
              <Input
                id="lastName"
                value={lastName}
                maxLength={100}
                aria-invalid={!!errors.lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              {errors.lastName && <p className="text-xs text-destructive">{errors.lastName}</p>}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="firstName">{t('account.first_name')}</Label>
              <Input
                id="firstName"
                value={firstName}
                maxLength={100}
                aria-invalid={!!errors.firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              {errors.firstName && <p className="text-xs text-destructive">{errors.firstName}</p>}
            </div>
            <div className="flex flex-col gap-2 sm:col-span-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={user.email} disabled />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm text-muted-foreground">{t('account.role')}</span>
              <span className="text-sm font-medium">{user.role?.name}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm text-muted-foreground">{t('account.joined')}</span>
              <span className="text-sm font-medium">{formatTime(user.createdAt) || '—'}</span>
            </div>

            <div className="flex justify-end gap-2 sm:col-span-2">
              <Button type="button" variant="outline" onClick={reset} disabled={!dirty || saving}>
                {t('common.cancel')}
              </Button>
              <Button type="submit" disabled={!dirty || saving}>
                {saving ? <Spinner /> : t('common.save')}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

const PasswordSection = () => {
  const { t } = useTranslation()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<FieldErrors>({})
  const [saving, setSaving] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const next: FieldErrors = {}
    if (!currentPassword) next.currentPassword = t('account.required')
    if (newPassword.length < MIN_PASSWORD_LENGTH)
      next.newPassword = t('account.password_min', { min: MIN_PASSWORD_LENGTH })
    if (confirmPassword !== newPassword) next.confirmPassword = t('account.password_mismatch')
    setErrors(next)
    if (Object.keys(next).length) return

    try {
      setSaving(true)
      await api.patch(endpoints['profile-password'], { currentPassword, newPassword })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      toast.success(t('account.password_changed'))
    } catch (err) {
      const { message, fields } = readApiError(err)
      setErrors(fields)
      toast.error(message ?? t('account.password_change_failed'))
    } finally {
      setSaving(false)
    }
  }

  const field = (
    id: 'currentPassword' | 'newPassword' | 'confirmPassword',
    label: string,
    value: string,
    onChange: (v: string) => void,
    autoComplete: string
  ) => (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="password"
        autoComplete={autoComplete}
        value={value}
        aria-invalid={!!errors[id]}
        onChange={(e) => onChange(e.target.value)}
      />
      {errors[id] && <p className="text-xs text-destructive">{errors[id]}</p>}
    </div>
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('account.password')}</CardTitle>
        <CardDescription>{t('account.password_desc')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="grid max-w-md grid-cols-1 gap-4">
          {field(
            'currentPassword',
            t('account.current_password'),
            currentPassword,
            setCurrentPassword,
            'current-password'
          )}
          {field(
            'newPassword',
            t('account.new_password'),
            newPassword,
            setNewPassword,
            'new-password'
          )}
          {field(
            'confirmPassword',
            t('account.confirm_password'),
            confirmPassword,
            setConfirmPassword,
            'new-password'
          )}
          <div>
            <Button type="submit" disabled={saving}>
              {saving ? <Spinner /> : t('account.change_password')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

const AccountPage = () => {
  const { t } = useTranslation()
  const user = useAuthStore((s) => s.user)

  return (
    <div className="bg-muted dark:bg-muted flex flex-col rounded-xl p-2">
      <Toaster richColors position="top-center" />
      <div className="bg-muted/60 backdrop-blur flex items-center gap-4 rounded-xl p-4 border-b">
        <SidebarTrigger />
        <h1 className="text-2xl font-semibold">{t('nav.account')}</h1>
      </div>

      <ScrollArea className="h-[calc(100vh-160px)] p-2">
        {user ? (
          <div className="mx-auto flex max-w-4xl flex-col gap-4 py-2">
            <ProfileSection key={user.id} user={user} />
            <PasswordSection />
          </div>
        ) : (
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
        )}
      </ScrollArea>
    </div>
  )
}

export default AccountPage
