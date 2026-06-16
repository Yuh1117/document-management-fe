'use client'

import { useEffect } from 'react'
import { Provider } from 'react-redux'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { store } from '@/store'
import { useAppDispatch } from '@/store/hooks'
import { initAuth } from '@/store/slices/userSlice'
import { ThemeProvider } from '@/components/shared/settings/ThemeProvider'
import '@/lib/i18n'

const AuthInit = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(initAuth())
  }, [dispatch])

  return <>{children}</>
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
      <Provider store={store}>
        <ThemeProvider defaultTheme="light" storageKey="ui-theme">
          <AuthInit>{children}</AuthInit>
        </ThemeProvider>
      </Provider>
    </GoogleOAuthProvider>
  )
}
