import type { IDocument, IFolder } from "@/types/type";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface FilesState {
    reloadFlag: boolean,
    shareModal: {
        open: boolean;
        data: IDocument | IFolder | null;
    };
    transferModal: {
        open: boolean;
        data: IDocument | IFolder | null;
        mode: "move" | "copy" | null;
    };
    permission: string | null;
}

const initialState: FilesState = {
    reloadFlag: false,
    permission: null,
    shareModal: {
        open: false,
        data: null,
    },
    transferModal: {
        open: false,
        data: null,
        mode: null,
    },
}

const filesSlice = createSlice({
    name: "files",
    initialState,
    reducers: {
        triggerReload: (state) => {
            state.reloadFlag = !state.reloadFlag
        },

        openShareModal: (state, action: PayloadAction<{ data: IDocument | IFolder | null }>) => {
            state.shareModal.open = true;
            state.shareModal.data = action.payload.data;
        },
        closeShareModal: (state) => {
            state.shareModal.open = false;
            state.shareModal.data = null;
        },

        openTransferModal: (state, action: PayloadAction<{ data: IDocument | IFolder | null; mode: "move" | "copy" | null }>) => {
            state.transferModal.open = true;
            state.transferModal.data = action.payload.data;
            state.transferModal.mode = action.payload.mode;
        },
        closeTransferModal: (state) => {
            state.transferModal.open = false;
            state.transferModal.data = null;
            state.transferModal.mode = null;
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

export const { triggerReload, setPermission, resetPermission, openShareModal, closeShareModal, openTransferModal, closeTransferModal } = filesSlice.actions
export default filesSlice.reducer