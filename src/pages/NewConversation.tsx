import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import styled from 'styled-components'

import restAPI from '../util/rest'
import getDaysRemaining from '../util/daysRemaining'
import { StoredConversationType } from '../types'
import { ComposeInput } from '../components/ComposeBox'

import creation from '../assets/creation.svg'

const Header = styled.div`
  background-color: var(--accent-color);
  padding: 16px 8px 16px 8px;
  box-shadow: 0px 2px 2px #cccccc;
  background-color: white;

  @media (prefers-color-scheme: dark) {
    background-color: rgb(30, 30, 30);
    box-shadow: 0px 2px 2px black;
  }
`

const Content = styled.div`
  margin: 0;
  padding: 8px;
`

const Title = styled.div<{ $extended?: boolean }>`
  text-align: left;
  font-size: ${(props) => (props.$extended ? '2.5rem' : '2rem')};
  font-weight: 700;
  margin: ${(props) => (props.$extended ? '2rem 0 1.5rem 0' : 'inherit')};
`

const Subtitle = styled.div`
  text-align: left;
  font-size: 1.3rem;
  font-weight: 700;
  margin: 1rem 0 0.5rem 0;
`

const InputContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 44px;
  grid-template-rows: 44px;
  column-gap: 8px;
  margin-bottom: 2rem;
`

const CreateInput = styled(ComposeInput)`
  width: calc(100% - 32px);
`

const Button = styled.button`
  appearance: none;
  background-color: var(--accent-color);
  color: white;
  border-radius: 22px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
  border: none;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  cursor: pointer;
  padding: 0;

  & img {
    height: 26px;
    width: 26px;
    object-fit: contain;
    transform: translate(-1px, 2px);
  }
`

const ListCell = styled.div`
  margin: 8px 0;
  padding: 12px;
  background-color: var(--content-background);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
  border-radius: 12px;

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
  margin-top: 2rem;
  line-height: 1rem;
  padding: 0 2rem;
`

const AppDetails = styled.div`
  font-size: 1.25rem;
  margin: 2rem 1rem;
  font-weight: 500;

  & li {
    font-size: 1rem;
    font-weight: 400;
    margin: 0.8rem 0;
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

  const [convoName, setConvoName] = useState('')
  const [previousConvos, setPreviousConvos] = useState<
    StoredConversationType[]
  >([])

  useEffect(() => {
    const previousChatString = localStorage.getItem('previous-chats')
    const previousChatsIDs: string[] = previousChatString
      ? JSON.parse(previousChatString)
      : []

    const getConvoData = async (
      convoId: string
    ): Promise<StoredConversationType> => {
      try {
        const response = await restAPI.get(`/conversation/${convoId}`)
        return {
          convoId: response.data['conversation']['id'],
          name: response.data['conversation']['name'],
          dateStored: new Date(response.data['conversation']['updatedAt']),
          deletionDate: new Date(response.data['deletionDate']),
        }
      } catch (error: any) {
        if (
          error.response?.data?.['errorMessage'] ===
          'This conversation has been deleted.'
        ) {
          throw new Error('This conversation has been deleted.')
        } else {
          throw new Error('Could not get this conversation.')
        }
      }
    }
    const parseConvoIDs = async (
      convoIDs: string[]
    ): Promise<StoredConversationType[]> => {
      const previousChats = []
      for await (const id of convoIDs) {
        try {
          const chat = await getConvoData(id)
          previousChats.push(chat)
        } catch (error) {
          if (String(error) === 'Error: This conversation has been deleted.') {
            previousChatsIDs.splice(previousChatsIDs.indexOf(id), 1)
          }
        }
      }
      return previousChats
    }

    parseConvoIDs(previousChatsIDs)
      .then((chats) => {
        setPreviousConvos(chats)
        localStorage.setItem('previous-chats', JSON.stringify(previousChatsIDs))
      })
      .catch((error) => {
        console.log(error)
        setPreviousConvos([])
      })
  }, [])

  const submitHandler = async () => {
    if (convoName) {
      const response = await restAPI.post('/conversation', {
        name: convoName,
      })

      const conversation = response.data['conversation']
      navigate(`/${conversation['id']}`)
    }
  }

  if (previousConvos.length === 0) {
    return (
      <Content>
        <Title $extended={true}>OneTimeChat</Title>
        <InputContainer>
          <CreateInput
            type='text'
            placeholder='Conversation Name'
            value={convoName}
            onChange={(e) => setConvoName(e.target.value)}
            onKeyDownCapture={(event) => {
              if (event.key === 'Enter') {
                submitHandler()
              }
            }}
          />
          <Button onClick={submitHandler}>
            <img src={creation} alt='Start New Conversation' />
          </Button>
        </InputContainer>
        <AppDetails>
          Send and recieve messages with just a link!
          <ul>
            <li>No accounts required!</li>
            <li>Share group chats with just a link.</li>
            <li>Anyone who has the link can see and send messages.</li>
            <li>
              The conversation is deleted 30 days after the last message is
              sent.
            </li>
          </ul>
        </AppDetails>
      </Content>
    )
  }

  return (
    <>
      <Header>
        <Title>OneTimeChat</Title>
      </Header>
      <Content>
        <Subtitle>New Chat</Subtitle>
        <InputContainer>
          <CreateInput
            type='text'
            placeholder='Conversation Name'
            value={convoName}
            onChange={(e) => setConvoName(e.target.value)}
            onKeyDownCapture={(event) => {
              if (event.key === 'Enter') {
                submitHandler()
              }
            }}
          />
          <Button onClick={submitHandler}>
            <img src={creation} alt='Start New Conversation' />
          </Button>
        </InputContainer>
        <Subtitle>Previous Chats</Subtitle>
        {previousConvos.map((c) => (
          <PrevousChatCell
            key={c.convoId}
            convoId={c.convoId}
            name={c.name}
            daysRemaining={getDaysRemaining(new Date(), c.deletionDate)}
          />
        ))}
        <ListFooter>
          Conversations dissapear 30 days after the last message was sent.
          Anyone with a link can see and send messages.
        </ListFooter>
      </Content>
    </>
  )
}
