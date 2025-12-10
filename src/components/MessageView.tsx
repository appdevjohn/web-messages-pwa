import styled from 'styled-components'

import { MessageType } from '../types'
import ICON_MAP from '../util/profileIcons'

const TextBubble = styled.div<{ $highlighted?: boolean; $delivered?: boolean }>`
  display: inline-block;
  background: ${(props) =>
    props.$highlighted
      ? `linear-gradient(135deg, var(--accent-color) 0%, #5a5479 100%)`
      : props.$delivered
      ? 'var(--content-background)'
      : 'gray'};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border-radius: 20px;
  padding: 10px 14px;
  margin-top: 4px;
  font-size: 16px;
  overflow-wrap: break-word;
  hyphens: auto;
  color: ${(props) => (props.$highlighted ? 'white' : 'initial')};

  @media (prefers-color-scheme: dark) {
    background: ${(props) =>
      props.$highlighted
        ? `linear-gradient(135deg, #78729f 0%, #5a5479 100%)`
        : props.$delivered
        ? 'var(--content-background)'
        : 'gray'};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    color: #dcd8d3;
  }
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
  flex-shrink: 0;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-right: 8px;
  height: 44px;
  width: 44px;
  border-radius: 22px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background-color: var(--content-background);

  & img {
    object-fit: contain;
    height: 32px;
    width: 32px;
  }

  @media (prefers-color-scheme: dark) {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);

    & img {
      filter: brightness(0) invert(1) opacity(0.6);
    }
  }
`

const BlockSenderName = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #666;
  margin-bottom: 2px;

  @media (prefers-color-scheme: dark) {
    color: #999;
  }
`

const View = styled.div<{ $margin?: string }>`
  width: 100%;
  margin: ${(props) => props.$margin || '82px auto 92px auto'};
  max-width: 40rem;

  @media (min-width: 40rem) {
    margin: ${(props) => props.$margin || '82px auto 124px auto'};
  }
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
  senderIcon: string
  highlighted: boolean
  messages: { content: string; type: string; delivered: string; id: string }[]
}

type ViewProps = {
  messages: MessageType[]
  highlightId: string
  showLoadOlderMessagesButton: boolean
  onLoadOlderMessages: () => void
  isLoadingOlderMessages: boolean
  margin?: string
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

const MessageBlock = ({
  senderName,
  senderIcon,
  highlighted,
  messages,
}: BlockProps) => {
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
        <img src={ICON_MAP[senderIcon]} alt='Profile' />
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
  margin,
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
    <View $margin={margin}>
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
            senderIcon={block.senderImg}
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
