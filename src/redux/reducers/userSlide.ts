import { authApis, endpoints } from '@/config/Api';
import type { IAccount } from '@/types/type';
import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import cookies from "react-cookies";

export const getProfile = createAsyncThunk(
    'users/profile',
    async () => {
        if (cookies.load('token')) {
            const res = await authApis().get(endpoints["profile"])
            return res.data.data;
        }
        return null;
    }
)

interface UsersState {
    user: IAccount | null;
}

const initialState: UsersState = {
    user: null,
};

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<IAccount>) => {
            state.user = action.payload;
        },
        logout: (state) => {
            cookies.remove("token")
            state.user = null;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getProfile.pending, (state, action) => {
            if (action.payload) {
                state.user = null
            }
        })

        builder.addCase(getProfile.fulfilled, (state, action) => {
            if (action.payload) {
                state.user = action.payload
            }
        })

        builder.addCase(getProfile.rejected, (state, action) => {
            if (action.payload) {
                state.user = null
            }
        })

    },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
