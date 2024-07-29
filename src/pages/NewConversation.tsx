import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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
`

const ListCellTitle = styled.div`
  font-size: 1rem;
  font-weight: 400;
`

const ListCellSubtitle = styled.div`
  font-size: 0.8rem;
  font-weight: 400;
  color: gray;
`

const PrevousChatCell = ({
  name,
  daysRemaining,
}: {
  name: string
  daysRemaining: number
}) => {
  return (
    <ListCell>
      <ListCellTitle>{name}</ListCellTitle>
      <ListCellSubtitle>{`${daysRemaining} ${
        daysRemaining === 1 ? 'day' : 'days'
      } remaining`}</ListCellSubtitle>
    </ListCell>
  )
}

export default function NewConversation() {
  const navigate = useNavigate()

  const [convoName, setConvoName] = useState('')
  const [previousConvos, setPreviousConvos] = useState<
    StoredConversationType[]
  >([])

  useEffect(() => {
    const previousChatStrings = localStorage.getItem('previous-chats')
    const previousChats: StoredConversationType[] = previousChatStrings
      ? JSON.parse(previousChatStrings)
      : []
    setPreviousConvos(previousChats)
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
            name={c.name}
            daysRemaining={getDaysRemaining(c.deletionDate, new Date())}
          />
        ))}
      </Content>
    </>
  )
}
