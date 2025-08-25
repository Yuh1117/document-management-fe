import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { IDocument } from "@/types/type"

interface DocumentState {
    documentModal: {
        open: boolean;
        data: IDocument | null;
    };
    documentDetail: {
        open: boolean;
        data: IDocument | null;
    };
    shareUrlModal: {
        open: boolean;
        data: IDocument | null;
    };
}

const initialState: DocumentState = {
    documentModal: {
        open: false,
        data: null,
    },
    documentDetail: {
        open: false,
        data: null,
    },
    shareUrlModal: {
        open: false,
        data: null,
    }
}

const documentSlice = createSlice({
    name: "documents",
    initialState,
    reducers: {
        openDocumentModal: (state, action: PayloadAction<{ data: IDocument | null }>) => {
            state.documentModal.open = true;
            state.documentModal.data = action.payload.data;
        },
        closeDocumentModal: (state) => {
            state.documentModal.open = false;
            state.documentModal.data = null;
        },

        openDocumentDetail: (state, action: PayloadAction<{ data: IDocument | null }>) => {
            state.documentDetail.open = true;
            state.documentDetail.data = action.payload.data;
        },
        closeDocumentDetail: (state) => {
            state.documentDetail.open = false;
            state.documentDetail.data = null;
        },

        openShareUrlModal: (state, action: PayloadAction<{ data: IDocument | null }>) => {
            state.shareUrlModal.open = true;
            state.shareUrlModal.data = action.payload.data;
        },
        closeShareUrlModal: (state) => {
            state.shareUrlModal.open = false;
            state.shareUrlModal.data = null;
        },
    },
})

export const {
    openDocumentModal,
    closeDocumentModal,
    openDocumentDetail,
    closeDocumentDetail,
    openShareUrlModal,
    closeShareUrlModal,
} = documentSlice.actions;

export default documentSlice.reducer