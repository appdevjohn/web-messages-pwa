import { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'

import { MessageType } from '../types'
import socket from '../util/socket'
import UserContext from '../util/userContext'
import MessageView from '../components/MessageView'
import NavBar from '../components/NavBar'
import ComposeBox from '../components/ComposeBox'
import EditProfile from '../components/EditProfile'
import { MessagesPayloadType } from '../types/index'

export default function ConversationView() {
  const { convoId } = useParams()
  const [user, setUser] = useContext(UserContext)
  const [shouldEditUser, setShouldEditUser] = useState(false)

  const [isConnected, setIsConnected] = useState(socket.connected)
  const [convoName, setConvoName] = useState('')
  const [messages, setMessages] = useState<MessageType[]>([])
  const [sendingMessage, setSendingMessage] = useState<MessageType>()

  // Handle WebSocket events.
  useEffect(() => {
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

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)
    socket.on('messages', onMessages)
    socket.on('response', onResponse)
    socket.on(`${convoId}`, onUpdate)

    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      socket.off('messages', onMessages)
      socket.off('response', onResponse)
      socket.off(`${convoId}`, onUpdate)
    }
  }, [])

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
        />
      )}
      <div>
        <NavBar title={convoName} onUserClick={() => setShouldEditUser(true)} />
        <MessageView
          highlightId={`${user.name}-${user.avatar}`}
          isLoadingOlderMessages={false}
          onLoadOlderMessages={() => {}}
          showLoadOlderMessagesButton={false}
          messages={sendingMessage ? [...messages, sendingMessage] : messages}
        />
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
