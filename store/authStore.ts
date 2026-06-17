import { create } from 'zustand'
import type { IAccount } from '@/types/type'

interface AuthState {
  user: IAccount | null
  accessToken: string | null
  loading: boolean
  setAuth: (user: IAccount, accessToken: string) => void
  setAccessToken: (token: string) => void
  clearAuth: () => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  loading: true,
  setAuth: (user, accessToken) => set({ user, accessToken }),
  setAccessToken: (token) => set({ accessToken: token }),
  clearAuth: () => set({ user: null, accessToken: null }),
  setLoading: (loading) => set({ loading }),
}))
