/// <reference types="vite-plugin-svgr/client" />

import { useState, useEffect, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import restAPI from '../util/rest'
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

const AppDetails = styled.div`
  box-sizing: border-box;
  font-size: 1.25rem;
  margin: 2rem auto;
  padding: 0 1rem;
  font-weight: 500;
  max-width: 40rem;

  & li {
    font-size: 1rem;
    font-weight: 400;
    margin: 0.8rem 0;
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

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)

    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
    }
  }, [])

  useEffect(() => {
    if (!isLoggedIn) {
      setPreviousConvos([])
      setConvoError(null)
    }
  }, [isLoggedIn])

  const normalizeConversations = useCallback(
    (payload: unknown): StoredConversationType[] => {
      const candidates = Array.isArray(payload)
        ? payload
        : typeof payload === 'object' && payload
        ? Array.isArray((payload as { conversations?: unknown }).conversations)
          ? (payload as { conversations: unknown[] }).conversations
          : []
        : []

      const parsed = candidates
        .map((raw) => {
          if (!raw || typeof raw !== 'object') {
            return null
          }
          const item = raw as Record<string, unknown>
          const id =
            (typeof item.id === 'string' && item.id) ||
            (typeof item.convoId === 'string' && item.convoId)

          if (!id) {
            return null
          }

          const name =
            (typeof item.name === 'string' && item.name) ||
            'Untitled conversation'
          const updatedAt =
            (typeof item.updatedAt === 'string' && item.updatedAt) ||
            (typeof item.createdAt === 'string' && item.createdAt) ||
            new Date().toISOString()
          const deletion =
            (typeof item.deletionDate === 'string' && item.deletionDate) ||
            (typeof item.expiresAt === 'string' && item.expiresAt) ||
            updatedAt

          const parsedUpdated = new Date(updatedAt)
          const parsedDeletion = new Date(deletion)

          return {
            convoId: id,
            name,
            dateStored: Number.isNaN(parsedUpdated.getTime())
              ? new Date()
              : parsedUpdated,
            deletionDate: Number.isNaN(parsedDeletion.getTime())
              ? new Date()
              : parsedDeletion,
          }
        })
        .filter((value): value is StoredConversationType => Boolean(value))

      return parsed
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
      socket.emit('list-conversations')
    } else {
      setConvoError('Waiting for connection...')
      setIsFetchingConvos(false)
    }
  }, [isLoggedIn, isSocketConnected])

  useEffect(() => {
    if (!isLoggedIn) {
      return
    }

    const onResponse = (payload: unknown) => {
      if (!payload || typeof payload !== 'object') {
        return
      }

      const response = payload as {
        event?: unknown
        data?: unknown
        error?: unknown
        status?: unknown
      }

      if (response.event !== 'list-conversations') {
        return
      }

      setIsFetchingConvos(false)

      if (response.error) {
        setConvoError(String(response.error))
        setPreviousConvos([])
        return
      }

      if (typeof response.status === 'number' && response.status >= 400) {
        setConvoError(
          `Unable to load conversations (status ${response.status}).`
        )
        setPreviousConvos([])
        return
      }

      const normalized = normalizeConversations(response.data)
      setPreviousConvos(normalized)
      setConvoError(null)
    }

    socket.on('response', onResponse)

    if (isSocketConnected) {
      fetchConversations()
    }

    return () => {
      socket.off('response', onResponse)
    }
  }, [
    fetchConversations,
    isLoggedIn,
    isSocketConnected,
    normalizeConversations,
  ])

  const submitHandler = async () => {
    if (!isLoggedIn || !convoName.trim() || isCreatingConvo) {
      return
    }

    try {
      setIsCreatingConvo(true)
      const response = await restAPI.post('/conversation', {
        name: convoName.trim(),
      })

      const conversation = response.data['conversation']
      setConvoName('')
      fetchConversations()
      navigate(`/${conversation['id']}`)
    } catch (error) {
      setConvoError('Unable to create conversation. Please try again.')
    } finally {
      setIsCreatingConvo(false)
    }
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
        <Title>OneTimeChat</Title>
        <AppDetails>
          Stay on top of your team's quick chats without keeping a browser tab
          open.
          <ul>
            <li>Jump into conversations instantly from any device.</li>
            <li>Share rooms with a link and manage membership in one place.</li>
            <li>Conversations expire 30 days after the last activity.</li>
          </ul>
        </AppDetails>
        <LoginSignup />
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
