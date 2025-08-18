import { configureStore } from '@reduxjs/toolkit'
import UserReducer from "./reducers/userSlice"
import PermissionReducer from "./reducers/permissionSlice"
import FilesReducer from "./reducers/filesSlice"


export const store = configureStore({
    reducer: {
        users: UserReducer,
        permissions: PermissionReducer,
        files: FilesReducer
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch