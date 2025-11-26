import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled, { keyframes } from 'styled-components'
import { UserType } from '../util/userContext'
import ICON_MAP from '../util/profileIcons'
import restAPI from '../util/rest'
import type { RootState, AppDispatch } from '../store/store'
import { updateUserProfile as updateUserProfileAction } from '../store/slices/auth'

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

const DisclaimerText = styled.div`
  font-size: 0.75rem;
  color: gray;
  margin-top: 12px;
  padding: 8px 12px;
  background-color: rgba(128, 128, 128, 0.1);
  border-radius: 12px;
  line-height: 1.4;
`

const PreviewText = styled.div`
  font-size: 0.8rem;
  color: var(--text-color);
  margin-top: 12px;
  padding: 8px 12px;
  background-color: var(--content-background);
  border-radius: 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
  text-align: center;
  font-weight: 500;
`

const AuthSection = styled.div`
  margin-top: 16px;
  padding: 16px 0;
  text-align: center;
`

const AuthText = styled.div`
  font-size: 0.85rem;
  color: gray;
  margin-bottom: 12px;
`

const AuthButton = styled.button`
  width: 100%;
  height: 40px;
  cursor: pointer;
  background-color: transparent;
  color: var(--accent-color);
  border: 2px solid var(--accent-color);
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 700;
  margin-bottom: 8px;

  &:hover {
    background-color: var(--accent-color);
    color: white;
    transition: all 0.2s ease;
  }

  &:last-child {
    margin-bottom: 0;
  }
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

        {!authUser && (
          <PreviewText>
            Your messages will be sent as {displayName} ({displayAvatar})
          </PreviewText>
        )}

        {!authUser && hasChangedProfile && previousName && previousAvatar && (
          <DisclaimerText>
            Note: All previous messages will still appear to be sent as{' '}
            {previousName} ({previousAvatar})
          </DisclaimerText>
        )}

        <SaveButton onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Saving…' : 'Save'}
        </SaveButton>
        {error && <ErrorText>{error}</ErrorText>}

        {!authUser && (
          <>
            <AuthSection>
              <AuthText>
                Want to save your profile and use it everywhere?
              </AuthText>
              <AuthButton onClick={() => {}}>Sign Up or Log In</AuthButton>
            </AuthSection>
          </>
        )}
      </Container>
    </Backdrop>
  )
}

export default EditProfile
