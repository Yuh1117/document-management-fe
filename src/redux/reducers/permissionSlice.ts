import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApis, endpoints } from '@/config/Api';

interface PermissionsState {
    permissionsMap: Record<string, boolean>;
    loading: boolean;
    error?: string;
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
                state.error = undefined;
            })
            .addCase(fetchPermissions.fulfilled, (state, action) => {
                state.loading = false;
                state.permissionsMap = {
                    ...state.permissionsMap,
                    ...action.payload,
                };
            })
            .addCase(fetchPermissions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default permissionsSlice.reducer;