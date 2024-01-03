import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: {},
    },
    reducers: {
        setUser: (state, { payload }) => {
            return {
                ...state,
                user: payload
            }
        },
    }
})

export const { setUser } = authSlice.actions
export default authSlice.reducer