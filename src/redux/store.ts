import { configureStore } from '@reduxjs/toolkit'
import UserReducer from "./reducers/userSlice"
import PermissionReducer from "./reducers/permissionSlice"

export const store = configureStore({
    reducer: {
        users: UserReducer,
        permissions: PermissionReducer
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch