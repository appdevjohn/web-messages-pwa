import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/auth'
import { attachStore } from '../util/rest'

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
})

attachStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
