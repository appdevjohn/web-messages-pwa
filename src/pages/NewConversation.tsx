import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import styled from 'styled-components'

import restAPI from '../util/rest'
import getDaysRemaining from '../util/daysRemaining'
import { StoredConversationType } from '../types'

const Header = styled.div`
  background-color: var(--accent-color);
  color: white;
  padding: 24px 8px 16px 8px;
`

const Content = styled.div`
  margin: 0;
  padding: 8px;
`

const Title = styled.div`
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  margin-top: 1rem;
`

const Description = styled.div`
  text-align: center;
  font-size: 0.8rem;
  margin: 1rem;
`

const Subtitle = styled.div`
  text-align: left;
  font-size: 1.3rem;
  font-weight: 700;
  margin: 1rem 0 0.5rem 0;
`

const InputContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 100px;
  grid-template-rows: 44px;
  column-gap: 24px;
  margin-bottom: 2rem;
`

const Input = styled.input`
  appearance: none;
  border-radius: 8px;
  border: 1px solid gray;
  font-size: 1rem;
  padding: 6px 8px;
  width: 100%;
`

const Button = styled.button`
  appearance: none;
  background-color: var(--accent-color);
  color: white;
  border-radius: 8px;
  box-shadow: none;
  border: none;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  cursor: pointer;
`

const ListCell = styled.div`
  margin: 8px 0;
  padding: 8px;
  background-color: var(--content-background);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
  border-radius: 8px;

  @media (prefers-color-scheme: dark) {
    background-color: #333333;
  }
`

const ListCellTitle = styled.div`
  font-size: 1rem;
  font-weight: 400;
  color: black;

  @media (prefers-color-scheme: dark) {
    color: white;
  }
`

const ListCellSubtitle = styled.div`
  font-size: 0.8rem;
  font-weight: 400;
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
        } remaining`}</ListCellSubtitle>
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
    const getConvoData = async (
      convoId: string
    ): Promise<StoredConversationType> => {
      const response = await restAPI.get(`/conversation/${convoId}`)
      return {
        convoId: response.data['conversation']['id'],
        name: response.data['conversation']['name'],
        dateStored: new Date(response.data['conversation']['updatedAt']),
        deletionDate: new Date(response.data['deletionDate']),
      }
    }
    const parseConvoIDs = async (
      convoIDs: string[]
    ): Promise<StoredConversationType[]> => {
      const previousChats = []
      for await (const id of convoIDs) {
        const chat = await getConvoData(id)
        previousChats.push(chat)
      }
      return previousChats
    }

    const previousChatString = localStorage.getItem('previous-chats')
    const previousChatsIDs: string[] = previousChatString
      ? JSON.parse(previousChatString)
      : []

    parseConvoIDs(previousChatsIDs)
      .then((chats) => {
        setPreviousConvos(chats)
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

  return (
    <>
      <Header>
        <Title>OneTimeChat</Title>
        <Description>
          Chat with just a link.
          <br />
          Convos dissapear after 30 days.
        </Description>
      </Header>
      <Content>
        <Subtitle>New Chat</Subtitle>
        <InputContainer>
          <Input
            type='text'
            placeholder='Conversation Name'
            value={convoName}
            onChange={(e) => setConvoName(e.target.value)}
          />
          <Button onClick={submitHandler}>Create</Button>
        </InputContainer>
        <Subtitle>Previous Chats</Subtitle>
        {previousConvos.map((c) => (
          <PrevousChatCell
            convoId={c.convoId}
            name={c.name}
            daysRemaining={getDaysRemaining(c.deletionDate, new Date())}
          />
        ))}
      </Content>
    </>
  )
}
