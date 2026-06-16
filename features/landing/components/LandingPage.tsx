'use client'

import { Button } from '@/components/ui/button'
import { ChangeLanguage } from '@/components/shared/settings/ChangeLanguage'
import { ModeToggle } from '@/components/shared/settings/ThemeToggle'
import { getIconComponentByMimeType } from '@/lib/fileIcons'
import {
  ArrowRight,
  Box,
  Clock,
  Folder,
  FolderKanban,
  Home,
  MoreVertical,
  Plus,
  Search,
  Share2,
  Sparkles,
  Trash,
  Users,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'

const featureItems = [
  {
    titleKey: 'landing.features.document_management.title',
    descriptionKey: 'landing.features.document_management.description',
    icon: FolderKanban,
  },
  {
    titleKey: 'landing.features.search.title',
    descriptionKey: 'landing.features.search.description',
    icon: Search,
  },
  {
    titleKey: 'landing.features.sharing.title',
    descriptionKey: 'landing.features.sharing.description',
    icon: Share2,
  },
  {
    titleKey: 'landing.features.ai_summary.title',
    descriptionKey: 'landing.features.ai_summary.description',
    icon: Sparkles,
  },
]

const navigationItems = [
  { labelKey: 'nav.home', icon: Home, active: false },
  { labelKey: 'nav.my_files', icon: Box, active: true },
  { labelKey: 'nav.recent', icon: Clock, active: false },
  { labelKey: 'nav.shared', icon: Users, active: false },
  { labelKey: 'nav.trash', icon: Trash, active: false },
]

const folderItems = ['landing.mock.folders.project', 'landing.mock.folders.references']

const documentItems = [
  { nameKey: 'landing.mock.documents.outline', mimeType: 'application/pdf' },
  {
    nameKey: 'landing.mock.documents.report',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  },
  {
    nameKey: 'landing.mock.documents.plan',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  },
]

const getIconColorClassName = (color: string) => (color.startsWith('#') ? undefined : color)
const getIconColorStyle = (color: string) => (color.startsWith('#') ? { color } : undefined)

const LandingPage = () => {
  const { t } = useTranslation()

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b bg-background/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div>
              <p className="font-semibold leading-none">DMS</p>
              <p className="mt-1 text-xs text-muted-foreground">{t('landing.subtitle')}</p>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <ChangeLanguage />
            <ModeToggle />
            <Button variant="ghost" asChild>
              <Link href="/login">{t('login.label')}</Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="border-b">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[0.78fr_1.22fr] lg:px-8 lg:py-20">
          <div className="flex flex-col justify-center">
            <h1 className="max-w-3xl text-4xl font-semibold tracking-normal sm:text-5xl lg:text-6xl">
              DMS
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              {t('landing.description')}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/login">
                  {t('landing.cta.start')}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/signup">{t('landing.cta.signup')}</Link>
              </Button>
            </div>
          </div>

          <div className="flex items-center">
            <div className="w-full overflow-hidden rounded-xl border bg-card shadow-sm">
              <div className="grid min-h-[460px] md:grid-cols-[76px_1fr]">
                <aside className="hidden bg-background px-3 py-5 md:block">
                  <div className="mb-6 flex items-center justify-center">
                    <span className="text-sm font-semibold">DMS</span>
                  </div>

                  <Button
                    aria-label={t('upload.new_button')}
                    title={t('upload.new_button')}
                    className="mx-auto mb-5 flex size-10 justify-center rounded-2xl bg-stone-600 p-0 text-white hover:bg-stone-600/90 dark:text-black"
                  >
                    <Plus className="size-4" />
                  </Button>

                  <nav className="grid justify-items-center gap-2">
                    {navigationItems.map((item) => {
                      const Icon = item.icon

                      return (
                        <div
                          key={item.labelKey}
                          title={t(item.labelKey)}
                          className={`flex size-10 items-center justify-center rounded-2xl ${
                            item.active ? 'bg-muted font-semibold' : 'text-muted-foreground'
                          } transition-colors hover:bg-muted hover:text-foreground`}
                        >
                          <Icon className="size-4" />
                        </div>
                      )
                    })}
                  </nav>
                </aside>

                <div className="min-w-0 overflow-hidden bg-background">
                  <div className="bg-background px-5 py-4">
                    <div className="mx-auto flex h-8 max-w-sm items-center gap-2 rounded-lg border bg-background px-3 text-xs text-muted-foreground">
                      <Search className="size-4" />
                      {t('search.placeholder')}
                    </div>
                  </div>

                  <div className="rounded-tl-xl bg-muted px-7 py-6">
                    <div className="mb-5">
                      <h2 className="text-xl font-semibold">{t('pages.my_files')}</h2>
                    </div>

                    <section>
                      <h3 className="mb-3 text-sm font-semibold">{t('file.folders')}</h3>
                      <div className="grid gap-4 sm:grid-cols-[repeat(2,minmax(0,200px))]">
                        {folderItems.map((folderKey) => (
                          <div
                            key={folderKey}
                            className="flex h-12 items-center justify-between rounded-2xl border bg-background px-4 shadow-xs transition-colors hover:bg-input/50"
                          >
                            <div className="flex min-w-0 items-center gap-3">
                              <Folder className="size-4 shrink-0" />
                              <span className="truncate text-xs font-medium">{t(folderKey)}</span>
                            </div>
                            <MoreVertical className="size-3.5 shrink-0 text-muted-foreground" />
                          </div>
                        ))}
                      </div>
                    </section>

                    <section className="mt-6">
                      <h3 className="mb-3 text-sm font-semibold">{t('file.documents')}</h3>
                      <div className="grid gap-5 sm:grid-cols-3">
                        {documentItems.map((document) => {
                          const { icon: Icon, color } = getIconComponentByMimeType(
                            document.mimeType
                          )
                          const iconClassName = getIconColorClassName(color)
                          const iconStyle = getIconColorStyle(color)

                          return (
                            <div
                              key={document.nameKey}
                              className="rounded-2xl border bg-background p-4 shadow-xs transition-colors hover:bg-input/50"
                            >
                              <div className="mb-4 flex items-center justify-between">
                                <div className="flex min-w-0 items-center gap-2">
                                  <Icon
                                    className={`size-4 shrink-0 ${iconClassName ?? ''}`}
                                    style={iconStyle}
                                  />
                                  <span className="truncate text-xs font-medium">
                                    {t(document.nameKey)}
                                  </span>
                                </div>
                                <MoreVertical className="size-4 shrink-0 text-muted-foreground" />
                              </div>
                              <div className="flex h-34 items-center justify-center rounded-lg bg-muted">
                                <Icon
                                  className={`size-14 ${iconClassName ?? ''}`}
                                  style={iconStyle}
                                />
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </section>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {featureItems.map((item) => {
            const Icon = item.icon

            return (
              <article
                key={item.titleKey}
                className="rounded-lg border bg-card p-5 transition-colors hover:bg-input/50"
              >
                <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-muted">
                  <Icon className="size-5" />
                </div>
                <h2 className="font-semibold">{t(item.titleKey)}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {t(item.descriptionKey)}
                </p>
              </article>
            )
          })}
        </div>
      </section>
    </main>
  )
}

export default LandingPage
