'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import NotLogin from './NotLogin'
import NotPermitted from './NotPermitted'
import LoadingScreen from '@/components/shared/LoadingScreen'

type RouteGuardProps = { children: React.ReactNode }
type PublicHomeRouteProps = RouteGuardProps & { fallback: React.ReactNode }

export const PublicHomeRoute = ({ children, fallback }: PublicHomeRouteProps) => {
  const { user, loading } = useAuthStore()
  if (loading) return <LoadingScreen />
  return user ? <>{children}</> : <>{fallback}</>
}

export const ProtectedRoute = ({ children }: RouteGuardProps) => {
  const { user, loading } = useAuthStore()
  if (loading) return <LoadingScreen />
  return user ? <>{children}</> : <NotLogin />
}

export const AdminRoute = ({ children }: RouteGuardProps) => {
  const { user, loading } = useAuthStore()
  if (loading) return <LoadingScreen />
  return user ? (
    user.role.name.startsWith('ROLE_ADMIN') ? <>{children}</> : <NotPermitted />
  ) : (
    <NotLogin />
  )
}

export const AuthRoute = ({ children }: RouteGuardProps) => {
  const { user, loading } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) router.replace('/')
  }, [loading, user, router])

  if (loading || user) return <LoadingScreen />
  return <>{children}</>
}
