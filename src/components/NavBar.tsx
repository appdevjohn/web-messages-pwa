/// <reference types="vite-plugin-svgr/client" />

import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import IconButton from './IconButton'
import EditProfileSVG from '../assets/edit-account.svg?react'
import CloseSVG from '../assets/close.svg?react'

const Container = styled.div`
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

const Content = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  margin: auto;
  max-width: 40rem;
`

const TitleStack = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`

const Title = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
`

const Subtitle = styled.div`
  font-size: 0.8rem;
  font-weight: 400;
  color: gray;
`

const EditProfileIcon = styled(EditProfileSVG)`
  path {
    fill: var(--accent-color);

    @media (prefers-color-scheme: dark) {
      fill: white;
    }
  }
`

const CloseIcon = styled(CloseSVG)`
  path {
    fill: var(--accent-color);

    @media (prefers-color-scheme: dark) {
      fill: white;
    }
  }
`

type NavBar = {
  title: string
  subtitle?: string
  onUserClick: () => void
  disableEditProfile: boolean
}

const NavBar = ({
  title = '',
  subtitle,
  onUserClick,
  disableEditProfile = false,
}: NavBar) => {
  const navigate = useNavigate()

  return (
    <Container>
      <Content>
        <TitleStack>
          <Title>{title}</Title>
          {subtitle && <Subtitle>{subtitle}</Subtitle>}
        </TitleStack>
        <div>
          {!disableEditProfile && (
            <IconButton
              icon={<EditProfileIcon />}
              onClick={onUserClick}
              style={{ marginLeft: '8px' }}
              hasBorders={false}
            />
          )}
          <IconButton
            icon={<CloseIcon />}
            onClick={() => navigate('/')}
            style={{ marginLeft: '8px' }}
            hasBorders={false}
          />
        </div>
      </Content>
    </Container>
  )
}

export default NavBar
