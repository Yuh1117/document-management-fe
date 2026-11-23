'use client'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ChangeLanguage } from './ChangeLanguage'
import { ModeToggle } from './ThemeToggle'
import { Settings } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'

const Setting = () => {
  const { t } = useTranslation()
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            size="icon"
            className="shrink-0 rounded-xl"
            title={t('admin.settings')}
            aria-label={t('admin.settings')}
          />
        }
      >
        <Settings className="size-4" />
      </PopoverTrigger>
      <PopoverContent className="w-auto max-w-sm max-h-60 overflow-auto">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="leading-none font-medium">{t('admin.settings')}</h4>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-2">
              <Label>{t('language')}</Label>
              <ChangeLanguage />
            </div>
            <div className="grid grid-cols-2">
              <Label>{t('theme')}</Label>
              <ModeToggle />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default Setting
