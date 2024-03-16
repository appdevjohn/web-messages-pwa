import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { MessageType } from '../types'
import socket from '../util/socket'
import MessageView from '../components/MessageView'
import ComposeBox from '../components/ComposeBox'

export default function ConversationView() {
  const { convoId } = useParams()

  const [isConnected, setIsConnected] = useState(socket.connected)
  const [messages, setMessages] = useState<MessageType[]>([])
  const [sendingMessage, setSendingMessage] = useState<MessageType>()

  // Handle WebSocket events.
  useEffect(() => {
    const onConnect = () => setIsConnected(true)
    const onDisconnect = () => setIsConnected(false)
    const onMessages = (msgs: any[]) => {
      const parsedMessages: MessageType[] = msgs.map((msg) => ({
        id: msg['id'],
        userId: 'TODO',
        timestamp: msg['createdAt'],
        content: msg['content'],
        type: msg['type'],
        userProfilePic: '',
        userFullName: 'TODO',
        delivered: 'delivered',
      }))
      setMessages(parsedMessages)
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
        const messagesCopy = JSON.parse(JSON.stringify(msgs))
        messagesCopy.push({
          id: newMessage['id'],
          userId: 'TODO',
          timestamp: newMessage['createdAt'],
          content: newMessage['content'],
          type: newMessage['type'],
          userProfilePic: '',
          userFullName: 'TODO',
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
      userFullName: 'TODO',
      userProfilePic: '',
      userId: 'TODO',
      id: Math.random().toString(),
    })
  }

  return (
    <>
      <div>
        <MessageView
          highlightId='1'
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
