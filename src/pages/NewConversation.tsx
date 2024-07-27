import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import restAPI from '../util/rest'

const Container = styled.div`
  display: block;
  padding: 3rem 8px 0 8px;
  margin: 0;
`

const Title = styled.div`
  text-align: left;
  font-size: 2.5rem;
  font-weight: 700;
`

const Description = styled.div`
  text-align: left;
  font-size: 1rem;
  margin: 0.5rem 0 4rem 0;
`

const InputContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 100px;
  grid-template-rows: 44px;
  column-gap: 24px;
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

export default function NewConversation() {
  const navigate = useNavigate()

  const [convoName, setConvoName] = useState('')

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
    <Container>
      <Title>OneTimeChat</Title>
      <Description>
        Create an annonomous chat with people whom you send a link. The chat
        will disappear 30 days after the last message is sent.
      </Description>
      <InputContainer>
        <Input
          type='text'
          placeholder='Conversation Name'
          value={convoName}
          onChange={(e) => setConvoName(e.target.value)}
        />
        <Button onClick={submitHandler}>Create</Button>
      </InputContainer>
    </Container>
  )
}
