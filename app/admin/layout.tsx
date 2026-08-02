'use client'

import { AdminRoute } from '@/features/auth/components/ProtectedRoute'
import { AdminLayout } from '@/features/admin/components/layout/AdminLayout'

export default function AdminGroupLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminRoute>
      <AdminLayout>{children}</AdminLayout>
    </AdminRoute>
  )
}
