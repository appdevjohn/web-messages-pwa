import { useState } from 'react'

import { MessageType } from './types'
import MessageView from './components/MessageView'
import ComposeBox from './components/ComposeBox'

function App() {
  const [messages, setMessages] = useState<MessageType[]>([])

  const sendMessageHandler = (messageContent: string) => {
    setMessages((prevMessages) => {
      const copy = prevMessages.map((m) => ({ ...m }))
      return [
        ...copy,
        {
          content: messageContent,
          delivered: 'delivered',
          timestamp: new Date(),
          type: 'text',
          userFullName: 'John Champion',
          userProfilePic: '',
          userId: '1',
          id: String(prevMessages.length),
        },
      ]
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
          messages={messages}
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

export default App
