import { useState } from 'react'
import styled from 'styled-components'
import { UserType } from '../util/userContext'

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
`

const Container = styled.div`
  padding: 4px 8px;
  margin: 16px 0;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
  border-radius: 4px;
  width: 320px;
  background-color: white;
`

const Input = styled.input`
  width: 100%;
`

const AvatarGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: 44px 44px;
  gap: 8px;
  padding: 8px;
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

const EditProfile = ({
  user,
  onChangeUser,
}: {
  user: UserType
  onChangeUser: (value: UserType) => void
}) => {
  const [name, setName] = useState(user?.name || '')
  const [avatar, setAvatar] = useState(user?.avatar || '')

  return (
    <Backdrop>
      <Container>
        <div style={{ marginBottom: '1rem' }}>
          <div>Screen Name</div>
          <Input
            name='username'
            type='text'
            placeholder='heyitsme'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <div>Avatar</div>
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
        <button onClick={() => onChangeUser({ name, avatar })}>Save</button>
      </Container>
    </Backdrop>
  )
}

export default EditProfile
