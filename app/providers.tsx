'use client'

import { useEffect, useState } from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAuthStore } from '@/store/authStore'
import { usePermissionStore } from '@/store/permissionStore'
import api, { endpoints } from '@/lib/api'
import { ThemeProvider } from '@/components/shared/settings/ThemeProvider'
import '@/lib/i18n'

const AuthInit = ({ children }: { children: React.ReactNode }) => {
  const { setAuth, setLoading } = useAuthStore()
  const { clearPermissions } = usePermissionStore()

  useEffect(() => {
    const init = async () => {
      try {
        const res = await api.post(endpoints['refresh'])
        const { accessToken, user } = res.data.data
        setAuth(user, accessToken)
      } catch {
        clearPermissions()
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

  return <>{children}</>
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: { queries: { retry: false, refetchOnWindowFocus: false } },
  }))

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light" storageKey="ui-theme">
          <AuthInit>{children}</AuthInit>
        </ThemeProvider>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  )
}
