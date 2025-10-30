import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import restAPI from '../../util/rest'

export interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  isLoading: boolean
  error: string | null
}

type Credentials = {
  username: string
  password: string
}

type TokenPair = {
  accessToken: string
  refreshToken: string
}

type AsyncThunkConfig = {
  state: RootState
  rejectValue: string
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  isLoading: false,
  error: null,
}

export const logIn = createAsyncThunk<TokenPair, Credentials, AsyncThunkConfig>(
  'auth/logIn',
  async (credentials) => {
    const response = await restAPI.put<TokenPair>('/auth/login', credentials)
    return response.data
  }
)

export const refresh = createAsyncThunk<TokenPair, void, AsyncThunkConfig>(
  'auth/refresh',
  async (_, { getState, rejectWithValue }) => {
    const state = getState()
    const refreshToken = state.auth.refreshToken
    if (!refreshToken) {
      return rejectWithValue('Missing refresh token')
    }
    const response = await restAPI.post<TokenPair>('/auth/refresh', {
      refreshToken,
    })
    return response.data
  }
)

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setTokens: (state, action: PayloadAction<TokenPair>) => {
      state.accessToken = action.payload.accessToken
      state.refreshToken = action.payload.refreshToken
      state.isLoading = false
      state.error = null
    },
    clearTokens: (state) => {
      state.accessToken = null
      state.refreshToken = null
      state.isLoading = false
      state.error = null
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
      state.error = action.payload || action.error.message || 'Token refresh failed'
    })
    builder.addCase(refresh.pending, (state) => {
      state.isLoading = true
      state.error = null
    })
  },
})

export const { setTokens, clearTokens } = authSlice.actions
export default authSlice.reducer
