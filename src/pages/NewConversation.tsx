/// <reference types="vite-plugin-svgr/client" />

import { useState, useEffect, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import socket from '../util/socket'
import getDaysRemaining from '../util/daysRemaining'
import { StoredConversationType } from '../types'
import { logOut } from '../store/slices/auth'
import type { RootState, AppDispatch } from '../store/store'

const Content = styled.div`
  margin: 0 auto;
  max-width: 42rem;
  padding: 2rem 1rem 3rem;

  @media (min-width: 40rem) {
    padding: 3rem 1rem 4rem;
  }
`

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2.5rem;
  gap: 1rem;

  @media (min-width: 40rem) {
    margin-bottom: 3rem;
  }
`

const Brand = styled.h1`
  font-size: 1.75rem;
  font-weight: 800;
  margin: 0;
  background: linear-gradient(135deg, var(--accent-color) 0%, #5a5479 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (min-width: 40rem) {
    font-size: 2.25rem;
  }

  @media (prefers-color-scheme: dark) {
    background: linear-gradient(135deg, #a39dc9 0%, #78729f 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`

const Card = styled.div`
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;

  @media (min-width: 40rem) {
    padding: 2rem;
    border-radius: 20px;
  }

  @media (prefers-color-scheme: dark) {
    background: #2a2a2a;
    border-color: rgba(255, 255, 255, 0.1);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  }
`

const CardTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 0 1.25rem 0;
  color: #222;

  @media (min-width: 40rem) {
    font-size: 1.5rem;
  }

  @media (prefers-color-scheme: dark) {
    color: #e5e5e5;
  }
`

const InputRow = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: stretch;
`

const InputWrapper = styled.div`
  position: relative;
  flex: 1;
`

const TextInput = styled.input`
  appearance: none;
  width: 100%;
  box-sizing: border-box;
  border: 2px solid transparent;
  border-radius: 12px;
  padding: 0.85rem 1rem;
  font-size: 1rem;
  background-color: #f5f5f5;
  transition: all 0.2s ease;

  &::placeholder {
    color: #999;
  }

  &:focus {
    outline: none;
    border-color: var(--accent-color);
    background-color: white;
    box-shadow: 0 0 0 4px rgba(64, 61, 88, 0.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (prefers-color-scheme: dark) {
    background-color: #2a2a2a;
    color: white;
    border-color: transparent;

    &::placeholder {
      color: #666;
    }

    &:focus {
      background-color: #333;
      border-color: var(--accent-color);
      box-shadow: 0 0 0 4px rgba(120, 114, 159, 0.15);
    }
  }
`

const CreateButton = styled.button`
  appearance: none;
  border: none;
  border-radius: 12px;
  padding: 0.875rem 1.5rem;
  font-size: 1rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--accent-color) 0%, #5a5479 100%);
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  white-space: nowrap;

  @media (min-width: 40rem) {
    padding: 0.85rem 2rem;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.2) 0%,
      transparent 100%
    );
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(64, 61, 88, 0.3);

    &::before {
      opacity: 1;
    }
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (prefers-color-scheme: dark) {
    background: linear-gradient(135deg, #78729f 0%, #5a5479 100%);

    &:hover:not(:disabled) {
      box-shadow: 0 8px 20px rgba(120, 114, 159, 0.3);
    }
  }
`

const ConversationsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

const ListCell = styled.div`
  box-sizing: border-box;
  padding: 1.25rem 1.5rem;
  background: linear-gradient(135deg, #ffffff 0%, #fafafa 100%);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04);
  border-radius: 14px;
  border: 2px solid rgba(0, 0, 0, 0.04);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: linear-gradient(135deg, var(--accent-color) 0%, #5a5479 100%);
    opacity: 0;
    transition: opacity 0.25s ease;
  }

  &:hover {
    border-color: var(--accent-color);
    box-shadow: 0 8px 24px rgba(64, 61, 88, 0.15),
      0 2px 8px rgba(64, 61, 88, 0.08);
    transform: translateX(4px);

    &::before {
      opacity: 1;
    }
  }

  &:active {
    transform: translateX(2px) scale(0.99);
  }

  @media (prefers-color-scheme: dark) {
    background: linear-gradient(135deg, #2d2d2d 0%, #262626 100%);
    border-color: rgba(255, 255, 255, 0.08);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4), 0 1px 2px rgba(0, 0, 0, 0.2);

    &:hover {
      border-color: var(--accent-color);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5),
        0 2px 8px rgba(120, 114, 159, 0.2);
    }
  }
`

const ConversationInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
  min-width: 0;
`

const ListCellTitle = styled.span`
  font-size: 1.05rem;
  font-weight: 600;
  color: #1a1a1a;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (prefers-color-scheme: dark) {
    color: #f0f0f0;
  }
`

const ExpiryBadge = styled.div`
  padding: 0.4rem 0.75rem;
  background: rgba(64, 61, 88, 0.08);
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--accent-color);
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 0.35rem;

  @media (prefers-color-scheme: dark) {
    background: rgba(120, 114, 159, 0.15);
    color: #a39dc9;
  }
`

const ListFooter = styled.div`
  text-align: center;
  font-size: 0.875rem;
  margin: 2.5rem auto 0 auto;
  line-height: 1.5;
  color: #666;

  @media (prefers-color-scheme: dark) {
    color: #999;
  }
`

const LogoutButton = styled.button`
  appearance: none;
  border: none;
  border-radius: 12px;
  padding: 0.625rem 1rem;
  font-size: 0.9rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--accent-color) 0%, #5a5479 100%);
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(64, 61, 88, 0.3);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (prefers-color-scheme: dark) {
    background: linear-gradient(135deg, #78729f 0%, #5a5479 100%);

    &:hover:not(:disabled) {
      box-shadow: 0 4px 12px rgba(120, 114, 159, 0.3);
    }
  }
`

const ErrorText = styled.div`
  font-size: 0.875rem;
  color: #c72c41;
  font-weight: 500;
  padding: 0.75rem 1rem;
  background-color: rgba(199, 44, 65, 0.1);
  border-radius: 8px;
  border-left: 3px solid #c72c41;
  margin-bottom: 1rem;
`

const HelperText = styled.div`
  font-size: 0.95rem;
  margin: 2rem auto 0;
  text-align: center;
  color: #666;

  @media (prefers-color-scheme: dark) {
    color: #999;
  }
`

const LoadingText = styled.div`
  font-size: 0.95rem;
  text-align: center;
  margin: 2rem auto;
  color: #666;

  @media (prefers-color-scheme: dark) {
    color: #999;
  }
`

const PrevousChatCell = ({
  convoId,
  name,
  daysRemaining,
}: {
  convoId: string
  name: string
  daysRemaining: number
}) => {
  return (
    <Link to={`/${convoId}`} style={{ textDecoration: 'none' }}>
      <ListCell>
        <ConversationInfo>
          <ListCellTitle>{name}</ListCellTitle>
        </ConversationInfo>
        <ExpiryBadge>
          ⏱ {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'}
        </ExpiryBadge>
      </ListCell>
    </Link>
  )
}

export default function NewConversation() {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const authState = useSelector((state: RootState) => state.auth)

  const [isSocketConnected, setIsSocketConnected] = useState(socket.connected)
  const [convoName, setConvoName] = useState('')
  const [previousConvos, setPreviousConvos] = useState<
    StoredConversationType[]
  >([])
  const [isFetchingConvos, setIsFetchingConvos] = useState(false)
  const [convoError, setConvoError] = useState<string | null>(null)
  const [isCreatingConvo, setIsCreatingConvo] = useState(false)

  const isLoggedIn = Boolean(authState.accessToken)

  useEffect(() => {
    const onConnect = () => setIsSocketConnected(true)
    const onDisconnect = () => setIsSocketConnected(false)
    const onConnectError = (error: Error) => {
      console.error('Socket connection error:', error)
      setIsSocketConnected(false)
    }

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)
    socket.on('connect_error', onConnectError)

    // Check current state after setting up listeners to avoid race condition
    if (socket.connected) {
      setIsSocketConnected(true)
    }

    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      socket.off('connect_error', onConnectError)
    }
  }, [])

  useEffect(() => {
    if (!isLoggedIn) {
      setPreviousConvos([])
      setConvoError(null)
    }
  }, [isLoggedIn])

  const normalizeConversations = useCallback(
    (payload: {
      conversations: Array<{
        id: string
        name: string
        createdAt: string
        updatedAt: string
        creatorId: string
        deletionDate: string
      }>
    }): StoredConversationType[] => {
      return payload.conversations.map((convo) => ({
        convoId: convo.id,
        name: convo.name,
        dateStored: new Date(convo.updatedAt),
        deletionDate: new Date(convo.deletionDate),
      }))
    },
    []
  )

  const fetchConversations = useCallback(() => {
    if (!isLoggedIn) {
      return
    }

    setIsFetchingConvos(true)
    setConvoError(null)

    if (isSocketConnected) {
      socket.emit('list-conversations', { token: '' }, (response: unknown) => {
        setIsFetchingConvos(false)

        if (!response || typeof response !== 'object') {
          setConvoError('Invalid response from server.')
          setPreviousConvos([])
          return
        }

        const ackResponse = response as {
          success?: boolean
          data?: unknown
          error?: unknown
        }

        if (!ackResponse.success) {
          setConvoError(
            String(ackResponse.error || 'Failed to load conversations.')
          )
          setPreviousConvos([])
          return
        }

        const normalized = normalizeConversations(ackResponse.data as any)
        setPreviousConvos(normalized)
        setConvoError(null)
      })
    } else {
      setConvoError('Waiting for connection...')
      setIsFetchingConvos(false)
    }
  }, [isLoggedIn, isSocketConnected, normalizeConversations])

  useEffect(() => {
    if (!isLoggedIn) {
      return
    }

    if (isSocketConnected) {
      fetchConversations()
    }
  }, [fetchConversations, isLoggedIn, isSocketConnected])

  const submitHandler = () => {
    if (!isLoggedIn || !convoName.trim() || isCreatingConvo) {
      return
    }

    // Check socket connection before attempting to create conversation
    if (!isSocketConnected) {
      setConvoError('Not connected to server. Please try again.')
      return
    }

    setIsCreatingConvo(true)
    setConvoError(null)

    // Track whether the request has timed out to ignore delayed responses
    let hasTimedOut = false

    // Set a timeout to reset the creating state if no response is received
    const timeoutId = setTimeout(() => {
      hasTimedOut = true
      setIsCreatingConvo(false)
      setConvoError(
        'Request timed out. Please check your connection and try again.'
      )
    }, 10000) // 10 second timeout

    socket.emit(
      'create-conversation',
      {
        name: convoName.trim(),
        token: authState.accessToken || undefined,
      },
      (response: any) => {
        clearTimeout(timeoutId)

        // Ignore response if we've already timed out
        if (hasTimedOut) {
          return
        }

        setIsCreatingConvo(false)

        if (!response.success) {
          setConvoError(
            response.error || 'Unable to create conversation. Please try again.'
          )
          return
        }

        const conversation = response.data.conversation
        setConvoName('')
        fetchConversations()
        navigate(`/${conversation.id}`)
      }
    )
  }

  const inputContainer = (
    <InputRow>
      <InputWrapper>
        <TextInput
          type='text'
          placeholder='Enter a name for your conversation'
          value={convoName}
          disabled={!isLoggedIn || isCreatingConvo || authState.isLoading}
          onChange={(e) => setConvoName(e.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              submitHandler()
            }
          }}
        />
      </InputWrapper>
      <CreateButton
        onClick={submitHandler}
        disabled={!isLoggedIn || isCreatingConvo || authState.isLoading}
      >
        {isCreatingConvo ? 'Creating…' : 'Create'}
      </CreateButton>
    </InputRow>
  )

  const handleLogOut = () => {
    dispatch(logOut())
    setConvoName('')
  }

  return (
    <Content>
      <PageHeader>
        <Brand>OneTimeChat</Brand>
        <LogoutButton onClick={handleLogOut} disabled={authState.isLoading}>
          {authState.isLoading ? 'Logging out…' : 'Log Out'}
        </LogoutButton>
      </PageHeader>

      <Card>
        <CardTitle>New Conversation</CardTitle>
        {inputContainer}
        {convoError && <ErrorText>{convoError}</ErrorText>}
      </Card>

      <Card>
        <CardTitle>Your Conversations</CardTitle>
        {isFetchingConvos && <LoadingText>Loading conversations…</LoadingText>}
        {!isFetchingConvos && !convoError && previousConvos.length > 0 && (
          <ConversationsList>
            {previousConvos.map((c) => (
              <PrevousChatCell
                key={c.convoId}
                convoId={c.convoId}
                name={c.name}
                daysRemaining={getDaysRemaining(new Date(), c.deletionDate)}
              />
            ))}
          </ConversationsList>
        )}
        {!isFetchingConvos && !previousConvos.length && !convoError && (
          <HelperText>You have not created any conversations yet.</HelperText>
        )}
      </Card>

      <ListFooter>
        Conversations disappear 30 days after the last message was sent. Anyone
        with a link can see and send messages.
      </ListFooter>
    </Content>
  )
}
