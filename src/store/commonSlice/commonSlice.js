import { createSlice } from '@reduxjs/toolkit'

const commonSlice = createSlice({
    name: "auth",
    initialState: {
        token: null,
        success: false,
    },
    reducers: {
        setToken: (state, { payload }) => {
            state.token = payload
        },
        setSuccess: (state, { payload }) => {
            state.success = payload
        },
    }
})

export const { setSuccess, setToken } = commonSlice.actions
export default commonSlice.reducer