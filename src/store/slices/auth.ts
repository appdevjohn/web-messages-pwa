import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import restAPI from '../../util/rest'

export interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  isLoading: boolean
  error: string | null
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  isLoading: false,
  error: null,
}

export const logIn = createAsyncThunk(
  'auth/logIn',
  async (credentials: { username: string; password: string }) => {
    const response = await restAPI.put('/auth/login', {
      username: credentials.username,
      password: credentials.password,
    })
    return response.data
  }
)

export const refresh = createAsyncThunk(
  'auth/refresh',
  async (_, { getState }) => {
    const state = getState()
    const refreshToken = (state as any).auth.refreshToken
    const response = await restAPI.post('/auth/refresh', {
      refreshToken,
    })
    return response.data
  }
)

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setTokens: (state, action: PayloadAction<AuthState>) => {
      state.accessToken = action.payload.accessToken
      state.refreshToken = action.payload.refreshToken
    },
    clearTokens: (state) => {
      state.accessToken = null
      state.refreshToken = null
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logIn.fulfilled, (state, action) => {
      state.accessToken = action.payload.accessToken
      state.refreshToken = action.payload.refreshToken
      state.isLoading = false
      state.error = null
    })
    builder.addCase(logIn.rejected, (state, action) => {
      state.accessToken = null
      state.refreshToken = null
      state.isLoading = false
      state.error = action.error.message || 'Login failed'
    })
    builder.addCase(logIn.pending, (state) => {
      state.isLoading = true
      state.error = null
    })
    builder.addCase(refresh.fulfilled, (state, action) => {
      state.accessToken = action.payload.accessToken
      state.refreshToken = action.payload.refreshToken
      state.isLoading = false
      state.error = null
    })
    builder.addCase(refresh.rejected, (state, action) => {
      state.accessToken = null
      state.refreshToken = null
      state.isLoading = false
      state.error = action.error.message || 'Login failed'
    })
    builder.addCase(refresh.pending, (state) => {
      state.isLoading = true
      state.error = null
    })
  },
})

export const { setTokens, clearTokens } = authSlice.actions
export default authSlice.reducer
