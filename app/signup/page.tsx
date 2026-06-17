import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Đăng ký',
}

import { AuthRoute } from '@/features/auth/components/ProtectedRoute'
import Signup from '@/features/auth/components/SignupPage'

export default function SignupPage() {
  return (
    <AuthRoute>
      <Signup />
    </AuthRoute>
  )
}
