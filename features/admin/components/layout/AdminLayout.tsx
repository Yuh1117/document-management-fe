'use client'

import { AdminSidebar } from './AdminSidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  )
}
