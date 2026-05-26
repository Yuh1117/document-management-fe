import { Card } from '@/components/ui/card'
import CountUp from 'react-countup'
import { useTranslation } from 'react-i18next'

const DashBoard = () => {
  const { t } = useTranslation()
  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <span>{t('pages.home')}</span>
        </div>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
        <Card className="p-4">
          <h3 className="text-lg font-semibold">{t('admin.users')}</h3>
          <div className="text-xl font-semibold text-blue-500">
            <CountUp end={100} separator="." />
          </div>
        </Card>
      </div>
    </>
  )
}

export default DashBoard
