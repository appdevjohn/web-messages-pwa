import styled from 'styled-components'

const Container = styled.div`
  padding: 4px 8px;
  margin: 16px 0;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
  border-radius: 4px;
  width: 320px;
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
  username,
  avatar,
  onChangeName,
  onChangeAvatar,
}: {
  username: string
  avatar: string
  onChangeName: (value: string) => void
  onChangeAvatar: (value: string) => void
}) => {
  return (
    <Container>
      <div style={{ marginBottom: '1rem' }}>
        <div>Screen Name</div>
        <Input
          name='username'
          type='text'
          placeholder='heyitsme'
          value={username}
          onChange={(e) => onChangeName(e.target.value)}
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
            <AvatarContainer>
              <AvatarOption
                $selected={a === avatar}
                onClick={() => onChangeAvatar(a)}
              >
                {a}
              </AvatarOption>
            </AvatarContainer>
          ))}
        </AvatarGrid>
      </div>
    </Container>
  )
}

export default EditProfile
