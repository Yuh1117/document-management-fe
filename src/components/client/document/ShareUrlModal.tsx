import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import api, { endpoints } from '@/config/api'
import type { IDocument } from '@/types/type'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'

type Props = {
  doc: IDocument | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const ShareUrlModal = ({ open, onOpenChange, doc }: Props) => {
  const { t } = useTranslation()
  const form = useForm<{ id: number; expiredTime: number }>()
  const [signedUrl, setSignedUrl] = useState<string | null>(null)
  const [sharing, setSharing] = useState<boolean>(false)

  const onSubmit = async (data: { id: number; expiredTime: number }) => {
    try {
      setSharing(true)

      const req: { documentId: number; expiredTime: number } = {
        documentId: data.id,
        expiredTime: data.expiredTime,
      }

      const res: any = await api.post(endpoints['share-url'], req)
      setSignedUrl(res.data.data)

      toast.success(t('share_url.create_success'), {
        duration: 2000,
      })
    } catch (error) {
      console.error('Lỗi khi chia sẻ', error)
      toast.error(t('share_url.create_failed'), {
        duration: 2000,
      })
    } finally {
      setSharing(false)
    }
  }

  useEffect(() => {
    if (open) {
      setSignedUrl(null)
      if (doc) {
        form.setValue('id', doc.id)
        form.setValue('expiredTime', 3)
      } else {
        form.reset()
      }
      form.clearErrors()
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>
            {signedUrl ? t('share_url.title_view') : t('share_url.title_create')} &quot;{doc?.name}
            &quot;
          </DialogTitle>
        </DialogHeader>
        {signedUrl ? (
          <div className="flex items-center gap-2">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="link" className="sr-only">
                Link
              </Label>
              <Input id="link" defaultValue={signedUrl} readOnly />
            </div>
          </div>
        ) : (
          <Form {...form}>
            <form className="p-1" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6">
                <FormField
                  control={form.control}
                  name="expiredTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('share_url.expiry_label')}</FormLabel>
                      <Select
                        value={field.value.toString()}
                        onValueChange={(e: string) => {
                          form.setValue('expiredTime', parseInt(e))
                        }}
                      >
                        <FormControl>
                          <SelectTrigger className={`w-full`}>
                            <SelectValue placeholder={t('share_url.expiry_select')}>
                              {t('share_url.expiry_minutes', { count: field.value })}
                            </SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>{t('share_url.expiry_group_label')}</SelectLabel>
                            <SelectItem value="3">
                              {t('share_url.expiry_minutes', { count: 3 })}
                            </SelectItem>
                            <SelectItem value="5">
                              {t('share_url.expiry_minutes', { count: 5 })}
                            </SelectItem>
                            <SelectItem value="10">
                              {t('share_url.expiry_minutes', { count: 10 })}
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        )}
        <DialogFooter>
          {signedUrl ? (
            <Button variant="outline" onClick={() => navigator.clipboard.writeText(signedUrl)}>
              {t('share_url.copy')}
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                {t('common.cancel')}
              </Button>
              <Button onClick={() => form.handleSubmit(onSubmit)()} disabled={sharing}>
                {sharing ? <Spinner size={16} /> : t('share_url.create')}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ShareUrlModal
