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

type SignUpData = {
  displayName: string
  username: string
  email?: string | null
  password: string
}

type TokenPair = {
  accessToken: string
  refreshToken: string
}

type SignUpResponse = {
  user: {
    id: string
    verified: boolean
    displayName: string
    username: string
    email: string | null
    profilePicURL: string
  }
  accessToken: string
  refreshToken: string
  message: string
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

export const signUp = createAsyncThunk<SignUpResponse, SignUpData, AsyncThunkConfig>(
  'auth/signUp',
  async (signUpData) => {
    const response = await restAPI.post<SignUpResponse>('/auth/signup', signUpData)
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

export const logOut = createAsyncThunk<void, void, AsyncThunkConfig>(
  'auth/logOut',
  async (_, { getState, rejectWithValue }) => {
    const state = getState()
    const refreshToken = state.auth.refreshToken
    if (!refreshToken) {
      return rejectWithValue('Missing refresh token')
    }
    await restAPI.post('/auth/logout', {
      refreshToken,
    })
  }
)

export const logOutEverywhere = createAsyncThunk<void, void, AsyncThunkConfig>(
  'auth/logOutEverywhere',
  async () => {
    await restAPI.post('/auth/logout-everywhere')
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
    builder.addCase(signUp.fulfilled, (state, action) => {
      state.accessToken = action.payload.accessToken
      state.refreshToken = action.payload.refreshToken
      state.isLoading = false
      state.error = null
    })
    builder.addCase(signUp.rejected, (state, action) => {
      state.accessToken = null
      state.refreshToken = null
      state.isLoading = false
      state.error = action.error.message || 'Sign up failed'
    })
    builder.addCase(signUp.pending, (state) => {
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
    builder.addCase(logOut.fulfilled, (state) => {
      state.accessToken = null
      state.refreshToken = null
      state.isLoading = false
      state.error = null
    })
    builder.addCase(logOut.rejected, (state, action) => {
      state.accessToken = null
      state.refreshToken = null
      state.isLoading = false
      state.error = action.payload || action.error.message || 'Logout failed'
    })
    builder.addCase(logOut.pending, (state) => {
      state.isLoading = true
      state.error = null
    })
    builder.addCase(logOutEverywhere.fulfilled, (state) => {
      state.accessToken = null
      state.refreshToken = null
      state.isLoading = false
      state.error = null
    })
    builder.addCase(logOutEverywhere.rejected, (state, action) => {
      state.accessToken = null
      state.refreshToken = null
      state.isLoading = false
      state.error = action.error.message || 'Logout everywhere failed'
    })
    builder.addCase(logOutEverywhere.pending, (state) => {
      state.isLoading = true
      state.error = null
    })
  },
})

export const { setTokens, clearTokens } = authSlice.actions
export default authSlice.reducer
