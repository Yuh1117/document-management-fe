import { createSlice } from "@reduxjs/toolkit"

interface FilesState {
    reloadFlag: boolean
}

const initialState: FilesState = {
    reloadFlag: false,
}

const filesSlice = createSlice({
    name: "files",
    initialState,
    reducers: {
        triggerReload: (state) => {
            console.log(state.reloadFlag)
            state.reloadFlag = !state.reloadFlag
        },
    },
})

export const { triggerReload } = filesSlice.actions
export default filesSlice.reducer
