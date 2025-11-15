import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import restAPI from '../../util/rest'

const REFRESH_TOKEN_KEY = 'refreshToken'
let isInitializing = false

const saveRefreshToken = (token: string) => {
  localStorage.setItem(REFRESH_TOKEN_KEY, token)
}

const loadRefreshToken = (): string | null => {
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

const clearRefreshToken = () => {
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}

export interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  isLoading: boolean
  error: string | null
  isInitialized: boolean
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
  isInitialized: false,
}

export const initializeAuth = createAsyncThunk<TokenPair | null, void, AsyncThunkConfig>(
  'auth/initialize',
  async (_, { rejectWithValue }) => {
    if (isInitializing) {
      return null
    }

    const savedRefreshToken = loadRefreshToken()

    if (!savedRefreshToken) {
      return null
    }

    isInitializing = true

    try {
      const response = await restAPI.post('/auth/refresh', {
        refreshToken: savedRefreshToken,
      })
      return {
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
      }
    } catch (error) {
      clearRefreshToken()
      return rejectWithValue('Session expired')
    } finally {
      isInitializing = false
    }
  }
)

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
      saveRefreshToken(action.payload.refreshToken)
    },
    clearTokens: (state) => {
      state.accessToken = null
      state.refreshToken = null
      state.isLoading = false
      state.error = null
      clearRefreshToken()
    },
  },
  extraReducers: (builder) => {
    builder.addCase(initializeAuth.fulfilled, (state, action) => {
      if (action.payload) {
        state.accessToken = action.payload.accessToken
        state.refreshToken = action.payload.refreshToken
        saveRefreshToken(action.payload.refreshToken)
      }
      state.isInitialized = true
      state.isLoading = false
    })
    builder.addCase(initializeAuth.rejected, (state) => {
      state.isInitialized = true
      state.isLoading = false
    })
    builder.addCase(initializeAuth.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(logIn.fulfilled, (state, action) => {
      state.accessToken = action.payload.accessToken
      state.refreshToken = action.payload.refreshToken
      state.isLoading = false
      state.error = null
      saveRefreshToken(action.payload.refreshToken)
    })
    builder.addCase(logIn.rejected, (state, action) => {
      state.accessToken = null
      state.refreshToken = null
      state.isLoading = false
      state.error = action.error.message || 'Login failed'
      clearRefreshToken()
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
      saveRefreshToken(action.payload.refreshToken)
    })
    builder.addCase(signUp.rejected, (state, action) => {
      state.accessToken = null
      state.refreshToken = null
      state.isLoading = false
      state.error = action.error.message || 'Sign up failed'
      clearRefreshToken()
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
      saveRefreshToken(action.payload.refreshToken)
    })
    builder.addCase(refresh.rejected, (state, action) => {
      state.accessToken = null
      state.refreshToken = null
      state.isLoading = false
      state.error = action.payload || action.error.message || 'Token refresh failed'
      clearRefreshToken()
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
      clearRefreshToken()
    })
    builder.addCase(logOut.rejected, (state, action) => {
      state.accessToken = null
      state.refreshToken = null
      state.isLoading = false
      state.error = action.payload || action.error.message || 'Logout failed'
      clearRefreshToken()
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
      clearRefreshToken()
    })
    builder.addCase(logOutEverywhere.rejected, (state, action) => {
      state.accessToken = null
      state.refreshToken = null
      state.isLoading = false
      state.error = action.error.message || 'Logout everywhere failed'
      clearRefreshToken()
    })
    builder.addCase(logOutEverywhere.pending, (state) => {
      state.isLoading = true
      state.error = null
    })
  },
})

export const { setTokens, clearTokens } = authSlice.actions
export default authSlice.reducer
