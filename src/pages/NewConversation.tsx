/// <reference types="vite-plugin-svgr/client" />

import { useState, useEffect, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import socket from '../util/socket'
import getDaysRemaining from '../util/daysRemaining'
import { StoredConversationType } from '../types'
import { ComposeInput } from '../components/ComposeBox'
import IconButton from '../components/IconButton'
import LoginSignup from '../components/LoginSignup'
import { logOut } from '../store/slices/auth'
import type { RootState, AppDispatch } from '../store/store'

import CreationSVG from '../assets/creation.svg?react'

const Header = styled.div`
  background-color: var(--accent-color);
  padding: 16px 8px 16px 8px;
  box-shadow: 0px 2px 2px #cccccc;
  background-color: white;

  @media (prefers-color-scheme: dark) {
    background-color: rgb(30, 30, 30);
    box-shadow: 0px 2px 2px black;
  }

  @media (min-width: 40rem) {
    padding: 24px 8px 16px 8px;
  }
`

const Content = styled.div`
  margin: 0;
  padding: 8px;
`

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 40rem;
  margin: 0 auto;
  gap: 1rem;
`

const Brand = styled.div`
  font-size: 2rem;
  font-weight: 700;
`

const Title = styled.div`
  text-align: left;
  font-size: 2.5rem;
  font-weight: 700;
  margin: 2rem auto 1.5rem auto;
  max-width: 40rem;

  @media (min-width: 40rem) {
    font-size: 3rem;
  }
`

const LandingContainer = styled.div`
  box-sizing: border-box;
  max-width: 40rem;
  margin: 0 auto;

  @media (max-width: 40rem) {
    padding: 0 1rem;
  }
`

const TwoColumnLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 2rem;
  margin-top: 3rem;

  @media (max-width: 40rem) {
    grid-template-columns: 1fr;
    margin-top: 1.5rem;
  }
`

const FeatureCell = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: 100%;

  @media (max-width: 40rem) {
    display: block;
    height: auto;
    margin-bottom: 2rem;
  }
`

const AuthCell = styled.div`
  flex: 1;
  max-width: 32rem;

  @media (max-width: 40rem) {
    flex: 0 0 28rem;
  }
`

const Tagline = styled.div`
  font-size: 1.1rem;
  margin-bottom: 1rem;
  color: #666;
  font-weight: 400;

  @media (prefers-color-scheme: dark) {
    color: #aaa;
  }
`

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;

  & li {
    font-size: 1rem;
    font-weight: 400;
    margin-bottom: 1rem;
    padding-left: 1.5rem;
    position: relative;

    &:before {
      content: '✓';
      position: absolute;
      left: 0;
      color: var(--accent-color);
      font-weight: 700;
      font-size: 1.1rem;
    }
  }
`

const Subtitle = styled.div`
  text-align: left;
  font-size: 1.3rem;
  font-weight: 700;
  margin: 1rem auto 0.5rem auto;
  max-width: 40rem;
`

const InputContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 44px;
  grid-template-rows: 44px;
  column-gap: 8px;
  margin: 0 auto 2rem auto;
  max-width: 40rem;
`

const CreateInput = styled(ComposeInput)`
  width: calc(100% - 32px);

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const ListCell = styled.div`
  box-sizing: border-box;
  margin: 8px auto;
  padding: 12px;
  background-color: var(--content-background);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
  border-radius: 12px;
  max-width: 40rem;

  @media (prefers-color-scheme: dark) {
    background-color: #333333;
  }
`

const ListCellTitle = styled.span`
  font-size: 1rem;
  font-weight: 400;
  color: black;

  @media (prefers-color-scheme: dark) {
    color: white;
  }
`

const ListCellSubtitle = styled.span`
  font-size: 0.8rem;
  font-weight: 400;
  color: gray;
  float: right;
`

const ListFooter = styled.div`
  text-align: center;
  font-size: 0.8rem;
  margin: 2rem auto 0 auto;
  line-height: 1rem;
  padding: 0 2rem;
  max-width: 40rem;
`

const CreationIcon = styled(CreationSVG)`
  path {
    fill: white;
  }
`

const LogoutButton = styled.button`
  appearance: none;
  border: none;
  border-radius: 999px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  font-weight: 700;
  background-color: var(--accent-color);
  color: white;
  cursor: pointer;
  transition: transform 0.1s ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

const ErrorText = styled.div`
  font-size: 0.85rem;
  color: #c72c41;
  font-weight: 500;
`

const HelperText = styled.div`
  font-size: 0.95rem;
  margin: 1.5rem auto 0;
  text-align: center;
  max-width: 32rem;
`

const LoadingText = styled.div`
  font-size: 0.95rem;
  text-align: center;
  margin: 1.5rem auto;
  color: gray;
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
        <ListCellTitle>{name}</ListCellTitle>
        <ListCellSubtitle>{`${daysRemaining} ${
          daysRemaining === 1 ? 'day' : 'days'
        } left`}</ListCellSubtitle>
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
    <InputContainer>
      <CreateInput
        type='text'
        placeholder='Conversation Name'
        value={convoName}
        disabled={!isLoggedIn || isCreatingConvo || authState.isLoading}
        onChange={(e) => setConvoName(e.target.value)}
        onKeyDownCapture={(event) => {
          if (event.key === 'Enter') {
            submitHandler()
          }
        }}
      />
      <IconButton
        icon={<CreationIcon style={{ transform: 'translate(-1px, 2px)' }} />}
        onClick={submitHandler}
        hasBorders={true}
        backgroundColor='var(--accent-color)'
        disabled={!isLoggedIn || isCreatingConvo || authState.isLoading}
      />
    </InputContainer>
  )

  const handleLogOut = () => {
    dispatch(logOut())
    setConvoName('')
  }

  if (!isLoggedIn) {
    return (
      <Content>
        <LandingContainer>
          <Title>OneTimeChat</Title>
          <Tagline>
            Team messaging that doesn't require everyone to sign up or download
            an app
          </Tagline>
          <TwoColumnLayout>
            <FeatureCell>
              <FeatureList>
                <li>Create conversations and share them with a simple link</li>
                <li>
                  Anyone with the link can join instantly — no account needed
                </li>
                <li>Messages are accessible from any device, any browser</li>
                <li>Conversations auto-expire 30 days after last activity</li>
              </FeatureList>
            </FeatureCell>
            <AuthCell>
              <LoginSignup />
            </AuthCell>
          </TwoColumnLayout>
        </LandingContainer>
      </Content>
    )
  }

  return (
    <>
      <Header>
        <HeaderRow>
          <Brand>OneTimeChat</Brand>
          <LogoutButton onClick={handleLogOut} disabled={authState.isLoading}>
            {authState.isLoading ? 'Logging out…' : 'Log Out'}
          </LogoutButton>
        </HeaderRow>
      </Header>
      <Content>
        <Subtitle>New Chat</Subtitle>
        {inputContainer}
        <Subtitle>Previous Chats</Subtitle>
        {isFetchingConvos && <LoadingText>Loading conversations…</LoadingText>}
        {convoError && <ErrorText>{convoError}</ErrorText>}
        {previousConvos.map((c) => (
          <PrevousChatCell
            key={c.convoId}
            convoId={c.convoId}
            name={c.name}
            daysRemaining={getDaysRemaining(new Date(), c.deletionDate)}
          />
        ))}
        {!isFetchingConvos && !previousConvos.length && !convoError && (
          <HelperText>
            You have no saved conversations yet. Create a new chat above or ask
            a teammate to send you an invite link.
          </HelperText>
        )}
        <ListFooter>
          Conversations dissapear 30 days after the last message was sent.
          Anyone with a link can see and send messages.
        </ListFooter>
      </Content>
    </>
  )
}
