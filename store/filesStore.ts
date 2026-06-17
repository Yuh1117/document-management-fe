import { create } from 'zustand'
import type { IDocument, IFolder } from '@/types/type'

interface FilesState {
  reloadFlag: boolean
  shareModal: { open: boolean; data: IDocument | IFolder | null }
  transferModal: { open: boolean; data: IDocument | IFolder | null; mode: 'move' | 'copy' | null }
  uploadModeModal: { open: boolean; files: File[] | null }
  permission: string | null

  triggerReload: () => void
  openShareModal: (data: IDocument | IFolder | null) => void
  closeShareModal: () => void
  openTransferModal: (data: IDocument | IFolder | null, mode: 'move' | 'copy') => void
  closeTransferModal: () => void
  openUploadModeModal: (files: File[]) => void
  closeUploadModeModal: () => void
  setPermission: (permission: string | null) => void
  resetPermission: () => void
}

export const useFilesStore = create<FilesState>((set) => ({
  reloadFlag: false,
  shareModal: { open: false, data: null },
  transferModal: { open: false, data: null, mode: null },
  uploadModeModal: { open: false, files: null },
  permission: null,

  triggerReload: () => set((s) => ({ reloadFlag: !s.reloadFlag })),
  openShareModal: (data) => set({ shareModal: { open: true, data } }),
  closeShareModal: () => set({ shareModal: { open: false, data: null } }),
  openTransferModal: (data, mode) => set({ transferModal: { open: true, data, mode } }),
  closeTransferModal: () => set({ transferModal: { open: false, data: null, mode: null } }),
  openUploadModeModal: (files) => set({ uploadModeModal: { open: true, files } }),
  closeUploadModeModal: () => set({ uploadModeModal: { open: false, files: null } }),
  setPermission: (permission) => set({ permission }),
  resetPermission: () => set({ permission: null }),
}))
