import { useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { UserType } from '../util/userContext'

const appear = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 100%;
  }
`

const moveUp = keyframes`
  from {
    transform: translateY(20px);
  }

  to {
    transform: translateY(0);
  }
`

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  backdrop-filter: blur(10px) brightness(75%);
  -webkit-backdrop-filter: blur(10px) brightness(75%);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
  animation: ${appear} 0.2s ease-out;
`

const Container = styled.div`
  padding: 15px 10px 10px 10px;
  margin: 16px 0;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
  border-radius: 30px;
  width: 320px;
  background-color: white;
  animation: ${moveUp} 0.2s ease-out;

  @media (prefers-color-scheme: dark) {
    background-color: rgb(30, 30, 30);
    box-shadow: 0px 2px 2px black;
  }
`

const InputTitle = styled.div`
  font-size: 0.8rem;
  padding-left: 18px;
  padding-bottom: 4px;
`

const Input = styled.input`
  appearance: none;
  border: none;
  height: 36px;
  border-radius: 18px;
  background-color: var(--content-background);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
  padding: 0 16px;
  font-size: 1rem;
  text-align: left;
  cursor: pointer;
  width: calc(100% - 32px);

  &:focus {
    outline: none;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.75);
    transition: all 0.1s ease-out;
  }

  ::placeholder {
    color: var(--placeholder-text-color);
  }

  @media (prefers-color-scheme: dark) {
    color: black;
  }
`

const AvatarGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: 44px 44px;
  gap: 8px;
  padding: 8px 0;
`

const AvatarContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

const AvatarOption = styled.button<{ $selected?: boolean }>`
  height: 44px;
  width: 44px;
  border-radius: 22px;
  background-color: gray;
  appearance: none;
  border: none;
  drop-shadow: none;
  cursor: pointer;
  font-weight: ${(props) => (props.$selected ? '700' : '400')};
`

const SaveButton = styled.button`
  width: 100%;
  height: 40px;
  cursor: pointer;
  background-color: var(--accent-color);
  color: white;
  border-radius: 20px;
  appearance: none;
  drop-shadow: none;
  border: none;
  margin-top: 8px;
  font-size: 0.85rem;
  font-weight: 700;
`

const EditProfile = ({
  user,
  onChangeUser,
  onDismiss,
}: {
  user: UserType
  onChangeUser: (value: UserType) => void
  onDismiss: () => void
}) => {
  const [name, setName] = useState(user?.name || '')
  const [avatar, setAvatar] = useState(user?.avatar || '')

  return (
    <Backdrop onClick={onDismiss}>
      <Container onClick={(e) => e.stopPropagation()}>
        <div style={{ marginBottom: '1rem', width: '100%' }}>
          <InputTitle>Screen Name</InputTitle>
          <Input
            name='username'
            type='text'
            placeholder='heyitsme'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <InputTitle>Avatar</InputTitle>
          <AvatarGrid>
            {[
              'eagle',
              'bison',
              'moose',
              'bear',
              'alligator',
              'groundhog',
              'flamingo',
              'copperhead',
            ].map((a) => (
              <AvatarContainer key={a}>
                <AvatarOption
                  $selected={a === avatar}
                  onClick={() => setAvatar(a)}
                >
                  {a}
                </AvatarOption>
              </AvatarContainer>
            ))}
          </AvatarGrid>
        </div>
        <SaveButton onClick={() => onChangeUser({ name, avatar })}>
          Save
        </SaveButton>
      </Container>
    </Backdrop>
  )
}

export default EditProfile
