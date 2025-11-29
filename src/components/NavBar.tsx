/// <reference types="vite-plugin-svgr/client" />

import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import IconButton from './IconButton'
import CloseSVG from '../assets/close.svg?react'
import ICON_MAP from '../util/profileIcons'

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

const CloseIcon = styled(CloseSVG)`
  path {
    fill: var(--accent-color);

    @media (prefers-color-scheme: dark) {
      fill: white;
    }
  }
`

const ProfileChip = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  height: 36px;
  padding: 4px 10px 4px 4px;
  border-radius: 18px;
  background-color: var(--content-background);
  border: 1px solid transparent;
  cursor: pointer;

  &:hover {
    background-color: var(--accent-color);
    border-color: var(--accent-color);
  }

  &:hover span {
    color: white;
  }

  &:hover path {
    fill: white;
  }

  @media (prefers-color-scheme: dark) {
    &:hover {
      background-color: var(--accent-color);
    }
  }
`

const ProfileAvatar = styled.img`
  width: 28px;
  height: 28px;
  object-fit: cover;
  background-color: transparent;
`

const ProfileName = styled.span`
  font-size: 0.85rem;
  font-weight: 500;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 400px) {
    max-width: 60px;
  }
`

const ChevronIcon = styled.span`
  font-size: 0.7rem;
  opacity: 0.6;
  display: flex;
  align-items: center;
`

const IdentityBadge = styled.span`
  font-size: 0.65rem;
  padding: 2px 6px;
  border-radius: 8px;
  background-color: rgba(0, 123, 255, 0.2);
  color: #0066cc;
  font-weight: 600;
  white-space: nowrap;

  @media (prefers-color-scheme: dark) {
    background-color: rgba(100, 150, 255, 0.2);
    color: #6ca3ff;
  }
`

type NavBar = {
  title: string
  subtitle?: string
  onUserClick: () => void
  disableEditProfile: boolean
  userName?: string
  userAvatar?: string
  isAnonymous?: boolean
}

const NavBar = ({
  title = '',
  subtitle,
  onUserClick,
  disableEditProfile = false,
  userName,
  userAvatar,
  isAnonymous = false,
}: NavBar) => {
  const navigate = useNavigate()
  const avatarSrc = userAvatar ? ICON_MAP[userAvatar] : undefined

  return (
    <Container>
      <Content>
        <TitleStack>
          <Title>{title}</Title>
          {subtitle && <Subtitle>{subtitle}</Subtitle>}
        </TitleStack>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {!disableEditProfile && userName && avatarSrc && (
            <ProfileChip
              onClick={onUserClick}
              title={
                isAnonymous
                  ? 'Anonymous Identity - Click to edit'
                  : 'Account Identity - Click to edit'
              }
            >
              <ProfileAvatar src={avatarSrc} alt={userName} />
              <ProfileName>{userName}</ProfileName>
              {!isAnonymous && <IdentityBadge>✓</IdentityBadge>}
              <ChevronIcon>›</ChevronIcon>
            </ProfileChip>
          )}
          <IconButton
            icon={<CloseIcon />}
            onClick={() => navigate('/')}
            hasBorders={false}
          />
        </div>
      </Content>
    </Container>
  )
}

export default NavBar
