import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Đăng nhập',
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
