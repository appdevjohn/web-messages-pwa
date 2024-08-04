import { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'

import { MessageType, MessagesPayloadType } from '../types'
import getDaysRemaining from '../util/daysRemaining'
import socket from '../util/socket'
import UserContext from '../util/userContext'
import MessageView from '../components/MessageView'
import NavBar from '../components/NavBar'
import ComposeBox from '../components/ComposeBox'
import EditProfile from '../components/EditProfile'

const ErrorViewContainer = styled.div`
  margin: 6rem auto 0 auto;
  text-align: center;
  max-width: 300px;
`

const ErrorViewTitle = styled.div`
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 1rem;
`

const ErrorViewMessage = styled.div`
  font-size: 0.8rem;
  font-weight: 400;
`

const ShareChatContainer = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 80vh;
  width: 100%;
  padding: 2rem;
`

const ShareChatLabel = styled.div`
  font-size: 0.8rem;
  text-align: center;
  font-weight: 700;
  color: gray;
  margin-bottom: 1rem;
`

const ShareChatButton = styled.button`
  appearance: none;
  border: none;
  font-size: 1rem;
  font-weight: 700;
  background-color: transparent;
  color: var(--accent-color);
  cursor: pointer;
`

function ErrorView({ title, message }: { title: string; message: string }) {
  return (
    <ErrorViewContainer>
      <ErrorViewTitle>{title}</ErrorViewTitle>
      <ErrorViewMessage>{message}</ErrorViewMessage>
    </ErrorViewContainer>
  )
}

function ShareChat() {
  return (
    <ShareChatContainer>
      <ShareChatLabel>
        Share the link to this chat to anyone you want to include.
      </ShareChatLabel>
      <ShareChatButton
        onClick={() => navigator.share({ url: window.location.href })}
      >
        Share Chat
      </ShareChatButton>
    </ShareChatContainer>
  )
}

export default function ConversationView() {
  const { convoId } = useParams()
  const [user, setUser] = useContext(UserContext)
  const [shouldEditUser, setShouldEditUser] = useState(false)

  const [isConnected, setIsConnected] = useState(socket.connected)
  const [convoName, setConvoName] = useState('')
  const [deletionDate, setDeletionDate] = useState<Date>()
  const [messages, setMessages] = useState<MessageType[]>([])
  const [sendingMessage, setSendingMessage] = useState<MessageType>()
  const daysRemaining = deletionDate
    ? getDaysRemaining(new Date(), deletionDate)
    : undefined

  const [doesChatExist, setDoesChatExist] = useState<boolean>()

  // Handle WebSocket events.
  useEffect(() => {
    const onError = (errorMessage: string) => {
      if (errorMessage === 'Error: There is no conversation with that ID.') {
        setDoesChatExist(false)
      }
    }
    const onConnect = () => setIsConnected(true)
    const onDisconnect = () => setIsConnected(false)
    const onMessages = (payload: MessagesPayloadType) => {
      const parsedMessages: MessageType[] = payload.messages.map((msg) => ({
        id: msg['id'],
        userId: `${msg['senderName']}-${msg['senderAvatar']}`,
        timestamp: new Date(msg['createdAt']),
        content: msg['content'],
        type: msg['type'],
        userProfilePic: msg['senderAvatar'],
        userFullName: msg['senderName'],
        delivered: 'delivered',
      }))
      setMessages(parsedMessages)
      setConvoName(payload.conversation['name'])
      setDeletionDate(new Date(payload.deletionDate))
      setDoesChatExist(true)
    }
    const onResponse = (payload: any) => {
      const eventType = payload['event']
      switch (eventType) {
        case 'send-message':
          break
        case 'create-conversation':
          break
        case 'delete-conversation':
          break

        default:
          break
      }
    }
    const onUpdate = (newMessage: any) => {
      setMessages((msgs) => {
        const messagesCopy = msgs.map((m) => ({ ...m }))
        messagesCopy.push({
          id: newMessage['id'],
          userId: `${newMessage['senderName']}-${newMessage['senderAvatar']}`,
          timestamp: new Date(newMessage['createdAt']),
          content: newMessage['content'],
          type: newMessage['type'],
          userProfilePic: newMessage['senderAvatar'],
          userFullName: newMessage['senderName'],
          delivered: 'delivered',
        })
        return messagesCopy
      })
    }

    socket.on('error', onError)
    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)
    socket.on('messages', onMessages)
    socket.on('response', onResponse)
    socket.on(`${convoId}`, onUpdate)

    return () => {
      socket.off('error', onError)
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      socket.off('messages', onMessages)
      socket.off('response', onResponse)
      socket.off(`${convoId}`, onUpdate)
    }
  }, [])

  // Store chat meta data in localStorage.
  useEffect(() => {
    if (convoId && deletionDate) {
      const storedChatStrings = localStorage.getItem('previous-chats')
      const storedChats: string[] = storedChatStrings
        ? JSON.parse(storedChatStrings)
        : []

      if (!storedChats.includes(convoId)) {
        storedChats.push(convoId)
      }

      localStorage.setItem('previous-chats', JSON.stringify(storedChats))
    }
  }, [convoId, deletionDate])

  // Scroll to bottom of page when new messages roll in.
  useEffect(() => {
    window.scrollTo(0, document.body.scrollHeight)
  }, [messages])

  // Fetch messages when connected.
  useEffect(() => {
    socket.emit('get-messages', { convoId: convoId })
  }, [isConnected])

  // Send messages as they appear in the transcript.
  useEffect(() => {
    if (!convoId) return
    if (sendingMessage) {
      socket.emit('send-message', {
        convoId: convoId,
        content: sendingMessage.content,
        userName: user.name,
        userAvatar: user.avatar,
      })
      setSendingMessage(undefined)
    }
  }, [sendingMessage])

  const sendMessageHandler = (messageContent: string) => {
    if (!messageContent) return
    setSendingMessage({
      content: messageContent,
      delivered: 'not-delivered',
      timestamp: new Date(),
      type: 'text',
      userFullName: user.name,
      userProfilePic: user.avatar,
      userId: `${user.name}-${user.avatar}`,
      id: Math.random().toString(),
    })
  }

  return (
    <>
      {(user.name.length === 0 || shouldEditUser) && (
        <EditProfile
          user={user}
          onChangeUser={({ name, avatar }) => {
            setUser({ name, avatar })
            setShouldEditUser(false)
          }}
          onDismiss={() => setShouldEditUser(false)}
        />
      )}
      <div>
        <NavBar
          title={
            doesChatExist === undefined
              ? 'Loading...'
              : doesChatExist
              ? convoName
              : ''
          }
          subtitle={
            doesChatExist
              ? `${daysRemaining} ${
                  daysRemaining === 1 ? 'day' : 'days'
                } remaining`
              : undefined
          }
          onUserClick={() => setShouldEditUser(true)}
          disableEditProfile={!doesChatExist}
        />
        {doesChatExist === false ? (
          <ErrorView
            title={"This is not the converation you're looking for."}
            message={'This chat has either expired or never existed.'}
          />
        ) : messages.length === 0 && !sendingMessage ? (
          <ShareChat />
        ) : (
          <MessageView
            highlightId={`${user.name}-${user.avatar}`}
            isLoadingOlderMessages={false}
            onLoadOlderMessages={() => {}}
            showLoadOlderMessagesButton={false}
            messages={sendingMessage ? [...messages, sendingMessage] : messages}
          />
        )}
        <ComposeBox
          becameActive={() => {}}
          disableUpload={true}
          onUploadFile={() => {}}
          sendMessage={sendMessageHandler}
        />
      </div>
    </>
  )
}
