'use client'

import { Spinner } from '@/components/ui/spinner'
import { useTranslation } from 'react-i18next'

const LoadingScreen = () => {
  const { t } = useTranslation()

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background z-50">
      <div className="flex flex-col items-center gap-4">
        <Spinner size={40} />
        <p className="text-muted-foreground text-sm">{t('loading')}</p>
      </div>
    </div>
  )
}

export default LoadingScreen
