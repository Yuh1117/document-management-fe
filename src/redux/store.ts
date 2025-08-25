import { configureStore } from '@reduxjs/toolkit'
import userSlice from "./reducers/userSlice"
import permissionSlice from "./reducers/permissionSlice"
import filesSlice from "./reducers/filesSlice"
import documentSlice from "./reducers/documentSlice"
import folderSlice from "./reducers/folderSlice"

export const store = configureStore({
    reducer: {
        users: userSlice,
        permissions: permissionSlice,
        files: filesSlice,
        documents: documentSlice,
        folders: folderSlice
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch