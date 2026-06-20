'use client'

import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute'
import { MainLayout } from '@/features/shared/components/layout/MainLayout'

export default function MainGroupLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <MainLayout>{children}</MainLayout>
    </ProtectedRoute>
  )
}
