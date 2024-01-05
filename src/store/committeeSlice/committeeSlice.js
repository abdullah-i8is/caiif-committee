import { createSlice } from '@reduxjs/toolkit'

const committeeSlice = createSlice({
    name: "committees",
    initialState: {
        committees: null
    },
    reducers: {
        setCommittees: (state, { payload }) => {
            state.committees = payload
        },
    }
})

export const { setCommittees } = committeeSlice.actions
export default committeeSlice.reducer