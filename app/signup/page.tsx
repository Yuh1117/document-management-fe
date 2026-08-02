import type { Metadata } from 'next'
import { getT } from '@/lib/getMetadata'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT()
  return { title: t.signup.label }
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
