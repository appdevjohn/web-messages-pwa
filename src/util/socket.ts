import axios from 'axios'
import { io } from 'socket.io-client'

const URL = import.meta.env.VITE_API_BASE_URL

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

const socket = io(URL)

const refreshClient = axios.create({
  baseURL: URL,
})

let store: StoreLike | null = null
let isRefreshing = false
const refreshQueue: RefreshQueueItem[] = []

const accessTokenKeys = ['accessToken', 'token', 'authToken'] as const

export const attachStore = (appStore: StoreLike) => {
  store = appStore
}

const getAccessToken = () => store?.getState().auth.accessToken ?? null

const fulfilRefreshQueue = (tokens: TokenPair) => {
  while (refreshQueue.length) {
    const pending = refreshQueue.shift()
    pending?.resolve(tokens)
  }
}

const rejectRefreshQueue = (error: unknown) => {
  while (refreshQueue.length) {
    const pending = refreshQueue.shift()
    pending?.reject(error)
  }
}

const requestTokenRefresh = async (): Promise<TokenPair> => {
  if (!store) {
    throw new Error('Store has not been attached to socket client.')
  }

  const refreshToken = store.getState().auth.refreshToken

  if (!refreshToken) {
    store.dispatch({ type: 'auth/clearTokens' })
    throw new Error('Missing refresh token')
  }

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
    fulfilRefreshQueue(tokens)
    return tokens
  } catch (error) {
    store.dispatch({ type: 'auth/clearTokens' })
    rejectRefreshQueue(error)
    throw error
  } finally {
    isRefreshing = false
  }
}

const updateArgWithAccessToken = (arg: unknown, accessToken: string | null) => {
  if (!accessToken) {
    return arg
  }

  if (!arg || typeof arg !== 'object' || Array.isArray(arg)) {
    return arg
  }

  const currentArg = arg as Record<string, unknown>
  let shouldUpdate = false
  const updated: Record<string, unknown> = { ...currentArg }

  accessTokenKeys.forEach((key) => {
    if (key in currentArg) {
      updated[key] = accessToken
      shouldUpdate = true
    }
  })

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

const getArgsWithAccessToken = (args: unknown[], accessToken: string | null) =>
  args.map((arg) => updateArgWithAccessToken(arg, accessToken))

const unauthorizedIndicators = [
  'jwt expired',
  'token expired',
  'expired token',
  'invalid token',
  'unauthorized',
] as const

const isUnauthorizedResponse = (ackArgs: unknown[]) =>
  ackArgs.some((arg) => {
    if (!arg) return false

    if (typeof arg === 'number') {
      return arg === 401
    }

    if (typeof arg === 'string') {
      const lower = arg.toLowerCase()
      return unauthorizedIndicators.some((indicator) => lower.includes(indicator))
    }

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

const originalEmit = socket.emit.bind(socket)

socket.emit = ((event: string, ...args: unknown[]) => {
  const maybeAck = args[args.length - 1]
  const hasAck = typeof maybeAck === 'function'
  const baseArgs = hasAck ? args.slice(0, -1) : args
  const ack = hasAck ? (maybeAck as (...ackArgs: unknown[]) => void) : null

  const attemptEmit = (attempt: number, token: string | null) => {
    const argsWithToken = getArgsWithAccessToken(baseArgs, token)

    if (!ack) {
      originalEmit(event, ...argsWithToken)
      return socket
    }

    const wrappedAck = async (...ackArgs: unknown[]) => {
      if (attempt === 0 && isUnauthorizedResponse(ackArgs)) {
        try {
          const tokens = await requestTokenRefresh()
          attemptEmit(attempt + 1, tokens.accessToken)
          return
        } catch (refreshError) {
          ack(...ackArgs)
          return
        }
      }

      ack(...ackArgs)
    }

    originalEmit(event, ...argsWithToken, wrappedAck)
    return socket
  }

  const currentAccessToken = getAccessToken()
  return attemptEmit(0, currentAccessToken)
}) as typeof socket.emit

export default socket
