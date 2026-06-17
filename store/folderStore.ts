import { create } from 'zustand'
import type { IFolder } from '@/types/type'

interface FolderState {
  folderModal: { open: boolean; data: IFolder | null; isEditing: boolean }
  folderDetail: { open: boolean; data: IFolder | null }

  openFolderModal: (data: IFolder | null, isEditing: boolean) => void
  closeFolderModal: () => void
  openFolderDetail: (data: IFolder | null) => void
  closeFolderDetail: () => void
}

export const useFolderStore = create<FolderState>((set) => ({
  folderModal: { open: false, data: null, isEditing: false },
  folderDetail: { open: false, data: null },

  openFolderModal: (data, isEditing) => set({ folderModal: { open: true, data, isEditing } }),
  closeFolderModal: () => set({ folderModal: { open: false, data: null, isEditing: false } }),
  openFolderDetail: (data) => set({ folderDetail: { open: true, data } }),
  closeFolderDetail: () => set({ folderDetail: { open: false, data: null } }),
}))
