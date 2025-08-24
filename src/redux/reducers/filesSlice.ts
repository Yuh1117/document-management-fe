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
    permission: string | null
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
    },
    permission: null
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
            // state.folderModal.isEditing = false
            state.folderModal.data = null
        },

        openDocumentModal: (state, action: PayloadAction<{ data: IDocument | null }>) => {
            state.documentModal.open = true
            state.documentModal.data = action.payload.data
        },
        closeDocumentModal: (state) => {
            state.documentModal.open = false
            state.documentModal.data = null
        },

        setPermission: (state, action: PayloadAction<string | null>) => {
            console.log(action.payload)
            state.permission = action.payload
        },
        resetPermission: (state) => {
            state.permission = null
        }
    },
})

export const { triggerReload, openFolderModal, closeFolderModal, openDocumentModal, closeDocumentModal, setPermission, resetPermission } = filesSlice.actions
export default filesSlice.reducer