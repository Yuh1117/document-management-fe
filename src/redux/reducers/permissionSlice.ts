import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApis, endpoints } from '@/config/Api';
import { logout } from './userSlice';

interface PermissionsState {
    permissionsMap: Record<string, boolean>;
    loading: boolean;
}

const initialState: PermissionsState = {
    permissionsMap: {},
    loading: false,
};

export const fetchPermissions = createAsyncThunk(
    'permissions/fetchPermissions',
    async (permissionsToCheck: { apiPath: string; method: string }[]) => {
        const res = await authApis().post(endpoints['check-permissions'], permissionsToCheck);
        return res.data.data;
    }
);

const permissionsSlice = createSlice({
    name: 'permissions',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPermissions.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchPermissions.fulfilled, (state, action) => {
                state.loading = false;
                state.permissionsMap = {
                    ...state.permissionsMap,
                    ...action.payload,
                };
            })
            .addCase(fetchPermissions.rejected, (state) => {
                state.loading = false;
            })
            .addCase(logout, (state) => {
                state.permissionsMap = {};
                state.loading = false;
            });
    },
});

export default permissionsSlice.reducer;