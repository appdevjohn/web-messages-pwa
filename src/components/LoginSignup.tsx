import { useState } from 'react'
import type { FormEvent } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled, { keyframes } from 'styled-components'

import { logIn, signUp } from '../store/slices/auth'
import type { RootState, AppDispatch } from '../store/store'
import {
  Card,
  PrimaryButton,
  TextInput,
  ErrorText,
  HelperText,
} from './shared/StyledComponents'

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const AuthCard = styled(Card)`
  box-sizing: border-box;
  margin: 0 auto;
  padding: 1.5rem 1.25rem;
  max-width: 28rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  animation: ${slideUp} 0.4s ease-out;

  @media (min-width: 40rem) {
    padding: 2rem 1.5rem;
  }

  @media (prefers-color-scheme: dark) {
    background: linear-gradient(to bottom, #2a2a2a 0%, #1f1f1f 100%);
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.3);
  }
`

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.875rem;

  @media (min-width: 40rem) {
    gap: 1rem;
  }
`

const InputWrapper = styled.div`
  position: relative;
`

const InputLabel = styled.label`
  display: block;
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 0.4rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  @media (prefers-color-scheme: dark) {
    color: #aaa;
  }
`

const StyledPrimaryButton = styled(PrimaryButton)`
  padding: 0.875rem 1rem;
  margin-top: 0.25rem;

  @media (min-width: 40rem) {
    padding: 1rem;
    margin-top: 0.5rem;
  }
`

const StyledErrorText = styled(ErrorText)`
  font-size: 0.85rem;
  padding: 0.5rem 0.75rem;
`

const StyledHelperText = styled(HelperText)`
  margin: 1rem auto 0;
  max-width: 32rem;

  @media (min-width: 40rem) {
    font-size: 0.9rem;
    margin: 1.25rem auto 0;
  }
`

const ToggleLink = styled.button`
  appearance: none;
  border: none;
  background: none;
  color: var(--accent-color);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  text-decoration: none;
  border-bottom: 2px solid transparent;
  transition: border-color 0.2s ease;

  &:hover {
    border-bottom-color: var(--accent-color);
  }
`

export default function LoginSignup() {
  const dispatch = useDispatch<AppDispatch>()
  const authState = useSelector((state: RootState) => state.auth)

  const [formMode, setFormMode] = useState<'login' | 'signup'>('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [formError, setFormError] = useState<string | null>(null)

  const handleLogIn = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!username.trim() || !password.trim()) {
      setFormError('Enter your username and password.')
      return
    }

    setFormError(null)
    dispatch(logIn({ username: username.trim(), password: password.trim() }))
  }

  const handleSignUp = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!displayName.trim()) {
      setFormError('Enter your display name.')
      return
    }
    if (!username.trim()) {
      setFormError('Enter a username.')
      return
    }
    if (!password.trim()) {
      setFormError('Enter a password.')
      return
    }

    setFormError(null)
    dispatch(
      signUp({
        displayName: displayName.trim(),
        username: username.trim(),
        email: email.trim() || null,
        password: password.trim(),
      })
    )
  }

  const toggleFormMode = () => {
    setFormMode((prev) => (prev === 'login' ? 'signup' : 'login'))
    setFormError(null)
  }

  return (
    <>
      <AuthCard>
        <LoginForm onSubmit={formMode === 'login' ? handleLogIn : handleSignUp}>
          {formMode === 'signup' && (
            <>
              <InputWrapper>
                <InputLabel>Display Name</InputLabel>
                <TextInput
                  type='text'
                  placeholder='John Doe'
                  value={displayName}
                  onChange={(event) => setDisplayName(event.target.value)}
                  autoComplete='name'
                />
              </InputWrapper>
              <InputWrapper>
                <InputLabel>Email (Optional)</InputLabel>
                <TextInput
                  type='email'
                  placeholder='john@example.com'
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete='email'
                />
              </InputWrapper>
            </>
          )}
          <InputWrapper>
            <InputLabel>Username</InputLabel>
            <TextInput
              type='text'
              placeholder={
                formMode === 'login' ? 'Enter username' : 'Choose a username'
              }
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete='username'
            />
          </InputWrapper>
          <InputWrapper>
            <InputLabel>Password</InputLabel>
            <TextInput
              type='password'
              placeholder={
                formMode === 'login' ? 'Enter password' : 'Create a password'
              }
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete={
                formMode === 'login' ? 'current-password' : 'new-password'
              }
            />
          </InputWrapper>
          {(formError || authState.error) && (
            <StyledErrorText>{formError || authState.error}</StyledErrorText>
          )}
          <StyledPrimaryButton type='submit' disabled={authState.isLoading}>
            {authState.isLoading
              ? formMode === 'login'
                ? 'Signing in…'
                : 'Creating account…'
              : formMode === 'login'
              ? 'Log In'
              : 'Sign Up'}
          </StyledPrimaryButton>
        </LoginForm>
      </AuthCard>
      <StyledHelperText>
        {formMode === 'login' ? (
          <>
            Don't have an account?{' '}
            <ToggleLink onClick={toggleFormMode}>Sign up here</ToggleLink>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <ToggleLink onClick={toggleFormMode}>Log in here</ToggleLink>
          </>
        )}
      </StyledHelperText>
    </>
  )
}
