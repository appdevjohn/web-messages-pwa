import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import IconButton from './IconButton'
import editProfileIcon from '../assets/edit-account.png'
import closeChatIcon from '../assets/close.png'

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  padding: 0 1rem;
  border: 0;
  box-shadow: 0px 2px 2px #cccccc;
  background-color: white;

  @media (prefers-color-scheme: dark) {
    background-color: rgb(30, 30, 30);
    box-shadow: 0px 2px 2px black;
  }
`

const Title = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
`

type NavBar = {
  title: string
  onUserClick: () => void
}

const NavBar = ({ title = '', onUserClick }: NavBar) => {
  const navigate = useNavigate()

  return (
    <Container>
      <Title>{title}</Title>
      <div>
        <IconButton
          icon={editProfileIcon}
          alt='Edit Profile'
          onClick={onUserClick}
          style={{ marginLeft: '8px' }}
          hasBorders={false}
        />
        <IconButton
          icon={closeChatIcon}
          alt='Exit Chat'
          onClick={() => navigate('/')}
          style={{ marginLeft: '8px' }}
          hasBorders={false}
        />
      </div>
    </Container>
  )
}

export default NavBar
