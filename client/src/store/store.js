import { configureStore } from '@reduxjs/toolkit'
import userReducer from './slices/user.slice.js'
import companyReducer from './slices/company.slice.js'

export const store = configureStore({
  reducer: {
    user: userReducer,
    company: companyReducer,
  },
})

export default store
