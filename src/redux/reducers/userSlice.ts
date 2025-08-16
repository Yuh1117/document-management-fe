import { authApis, endpoints } from '@/config/Api';
import type { IAccount } from '@/types/type';
import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import cookies from 'react-cookies';

interface UsersState {
    user: IAccount | null;
}

const initialState: UsersState = {
    user: null,
};

export const getProfile = createAsyncThunk(
    'users/profile',
    async () => {
        const token = cookies.load('token');
        if (token) {
            const res = await authApis().get(endpoints["profile"])
            return res.data.data;
        }
        return null;
    }
);

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<IAccount>) => {
            state.user = action.payload;
        },
        logout: (state) => {
            cookies.remove("token");
            state.user = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getProfile.pending, (state) => {
                state.user = null;
            })
            .addCase(getProfile.fulfilled, (state, action) => {
                state.user = action.payload ?? null;
            })
            .addCase(getProfile.rejected, (state) => {
                state.user = null;
            });
    },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;