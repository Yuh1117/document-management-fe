'use client'

import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Box, Clock, Trash, Users } from 'lucide-react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

const shortcuts = [
  { href: '/my-files', icon: Box, labelKey: 'nav.my_files', descKey: 'home.my_files_desc' },
  { href: '/recent', icon: Clock, labelKey: 'nav.recent', descKey: 'home.recent_desc' },
  { href: '/shared', icon: Users, labelKey: 'nav.shared', descKey: 'home.shared_desc' },
  { href: '/trash', icon: Trash, labelKey: 'nav.trash', descKey: 'home.trash_desc' },
]

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
          {shortcuts.map(({ href, icon: Icon, labelKey, descKey }, index) => (
            <Link
              key={href}
              href={href}
              className="animate-in fade-in-0 slide-in-from-bottom-2 fill-mode-backwards"
              style={{ animationDelay: `${index * 75}ms`, animationDuration: '400ms' }}
            >
              <Card className="bg-background hover:border-primary/40 group cursor-pointer rounded-xl border-1 p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
                <div className="flex items-start gap-3">
                  <span className="bg-muted text-muted-foreground group-hover:text-foreground flex size-11 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-110">
                    <Icon className="size-5" />
                  </span>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-md font-medium">{t(labelKey)}</span>
                    <span className="text-muted-foreground text-xs leading-snug">{t(descKey)}</span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

export default Home
