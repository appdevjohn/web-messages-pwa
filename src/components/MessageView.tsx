import styled from 'styled-components'

import { MessageType } from '../types'
import emptyProfilePic from '../assets/empty-profile-pic.png'

const TextBubble = styled.div<{ $highlighted?: boolean; $delivered?: boolean }>`
  display: inline-block;
  background-color: ${(props) =>
    props.$highlighted
      ? `var(--accent-color)`
      : props.$delivered
      ? 'var(--content-background)'
      : 'gray'};
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
  border-radius: 20px;
  padding: 8px 12px;
  margin-top: 4px;
  font-size: 16px;
  overflow-wrap: break-word;
  hyphens: auto;
  color: ${(props) => (props.$highlighted ? 'white' : 'initial')};
`

const ImageBubble = styled.div`
  margin-top: 4px;
  max-width: 25rem;
`

const Block = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  margin: 16px 8px;
`

const BlockSenderImage = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  margin-right: 8px;

  & img {
    background-color: var(--content-background);
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
    border-radius: 22px;
    height: 44px;
    width: 44px;
  }
`

const BlockSenderName = styled.div`
  font-size: 12px;
`

const View = styled.div`
  width: calc(100% - 30px);
  margin-bottom: 92px;
  margin-top: 80px;
`

const ViewLoadMessagesButtonContainer = styled.div`
  text-align: center;
  margin: 1rem 0;
`

type BubbleProps = {
  type: string
  highlighted: boolean
  delivered: string
  content: string
}

type BlockProps = {
  senderName: string
  highlighted: boolean
  messages: { content: string; type: string; delivered: string; id: string }[]
}

type ViewProps = {
  messages: MessageType[]
  highlightId: string
  showLoadOlderMessagesButton: boolean
  onLoadOlderMessages: () => void
  isLoadingOlderMessages: boolean
}

const MessageBubble = ({
  type, // 'text', 'image'
  highlighted,
  delivered, // 'delivered', 'delivering', 'not delivered'
  content,
}: BubbleProps) => {
  if (type === 'image') {
    return (
      <ImageBubble>
        <img src={content} alt='Message Attachment' />
      </ImageBubble>
    )
  } else {
    return (
      <div>
        <TextBubble
          $highlighted={highlighted}
          $delivered={delivered == 'delivered'}
        >
          {content}
        </TextBubble>
      </div>
    )
  }
}

const MessageBlock = ({ senderName, highlighted, messages }: BlockProps) => {
  let messageBubbles = messages.map((message) => {
    return (
      <MessageBubble
        content={message.content}
        highlighted={highlighted}
        delivered={message.delivered}
        type={message.type}
        key={message.id}
      />
    )
  })

  return (
    <Block>
      <BlockSenderImage>
        <img src={emptyProfilePic} alt='Profile' />
      </BlockSenderImage>
      <div>
        <BlockSenderName>{senderName}</BlockSenderName>
        {messageBubbles}
      </div>
    </Block>
  )
}

const MessageView = ({
  highlightId,
  isLoadingOlderMessages,
  showLoadOlderMessagesButton,
  onLoadOlderMessages,
  messages,
}: ViewProps) => {
  const sortedMessages = messages
    .map((msg) => ({ ...msg }))
    .sort((a, b) => a.timestamp.valueOf() - b.timestamp.valueOf())

  // Consecutive messages sent from the same sender must be grouped together.
  const messageBlocks = []
  for (let i = 0; i < sortedMessages.length; i++) {
    const message = sortedMessages[i]

    if (
      messageBlocks.length > 0 &&
      messageBlocks[messageBlocks.length - 1].senderId === message.userId &&
      Math.abs(
        messageBlocks[messageBlocks.length - 1].messages[
          messageBlocks[messageBlocks.length - 1].messages.length - 1
        ].timestamp.valueOf() - message.timestamp.valueOf()
      ) < 60000
    ) {
      messageBlocks[messageBlocks.length - 1].messages.push({ ...message })
    } else {
      const newBlock = {
        senderId: message.userId,
        senderImg: message.userProfilePic,
        senderName: message.userFullName,
        messages: [{ ...message }],
      }
      messageBlocks.push(newBlock)
    }
  }

  return (
    <View>
      {showLoadOlderMessagesButton ? (
        <ViewLoadMessagesButtonContainer>
          {isLoadingOlderMessages ? (
            <div>Loading...</div>
          ) : (
            <button className='Button' onClick={onLoadOlderMessages}>
              Load More
            </button>
          )}
        </ViewLoadMessagesButtonContainer>
      ) : null}
      {messageBlocks.map((block) => {
        return (
          <MessageBlock
            senderName={block.senderName}
            messages={block.messages}
            highlighted={block.senderId === highlightId}
            key={JSON.stringify(block.messages)}
          />
        )
      })}
    </View>
  )
}

export default MessageView
