'use client'

import { AuthRoute } from '@/features/auth/components/ProtectedRoute'
import Login from '@/features/auth/components/LoginPage'

export default function LoginPage() {
  return (
    <AuthRoute>
      <Login />
    </AuthRoute>
  )
}
