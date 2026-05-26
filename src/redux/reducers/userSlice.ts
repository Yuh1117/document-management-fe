import api, { endpoints } from '@/config/api'
import type { IAccount } from '@/types/type'
import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface UsersState {
  user: IAccount | null
  accessToken: string | null
  loading: boolean
}

const initialState: UsersState = {
  user: null,
  accessToken: null,
  loading: true,
}

export const initAuth = createAsyncThunk('users/initAuth', async (_, { rejectWithValue }) => {
  try {
    const refreshRes = await api.post(endpoints['refresh'])
    const accessToken = refreshRes.data.data.accessToken
    const user = refreshRes.data.data.user
    return { accessToken, user }
  } catch {
    return rejectWithValue(null)
  }
})

export const getProfile = createAsyncThunk(
  'users/profile',
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as { users: UsersState }
    if (!state.users.accessToken) return rejectWithValue(null)
    try {
      const res = await api.get(endpoints['profile'])
      return res.data.data
    } catch {
      return rejectWithValue(null)
    }
  }
)

export const logoutAsync = createAsyncThunk('users/logout', async () => {
  try {
    await api.post(endpoints['logout'])
  } catch {}
})

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ user: IAccount; accessToken: string }>) => {
      state.user = action.payload.user
      state.accessToken = action.payload.accessToken
    },
    logout: (state) => {
      state.user = null
      state.accessToken = null
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initAuth.pending, (state) => {
        state.loading = true
      })
      .addCase(initAuth.fulfilled, (state, action) => {
        state.loading = false
        state.accessToken = action.payload.accessToken
        state.user = action.payload.user
      })
      .addCase(initAuth.rejected, (state) => {
        state.loading = false
        state.user = null
        state.accessToken = null
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.user = action.payload
      })
      .addCase(logoutAsync.fulfilled, (state) => {
        state.user = null
        state.accessToken = null
      })
      .addCase(logoutAsync.rejected, (state) => {
        state.user = null
        state.accessToken = null
      })
  },
})

export const { login, logout, setAccessToken } = userSlice.actions
export default userSlice.reducer
