'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ShieldAlert } from 'lucide-react'
import { ChangeLanguage } from '@/features/shared/components/settings/ChangeLanguage'
import { ModeToggle } from '@/features/shared/components/settings/ThemeToggle'
import { useTranslation } from 'react-i18next'

const NotPermitted = () => {
  const { t } = useTranslation()
  return (
    <div className="bg-muted flex min-h-screen flex-col items-center justify-center p-6 md:p-10">
      <Card className="w-full md:max-w-sm ">
        <CardContent className="text-center">
          <div className="mb-4 flex justify-center">
            <ShieldAlert strokeWidth={1} size={128} />
          </div>
          <h2 className="text-xl font-semibold mb-3">{t('auth.no_permission')}</h2>
          <Link href="/">
            <Button variant="secondary" className="w-full">
              {t('auth.back_home')}
            </Button>
          </Link>
        </CardContent>
      </Card>

      <div className="flex p-3 gap-2">
        <ChangeLanguage />
        <ModeToggle />
      </div>
    </div>
  )
}

export default NotPermitted
