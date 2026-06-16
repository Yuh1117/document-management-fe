import { configureStore } from '@reduxjs/toolkit'
import userSlice from './slices/userSlice'
import permissionSlice from './slices/permissionSlice'
import filesSlice from './slices/filesSlice'
import documentSlice from './slices/documentSlice'
import folderSlice from './slices/folderSlice'
import { injectStore } from '@/lib/api'

export const store = configureStore({
  reducer: {
    users: userSlice,
    permissions: permissionSlice,
    files: filesSlice,
    documents: documentSlice,
    folders: folderSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['files/openUploadModeModal'],
        ignoredPaths: ['files.uploadModeModal.files'],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store

injectStore(store)
