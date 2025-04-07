import { configureStore } from '@reduxjs/toolkit'
import IDSlice from './ID/IDSlice'

export const store = configureStore({
    reducer: {
        ID: IDSlice
    },
})