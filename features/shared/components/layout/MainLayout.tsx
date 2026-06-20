'use client'

import Header from './Header'
import { AppSidebar } from './AppSidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <SidebarProvider className="min-h-0">
        <AppSidebar className="border-none pt-18" />
        <SidebarInset className="pe-2">{children}</SidebarInset>
      </SidebarProvider>
    </>
  )
}
