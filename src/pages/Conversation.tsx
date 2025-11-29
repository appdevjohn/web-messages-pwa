import { useState, useEffect, useContext } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'

import { MessageType } from '../types'
import getDaysRemaining from '../util/daysRemaining'
import socket from '../util/socket'
import UserContext from '../util/userContext'
import MessageView from '../components/MessageView'
import NavBar from '../components/NavBar'
import ComposeBox from '../components/ComposeBox'
import EditProfile from '../components/EditProfile'
import SetupProfileButton from '../components/SetupProfileButton'
import type { RootState } from '../store/store'

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
  const { user: authUser, accessToken } = useSelector(
    (state: RootState) => state.auth
  )
  const [user, setUser] = useContext(UserContext)
  const [shouldEditUser, setShouldEditUser] = useState(false)

  const [isSocketConnected, setIsSocketConnected] = useState(socket.connected)
  const [convoName, setConvoName] = useState('')
  const [deletionDate, setDeletionDate] = useState<Date>()
  const [messages, setMessages] = useState<MessageType[]>([])
  const [doesChatExist, setDoesChatExist] = useState<boolean>()
  const daysRemaining = deletionDate
    ? getDaysRemaining(new Date(), deletionDate)
    : undefined

  // Handle WebSocket events.
  useEffect(() => {
    const onConnect = () => setIsSocketConnected(true)
    const onDisconnect = () => setIsSocketConnected(false)
    const onMessageCreated = (payload: any) => {
      const newMessageConvoId = payload.convoId
      if (newMessageConvoId !== convoId) return // Ignore messages for other conversations

      const newMessage = payload.message
      setMessages((msgs) => {
        const messagesCopy = msgs.map((m) => ({ ...m }))
        messagesCopy.push({
          id: newMessage['id'],
          userId:
            newMessage['senderId'] ||
            `${newMessage['senderName']}-${newMessage['senderAvatar']}`,
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
    const onConversationUpdated = (payload: any) => {
      setConvoName(payload.conversation['name'])
      setDeletionDate(new Date(payload.deletionDate))
    }

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)
    socket.on('message-created', onMessageCreated)
    socket.on('conversation-updated', onConversationUpdated)

    // Check current state after setting up listeners to avoid race condition
    if (socket.connected) {
      setIsSocketConnected(true)
    }

    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      socket.off('message-created', onMessageCreated)
      socket.off('conversation-updated', onConversationUpdated)
    }
  }, [])

  // Scroll to bottom of page when new messages roll in.
  useEffect(() => {
    window.scrollTo(0, document.body.scrollHeight)
  }, [messages])

  // Update messages when logged-in user's profile changes
  useEffect(() => {
    if (!authUser) return

    setMessages((prevMessages) => {
      return prevMessages.map((msg) => {
        // Only update messages from the logged-in user
        if (msg.userId === authUser.id) {
          return {
            ...msg,
            userProfilePic: authUser.profilePicURL,
            userFullName: authUser.displayName,
          }
        }
        return msg
      })
    })
  }, [authUser?.profilePicURL, authUser?.displayName])

  // Join conversation and fetch messages when connected.
  useEffect(() => {
    if (!isSocketConnected || !convoId) return

    // Join the conversation room to receive real-time updates
    socket.emit('join-conversation', { convoId }, (response: any) => {
      if (!response.success) {
        /*
          IMPORTANT:
          A response will still succeed even if the conversation does not exist.
          The 'list-messages' call below will return an error in that case.
          Joining a room only means you want to listen for updates to that room,
          it does not validate the room's existence.
        */
        console.error('Failed to join conversation:', response.error)
        return
      }

      // Fetch messages for this conversation
      socket.emit('list-messages', { convoId }, (response: any) => {
        if (!response.success) {
          if (response.error?.includes('no conversation')) {
            setDoesChatExist(false)
          }
          console.error('Failed to fetch messages:', response.error)
          return
        }

        const parsedMessages: MessageType[] = response.data.messages.map(
          (msg: any) => ({
            id: msg['id'],
            userId:
              msg['senderId'] || `${msg['senderName']}-${msg['senderAvatar']}`,
            timestamp: new Date(msg['createdAt']),
            content: msg['content'],
            type: msg['type'],
            userProfilePic: msg['senderAvatar'],
            userFullName: msg['senderName'],
            delivered: 'delivered',
          })
        )
        setMessages(parsedMessages)
        setConvoName(response.data.conversation['name'])
        setDeletionDate(new Date(response.data.deletionDate))
        setDoesChatExist(true)
      })
    })

    // Cleanup: Leave the conversation room when component unmounts or convoId changes
    return () => {
      socket.emit('leave-conversation', { convoId })
    }
  }, [isSocketConnected, convoId])

  const sendMessageHandler = (messageContent: string) => {
    if (!messageContent || !convoId) return

    const senderName = authUser?.displayName || user.name
    const senderAvatar = authUser?.profilePicURL || user.avatar

    // Send message to server - it will be added to UI via 'message-created' broadcast
    socket.emit(
      'create-message',
      {
        convoId: convoId,
        content: messageContent,
        userName: senderName,
        userAvatar: senderAvatar,
        token: accessToken, // Server should automatically use logged-in user if token is provided
      },
      (response: any) => {
        if (!response.success) {
          console.error('Failed to send message:', response.error)
          // TODO: Show error to user
          return
        }
        // Message successfully sent and will appear via 'message-created' event
      }
    )
  }

  return (
    <>
      {shouldEditUser && (
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
          userName={authUser?.displayName || user.name}
          userAvatar={authUser?.profilePicURL || user.avatar}
          isAnonymous={!authUser}
        />
        {doesChatExist === false ? (
          <ErrorView
            title={"This is not the converation you're looking for."}
            message={'This chat has either expired or never existed.'}
          />
        ) : messages.length === 0 ? (
          <ShareChat />
        ) : (
          <MessageView
            highlightId={authUser?.id || `${user.name}-${user.avatar}`}
            isLoadingOlderMessages={false}
            onLoadOlderMessages={() => {}}
            showLoadOlderMessagesButton={false}
            messages={messages}
          />
        )}
        {!authUser && user.name.length === 0 ? (
          <SetupProfileButton onClick={() => setShouldEditUser(true)} />
        ) : (
          <ComposeBox
            becameActive={() => {}}
            disableUpload={true}
            onUploadFile={() => {}}
            sendMessage={sendMessageHandler}
          />
        )}
      </div>
    </>
  )
}
