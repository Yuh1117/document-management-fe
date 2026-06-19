import type { Metadata } from 'next'
import { getT } from '@/lib/getMetadata'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT()
  return { title: t.pages.home }
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
