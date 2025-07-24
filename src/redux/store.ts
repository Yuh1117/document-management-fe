import { configureStore } from '@reduxjs/toolkit'
import UserReducer from "./reducers/UserReducer"

export const store = configureStore({
    reducer: {
        users: UserReducer,
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch