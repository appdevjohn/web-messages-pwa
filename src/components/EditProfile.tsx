import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled, { keyframes } from 'styled-components'
import { UserType } from '../util/userContext'
import ICON_MAP from '../util/profileIcons'
import restAPI from '../util/rest'
import type { RootState, AppDispatch } from '../store/store'
import { updateUserProfile as updateUserProfileAction } from '../store/slices/auth'
import MessageView from './MessageView'

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
    background-color: rgb(65, 65, 65);
    box-shadow: 0px 2px 2px black;
  }
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`

const Title = styled.div`
  font-size: 1rem;
  font-weight: 700;
`

const Pill = styled.div`
  background-color: var(--content-background);
  color: gray;
  font-size: 0.7rem;
  border-radius: 12px;
  padding: 6px 10px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
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
  padding: 0;
  border-radius: 22px;
  background-color: ${(props) => (props.$selected ? 'gray' : '#CCCCCC')};
  appearance: none;
  border: none;
  drop-shadow: none;
  cursor: pointer;
  font-weight: ${(props) => (props.$selected ? '700' : '400')};

  & img {
    object-fit: contain;
    height: 32px;
    width: 32px;
  }
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

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`

const ErrorText = styled.div`
  color: #c72c41;
  font-size: 0.8rem;
  margin-top: 8px;
  text-align: center;
`

const UserInfoSection = styled.div`
  background-color: var(--content-background);
  border-radius: 18px;
  padding: 12px 16px;
  margin-bottom: 16px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
`

const UserInfoLabel = styled.div`
  font-size: 0.7rem;
  color: gray;
  margin-bottom: 4px;
`

const UserInfoValue = styled.div`
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }
`

const DisclaimerSection = styled.div`
  margin-top: 24px;
`

const DisclaimerText = styled.div`
  font-size: 0.85rem;
  color: gray;
  margin-bottom: 12px;
`

const ToggleButton = styled.button`
  appearance: none;
  border: none;
  background: none;
  color: gray;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  padding: 8px 0;
  text-align: left;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover {
    color: var(--accent-color);
  }
`

const Caret = styled.span<{ $isOpen: boolean }>`
  display: inline-block;
  transition: transform 0.2s ease;
  transform: ${(props) => (props.$isOpen ? 'rotate(90deg)' : 'rotate(0deg)')};
`

const ItalicText = styled.span`
  font-style: italic;
  font-weight: 400;
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
  const dispatch = useDispatch<AppDispatch>()
  const authUser = useSelector((state: RootState) => state.auth.user)
  const [name, setName] = useState(authUser?.displayName || user?.name || '')
  const [avatar, setAvatar] = useState(
    authUser?.profilePicURL || user?.avatar || ''
  )
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [previousName] = useState(user?.name || '')
  const [previousAvatar] = useState(user?.avatar || '')
  const [showDisclaimer, setShowDisclaimer] = useState(false)

  useEffect(() => {
    setName(authUser?.displayName || user?.name || '')
    setAvatar(authUser?.profilePicURL || user?.avatar || '')
  }, [authUser, user])

  const handleSave = async () => {
    if (authUser) {
      try {
        setIsSaving(true)
        setError(null)
        await restAPI.put('/auth/update-profile', {
          displayName: name,
          profilePicURL: avatar,
        })
        dispatch(
          updateUserProfileAction({
            displayName: name,
            profilePicURL: avatar,
          })
        )
        onDismiss()
      } catch (err) {
        console.error(err)
        setError('Unable to update profile. Please try again.')
      } finally {
        setIsSaving(false)
      }
      return
    }

    onChangeUser({ name, avatar })
  }

  const hasChangedProfile =
    !authUser && (name !== previousName || avatar !== previousAvatar)
  const displayAvatar = avatar || 'default'
  const displayName = name || 'Anonymous'

  return (
    <Backdrop onClick={onDismiss}>
      <Container onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>Edit profile</Title>
          {!authUser && <Pill>Local to this browser</Pill>}
        </Header>

        {authUser && (
          <UserInfoSection>
            <div>
              <UserInfoLabel>Username</UserInfoLabel>
              <UserInfoValue>@{authUser.username}</UserInfoValue>
            </div>
            {authUser.email && (
              <div>
                <UserInfoLabel>Email</UserInfoLabel>
                <UserInfoValue>{authUser.email}</UserInfoValue>
              </div>
            )}
          </UserInfoSection>
        )}

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
            {Object.keys(ICON_MAP).map((a) => (
              <AvatarContainer key={a}>
                <AvatarOption
                  $selected={a === avatar}
                  onClick={() => setAvatar(a)}
                >
                  <img src={ICON_MAP[a]} alt={a} />
                </AvatarOption>
              </AvatarContainer>
            ))}
          </AvatarGrid>
        </div>

        <SaveButton onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Saving…' : 'Save'}
        </SaveButton>
        {error && <ErrorText>{error}</ErrorText>}

        {!authUser && (
          <DisclaimerSection>
            <ToggleButton onClick={() => setShowDisclaimer(!showDisclaimer)}>
              <Caret $isOpen={showDisclaimer}>▶</Caret>
              About Anonymous Identity
              <ItalicText>{hasChangedProfile ? '(updated)' : ''}</ItalicText>
            </ToggleButton>
            {showDisclaimer && (
              <>
                <DisclaimerText>
                  You're using an Anonymous Identity. If you switch devices,
                  reset your browser, or change your info, your earlier messages
                  won't appear as "you." Also, if someone else in the chat
                  chooses the same name and picture, their messages may look
                  like yours on your device. Signing in will switch to your
                  Account Identity and keep your profile consistent and unique
                  going forward.
                </DisclaimerText>
                {hasChangedProfile && previousName && previousAvatar && (
                  <MessageView
                    highlightId='new-preview-user'
                    showLoadOlderMessagesButton={false}
                    isLoadingOlderMessages={false}
                    onLoadOlderMessages={() => {}}
                    margin='24px auto 0 auto'
                    messages={[
                      {
                        id: 'preview-message-1',
                        userId: 'old-preview-user',
                        timestamp: new Date(),
                        content: `This is how your earlier messages will look with your previous name and picture.`,
                        type: 'text',
                        userProfilePic: previousAvatar,
                        userFullName: previousName,
                        delivered: 'delivered',
                      },
                      {
                        id: 'preview-message-2',
                        userId: 'new-preview-user',
                        timestamp: new Date(),
                        content: `And this is how your messages will look now, with your updated identity.`,
                        type: 'text',
                        userProfilePic: displayAvatar,
                        userFullName: displayName,
                        delivered: 'delivered',
                      },
                    ]}
                  />
                )}
              </>
            )}
          </DisclaimerSection>
        )}
      </Container>
    </Backdrop>
  )
}

export default EditProfile
