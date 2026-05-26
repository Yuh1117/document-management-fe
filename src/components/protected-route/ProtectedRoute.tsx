import { useAppSelector } from '@/redux/hooks'
import NotLogin from './NotLogin'
import NotPermitted from './NotPermitted'
import { Navigate } from 'react-router'
import LoadingScreen from '@/components/shared/LoadingScreen'

type RouteGuardProps = {
  children: React.ReactNode
}

type PublicHomeRouteProps = RouteGuardProps & {
  fallback: React.ReactNode
}

export const PublicHomeRoute = ({ children, fallback }: PublicHomeRouteProps) => {
  const { user, loading } = useAppSelector((state) => state.users)
  if (loading) return <LoadingScreen />
  return user ? <>{children}</> : <>{fallback}</>
}

export const ProtectedRoute = ({ children }: RouteGuardProps) => {
  const { user, loading } = useAppSelector((state) => state.users)
  if (loading) return <LoadingScreen />
  return user ? <>{children}</> : <NotLogin />
}

export const AdminRoute = ({ children }: RouteGuardProps) => {
  const { user, loading } = useAppSelector((state) => state.users)
  if (loading) return <LoadingScreen />
  return user ? (
    user?.role.name.startsWith('ROLE_ADMIN') ? (
      <>{children}</>
    ) : (
      <NotPermitted />
    )
  ) : (
    <NotLogin />
  )
}

export const AuthRoute = ({ children }: RouteGuardProps) => {
  const { user, loading } = useAppSelector((state) => state.users)
  if (loading) return <LoadingScreen />
  return user ? <Navigate to="/" replace /> : <>{children}</>
}
