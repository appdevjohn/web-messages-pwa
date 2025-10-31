import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/auth'
import { attachStore as attachRestStore } from '../util/rest'
import { attachStore as attachSocketStore } from '../util/socket'

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
})

attachRestStore(store)
attachSocketStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
