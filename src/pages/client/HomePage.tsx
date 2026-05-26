import { Card, CardHeader } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Box, Clock, Trash, Users } from 'lucide-react'
import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'

const Home = () => {
  const { t } = useTranslation()

  return (
    <div className="bg-muted dark:bg-muted flex flex-col rounded-xl p-2 select-none">
      <div className="bg-muted/60 backdrop-blur flex items-center justify-between rounded-xl p-4 border-b">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <h1 className="text-2xl font-semibold">{t('pages.home')}</h1>
        </div>
      </div>

      <ScrollArea className="p-2 h-[calc(100vh-160px)]">
        <div className="grid grid-cols-1 md:grid-cols-4 sm:grid-cols-2 gap-4 p-4">
          <Link to={'/my-files'}>
            <Card className="bg-background hover:bg-input/50 rounded-xl border-1 transition-all duration-200">
              <CardHeader className="flex items-center">
                <Box className="me-2" />
                <Label className="text-md cursor-pointer">{t('nav.my_files')}</Label>
              </CardHeader>
            </Card>
          </Link>
          <Link to={'/recent'}>
            <Card className="bg-background hover:bg-input/50 rounded-xl border-1 transition-all duration-200">
              <CardHeader className="flex items-center">
                <Clock className="me-2" />
                <Label className="text-md cursor-pointer">{t('nav.recent')}</Label>
              </CardHeader>
            </Card>
          </Link>
          <Link to={'/shared'}>
            <Card className="bg-background hover:bg-input/50 rounded-xl border-1 transition-all duration-200">
              <CardHeader className="flex items-center">
                <Users className="me-2" />
                <Label className="text-md cursor-pointer">{t('nav.shared')}</Label>
              </CardHeader>
            </Card>
          </Link>
          <Link to={'/trash'}>
            <Card className="bg-background hover:bg-input/50 rounded-xl border-1 transition-all duration-200">
              <CardHeader className="flex items-center">
                <Trash className="me-2" />
                <Label className="text-md cursor-pointer">{t('nav.trash')}</Label>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </ScrollArea>
    </div>
  )
}

export default Home
