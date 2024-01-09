import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        isVerified: false
    },
    reducers: {
        setUser: (state, { payload }) => {
            return {
                ...state,
                user: payload
            }
        },
        setUserVerification: (state, { payload }) => {
            return {
                ...state,
                isVerified: payload
            }
        },
    }
})

export const { setUser, setUserVerification } = authSlice.actions
export default authSlice.reducer