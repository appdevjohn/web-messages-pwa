/**
 * Socket.io client with automatic authentication token injection and refresh.
 *
 * This module wraps the socket.io client to automatically:
 * 1. Inject access tokens into socket emissions
 * 2. Detect unauthorized responses and refresh tokens
 * 3. Retry failed requests with new tokens
 */

import axios from 'axios'
import { io } from 'socket.io-client'

const URL = import.meta.env.VITE_API_BASE_URL

// Type definitions
type TokenPair = {
  accessToken: string
  refreshToken: string
}

type StoreLike = {
  getState: () => {
    auth: {
      accessToken: string | null
      refreshToken: string | null
    }
  }
  dispatch: (action: { type: string; payload?: unknown }) => unknown
}

type RefreshQueueItem = {
  resolve: (tokens: TokenPair) => void
  reject: (error: unknown) => void
}

// Create socket.io client with reconnection settings
const socket = io(URL, {
  reconnection: true, // Automatically reconnect if connection drops
  reconnectionAttempts: 5, // Try up to 5 times
  reconnectionDelay: 1000, // Wait 1 second between attempts
  timeout: 10000, // 10 second connection timeout
})

// Separate axios client for token refresh requests
const refreshClient = axios.create({
  baseURL: URL,
})

// State management
let store: StoreLike | null = null // Redux store reference, set via attachStore()
let isRefreshing = false // Prevents multiple simultaneous refresh requests
const refreshQueue: RefreshQueueItem[] = [] // Queue of pending requests waiting for token refresh

// Keys that will be automatically populated with the access token
const accessTokenKeys = ['accessToken', 'token', 'authToken'] as const

/**
 * Attach the Redux store to enable token access and refresh.
 * Must be called before using socket emissions that require auth.
 */
export const attachStore = (appStore: StoreLike) => {
  store = appStore
}

// Helper to get the current access token from Redux store
const getAccessToken = () => store?.getState().auth.accessToken ?? null

/**
 * Resolve all queued refresh promises with the new tokens.
 * Called after a successful token refresh.
 */
const fulfilRefreshQueue = (tokens: TokenPair) => {
  while (refreshQueue.length) {
    const pending = refreshQueue.shift()
    pending?.resolve(tokens)
  }
}

/**
 * Reject all queued refresh promises with an error.
 * Called when token refresh fails.
 */
const rejectRefreshQueue = (error: unknown) => {
  while (refreshQueue.length) {
    const pending = refreshQueue.shift()
    pending?.reject(error)
  }
}

/**
 * Request a new access token using the refresh token.
 * If a refresh is already in progress, queues the request and waits for that refresh.
 */
const requestTokenRefresh = async (): Promise<TokenPair> => {
  if (!store) {
    throw new Error('Store has not been attached to socket client.')
  }

  const refreshToken = store.getState().auth.refreshToken

  if (!refreshToken) {
    store.dispatch({ type: 'auth/clearTokens' })
    throw new Error('Missing refresh token')
  }

  // If already refreshing, queue this request and wait
  if (isRefreshing) {
    return new Promise<TokenPair>((resolve, reject) => {
      refreshQueue.push({ resolve, reject })
    })
  }

  isRefreshing = true

  try {
    const response = await refreshClient.post<TokenPair>('/auth/refresh', {
      refreshToken,
    })

    const tokens = response.data
    store.dispatch({ type: 'auth/setTokens', payload: tokens })
    fulfilRefreshQueue(tokens) // Resolve all queued requests
    return tokens
  } catch (error) {
    store.dispatch({ type: 'auth/clearTokens' })
    rejectRefreshQueue(error) // Reject all queued requests
    throw error
  } finally {
    isRefreshing = false
  }
}

/**
 * Injects the access token into an argument object.
 *
 * Looks for these keys and replaces their values with the actual token:
 * - 'accessToken', 'token', 'authToken' → replaced with the token
 * - 'authorization', 'Authorization' → set to 'Bearer {token}'
 *
 * Example: { token: '' } becomes { token: 'actual-jwt-token' }
 */
const updateArgWithAccessToken = (arg: unknown, accessToken: string | null) => {
  if (!accessToken) {
    return arg
  }

  // Only process objects (not arrays, primitives, or null)
  if (!arg || typeof arg !== 'object' || Array.isArray(arg)) {
    return arg
  }

  const currentArg = arg as Record<string, unknown>
  let shouldUpdate = false
  const updated: Record<string, unknown> = { ...currentArg }

  // Replace token keys with actual token
  accessTokenKeys.forEach((key) => {
    if (key in currentArg) {
      updated[key] = accessToken
      shouldUpdate = true
    }
  })

  // Set authorization headers
  if ('authorization' in currentArg) {
    updated.authorization = `Bearer ${accessToken}`
    shouldUpdate = true
  }

  if ('Authorization' in currentArg) {
    updated.Authorization = `Bearer ${accessToken}`
    shouldUpdate = true
  }

  return shouldUpdate ? updated : arg
}

/**
 * Injects the access token into all argument objects in an array.
 */
const getArgsWithAccessToken = (args: unknown[], accessToken: string | null) =>
  args.map((arg) => updateArgWithAccessToken(arg, accessToken))

// Common strings that indicate an unauthorized/expired token response
const unauthorizedIndicators = [
  'jwt expired',
  'token expired',
  'expired token',
  'invalid token',
  'unauthorized',
] as const

/**
 * Checks if a server response indicates unauthorized/expired token.
 * Looks for 401 status codes or token expiration messages in various formats.
 */
const isUnauthorizedResponse = (ackArgs: unknown[]) =>
  ackArgs.some((arg) => {
    if (!arg) return false

    // Check for 401 status code
    if (typeof arg === 'number') {
      return arg === 401
    }

    // Check for error messages in strings
    if (typeof arg === 'string') {
      const lower = arg.toLowerCase()
      return unauthorizedIndicators.some((indicator) => lower.includes(indicator))
    }

    // Check for error objects with status codes or messages
    if (typeof arg === 'object') {
      const value = arg as Record<string, unknown>
      const status = value.status ?? value.code ?? value.errorCode
      if (
        status === 401 ||
        status === '401' ||
        status === 'TOKEN_EXPIRED' ||
        status === 'token_expired'
      ) {
        return true
      }

      const message =
        value.message ?? value.error ?? value.detail ?? value.reason ?? value.title
      if (typeof message === 'string') {
        const lower = message.toLowerCase()
        return unauthorizedIndicators.some((indicator) => lower.includes(indicator))
      }
    }

    return false
  })

// Save reference to the original emit function
const originalEmit = socket.emit.bind(socket)

/**
 * Override socket.emit to automatically inject tokens and handle token refresh.
 *
 * How it works:
 * 1. Injects access token into arguments (e.g., { token: '' } → { token: 'actual-token' })
 * 2. Sends the event to the server
 * 3. If server responds with 401/unauthorized, automatically:
 *    - Refreshes the access token
 *    - Retries the request with the new token
 *
 * Usage: socket.emit('event-name', { token: '' }) - token will be auto-populated
 */
socket.emit = ((event: string, ...args: unknown[]) => {
  // Check if last argument is an acknowledgment callback
  const maybeAck = args[args.length - 1]
  const hasAck = typeof maybeAck === 'function'
  const baseArgs = hasAck ? args.slice(0, -1) : args
  const ack = hasAck ? (maybeAck as (...ackArgs: unknown[]) => void) : null

  const attemptEmit = (attempt: number, token: string | null) => {
    // Inject the access token into arguments
    const argsWithToken = getArgsWithAccessToken(baseArgs, token)

    // If no acknowledgment callback, just emit and return
    if (!ack) {
      originalEmit(event, ...argsWithToken)
      return socket
    }

    // Wrap the acknowledgment to detect unauthorized responses
    const wrappedAck = async (...ackArgs: unknown[]) => {
      // On first attempt, check if response is unauthorized
      if (attempt === 0 && isUnauthorizedResponse(ackArgs)) {
        try {
          // Refresh the token and retry
          const tokens = await requestTokenRefresh()
          attemptEmit(attempt + 1, tokens.accessToken)
          return
        } catch (refreshError) {
          // If refresh fails, call original callback with error
          ack(...ackArgs)
          return
        }
      }

      // Call the original callback
      ack(...ackArgs)
    }

    originalEmit(event, ...argsWithToken, wrappedAck)
    return socket
  }

  // Start with the current access token
  const currentAccessToken = getAccessToken()
  return attemptEmit(0, currentAccessToken)
}) as typeof socket.emit

export default socket
