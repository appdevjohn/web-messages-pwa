import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import restAPI from '../util/rest'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 75vh;
`

const Title = styled.div`
  text-align: center;
  font-size: 1.5rem;
  margin: 2rem 0 1rem 0;
`

const InputContainer = styled.div`
  margin: 1rem 0;
  text-align: center;
  box-shadow: none;
`

const Input = styled.input`
  appearance: none;
  border-radius: 8px;
  border: 1px solid gray;
  font-size: 1rem;
  padding: 6px 8px;
  width: 300px;
`

const ButtonContainer = styled.div`
  text-align: center;
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
  padding: 6px 8px;
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
      <Title>New Conversation</Title>
      <InputContainer>
        <Input
          type='text'
          placeholder='Conversation Name'
          value={convoName}
          onChange={(e) => setConvoName(e.target.value)}
        />
      </InputContainer>
      <ButtonContainer>
        <Button onClick={submitHandler}>Create</Button>
      </ButtonContainer>
    </Container>
  )
}
