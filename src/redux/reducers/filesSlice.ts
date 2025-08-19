import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { IDocument, IFolder } from "@/types/type"

interface FilesState {
    reloadFlag: boolean,
    folderModal: {
        open: boolean,
        isEditing: boolean,
        data: IFolder | null
    },
    documentModal: {
        open: boolean,
        data: IDocument | null
    }
}

const initialState: FilesState = {
    reloadFlag: false,
    folderModal: {
        open: false,
        isEditing: false,
        data: null
    },
    documentModal: {
        open: false,
        data: null
    }
}

const filesSlice = createSlice({
    name: "files",
    initialState,
    reducers: {
        triggerReload: (state) => {
            state.reloadFlag = !state.reloadFlag
        },

        openFolderModal: (state, action: PayloadAction<{ isEditing: boolean, data: IFolder | null }>) => {
            state.folderModal.open = true
            state.folderModal.isEditing = action.payload.isEditing
            state.folderModal.data = action.payload.data
        },
        closeFolderModal: (state) => {
            state.folderModal.open = false
            state.folderModal.isEditing = false
            state.folderModal.data = null
        },

        openDocumentModal: (state, action: PayloadAction<{ data: IDocument | null }>) => {
            state.documentModal.open = true
            state.documentModal.data = action.payload.data
        },
        closeDocumentModal: (state) => {
            state.documentModal.open = false
            state.documentModal.data = null
        }
    },
})

export const { triggerReload, openFolderModal, closeFolderModal, openDocumentModal, closeDocumentModal } = filesSlice.actions
export default filesSlice.reducer