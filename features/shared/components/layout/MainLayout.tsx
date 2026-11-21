'use client'

import Header from './Header'
import { AppSidebar } from './AppSidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider className="flex-col">
      <Header />
      <div className="flex flex-1">
        <AppSidebar className="top-(--header-height) h-[calc(100svh-var(--header-height))] border-none" />
        <SidebarInset className="pe-2">{children}</SidebarInset>
      </div>
    </SidebarProvider>
  )
}
