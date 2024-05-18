import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

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
  border: 0;
  box-shadow: 0px 2px 2px #cccccc;
  background-color: white;
`

type NavBar = {
  title: string
  onUserClick: () => void
}

const NavBar = ({ title = '', onUserClick }: NavBar) => {
  const navigate = useNavigate()

  return (
    <Container>
      <div>{title}</div>
      <button onClick={onUserClick}>User</button>
      <button onClick={() => navigate('/')}>Exit</button>
    </Container>
  )
}

export default NavBar
