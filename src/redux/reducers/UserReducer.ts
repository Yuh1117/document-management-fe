import { authApis, endpoints } from '@/config/Api';
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

interface User {
    id: number;
    email: string,
    firstName: string,
    lastName: string,
    avatar: string | null,
    role: string
}

interface UsersState {
    user: User | null;
}

const initialState: UsersState = {
    user: null,
};

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<User>) => {
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

export const { login, logout } = usersSlice.actions;
export default usersSlice.reducer;
