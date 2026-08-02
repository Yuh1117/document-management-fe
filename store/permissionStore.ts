import { create } from 'zustand'
import api, { endpoints } from '@/lib/api'

interface PermissionState {
  permissionsMap: Record<string, boolean>
  loading: boolean
  fetchPermissions: (perms: { apiPath: string; method: string }[]) => Promise<void>
  clearPermissions: () => void
}

export const usePermissionStore = create<PermissionState>((set) => ({
  permissionsMap: {},
  loading: false,

  fetchPermissions: async (perms) => {
    set({ loading: true })
    try {
      const res = await api.post(endpoints['check-permissions'], perms)
      set((s) => ({
        loading: false,
        permissionsMap: { ...s.permissionsMap, ...res.data.data },
      }))
    } catch {
      set({ loading: false })
    }
  },

  clearPermissions: () => set({ permissionsMap: {}, loading: false }),
}))
