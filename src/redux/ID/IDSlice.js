import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    programID: null,
    subjectID: null,
    isAdmin: null,
    isSidebarExtended: 0,
    accessToken: null
}

export const IDSlice = createSlice({
    name: 'ID',
    initialState,
    reducers: {
        setProgramID: (state, action) => {
            state.programID = action.payload;
        },
        setSubjectID: (state, action) => {
            state.subjectID = action.payload
        },
        setIsAdmin: (state, action) => {
            state.isAdmin = action.payload
        },
        setIsSidebarExtended: (state, action) => {
            state.isSidebarExtended = action.payload
        },
        setAccessToken: (state, action) => {
            state.accessToken = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { setProgramID, setSubjectID, setIsAdmin, setIsSidebarExtended, setAccessToken } = IDSlice.actions

export default IDSlice.reducer