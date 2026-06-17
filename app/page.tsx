import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Trang chủ',
}

import { PublicHomeRoute } from '@/features/auth/components/ProtectedRoute'
import LandingPage from '@/features/landing/components/LandingPage'
import Home from '@/features/files/components/HomePage'
import { MainLayout } from '@/components/shared/layout/MainLayout'

export default function RootPage() {
  return (
    <PublicHomeRoute fallback={<LandingPage />}>
      <MainLayout>
        <Home />
      </MainLayout>
    </PublicHomeRoute>
  )
}
