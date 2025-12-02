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
import {
  Card,
  PrimaryButton,
  TextInput,
  ErrorText,
  HelperText,
  gradientTextStyle,
} from '../components/shared/StyledComponents'

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
  ${gradientTextStyle}

  @media (min-width: 40rem) {
    font-size: 2.25rem;
  }
`

const StyledCard = styled(Card)`
  padding: 1.5rem;
  margin-bottom: 2rem;

  @media (min-width: 40rem) {
    padding: 2rem;
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

const CreateButton = styled(PrimaryButton)`
  white-space: nowrap;

  @media (min-width: 40rem) {
    padding: 0.85rem 2rem;
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

const LogoutButton = styled(PrimaryButton)`
  padding: 0.625rem 1rem;
  font-size: 0.9rem;
`

const StyledErrorText = styled(ErrorText)`
  margin-bottom: 1rem;
`

const StyledHelperText = styled(HelperText)`
  margin: 2rem auto 0;
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

      <StyledCard>
        <CardTitle>New Conversation</CardTitle>
        {inputContainer}
        {convoError && <StyledErrorText>{convoError}</StyledErrorText>}
      </StyledCard>

      <StyledCard>
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
          <StyledHelperText>You have not created any conversations yet.</StyledHelperText>
        )}
      </StyledCard>

      <ListFooter>
        Conversations disappear 30 days after the last message was sent. Anyone
        with a link can see and send messages.
      </ListFooter>
    </Content>
  )
}
