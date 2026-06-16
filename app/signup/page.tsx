'use client'

import { AuthRoute } from '@/features/auth/components/ProtectedRoute'
import Signup from '@/features/auth/components/SignupPage'

export default function SignupPage() {
  return (
    <AuthRoute>
      <Signup />
    </AuthRoute>
  )
}
