import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { IFolder } from "@/types/type"

interface FolderState {
    folderModal: {
        open: boolean;
        data: IFolder | null;
        isEditing: boolean
    };
    folderDetail: {
        open: boolean;
        data: IFolder | null;
    }
}

const initialState: FolderState = {
    folderModal: {
        open: false,
        data: null,
        isEditing: false
    },
    folderDetail: {
        open: false,
        data: null,
    }
}

const folderSlice = createSlice({
    name: "folders",
    initialState,
    reducers: {
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

        openFolderDetail: (state, action: PayloadAction<{ data: IFolder | null }>) => {
            state.folderDetail.open = true;
            state.folderDetail.data = action.payload.data;
        },
        closeFolderDetail: (state) => {
            state.folderDetail.open = false;
            state.folderDetail.data = null;
        },
    },
})

export const {
    openFolderModal,
    closeFolderModal,
    openFolderDetail,
    closeFolderDetail,
} = folderSlice.actions;

export default folderSlice.reducer