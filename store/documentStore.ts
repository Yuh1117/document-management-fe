import { create } from 'zustand'
import type { IDocument } from '@/types/type'

interface ModalState {
  open: boolean
  data: IDocument | null
}

interface DocumentState {
  documentModal: ModalState
  documentDetail: ModalState
  shareUrlModal: ModalState
  documentVersion: ModalState
  previewModal: ModalState
  summarizeModal: ModalState

  openDocumentModal: (data: IDocument | null) => void
  closeDocumentModal: () => void
  openDocumentDetail: (data: IDocument | null) => void
  closeDocumentDetail: () => void
  openShareUrlModal: (data: IDocument | null) => void
  closeShareUrlModal: () => void
  openVersionModal: (data: IDocument | null) => void
  closeVersionModal: () => void
  openPreviewModal: (data: IDocument | null) => void
  closePreviewModal: () => void
  openSummarizeModal: (data: IDocument | null) => void
  closeSummarizeModal: () => void
}

const closed: ModalState = { open: false, data: null }
const open = (data: IDocument | null): ModalState => ({ open: true, data })

export const useDocumentStore = create<DocumentState>((set) => ({
  documentModal: closed,
  documentDetail: closed,
  shareUrlModal: closed,
  documentVersion: closed,
  previewModal: closed,
  summarizeModal: closed,

  openDocumentModal: (data) => set({ documentModal: open(data) }),
  closeDocumentModal: () => set({ documentModal: closed }),
  openDocumentDetail: (data) => set({ documentDetail: open(data) }),
  closeDocumentDetail: () => set({ documentDetail: closed }),
  openShareUrlModal: (data) => set({ shareUrlModal: open(data) }),
  closeShareUrlModal: () => set({ shareUrlModal: closed }),
  openVersionModal: (data) => set({ documentVersion: open(data) }),
  closeVersionModal: () => set({ documentVersion: closed }),
  openPreviewModal: (data) => set({ previewModal: open(data) }),
  closePreviewModal: () => set({ previewModal: closed }),
  openSummarizeModal: (data) => set({ summarizeModal: open(data) }),
  closeSummarizeModal: () => set({ summarizeModal: closed }),
}))
