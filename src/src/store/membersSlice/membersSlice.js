import { createSlice } from '@reduxjs/toolkit'

const membersSlice = createSlice({
    name: "auth",
    initialState: {
        approveMembers: null
    },
    reducers: {
        setApproveMembers: (state, { payload }) => {
            state.approveMembers = payload
        },
    }
})

export const { setApproveMembers } = membersSlice.actions
export default membersSlice.reducer