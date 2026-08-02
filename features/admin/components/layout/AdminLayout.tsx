'use client'

import { AdminSidebar } from './AdminSidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { Toaster } from 'sonner'

export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>{children}</SidebarInset>
      <Toaster richColors position="top-center" />
    </SidebarProvider>
  )
}
