import type { Metadata } from 'next'
import { getT } from '@/lib/getMetadata'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT()
  return { title: t.login.label }
}

import { AuthRoute } from '@/features/auth/components/ProtectedRoute'
import Login from '@/features/auth/components/LoginPage'

export default function LoginPage() {
  return (
    <AuthRoute>
      <Login />
    </AuthRoute>
  )
}
