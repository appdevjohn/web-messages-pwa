import { useState } from 'react'
import type { FormEvent } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled, { keyframes } from 'styled-components'

import { logIn, signUp } from '../store/slices/auth'
import type { RootState, AppDispatch } from '../store/store'

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

const AuthCard = styled.div`
  box-sizing: border-box;
  margin: 0 auto;
  padding: 1.5rem 1.25rem;
  max-width: 28rem;
  background: white;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.06);
  border-radius: 20px;
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

const TextInput = styled.input`
  appearance: none;
  width: 100%;
  box-sizing: border-box;
  border: 2px solid transparent;
  border-radius: 12px;
  padding: 0.85rem 1rem;
  font-size: 1rem;
  background-color: #f5f5f5;
  transition: all 0.2s ease;

  &::placeholder {
    color: #999;
  }

  &:focus {
    outline: none;
    border-color: var(--accent-color);
    background-color: white;
    box-shadow: 0 0 0 4px rgba(64, 61, 88, 0.1);
  }

  @media (prefers-color-scheme: dark) {
    background-color: #2a2a2a;
    color: white;
    border-color: transparent;

    &::placeholder {
      color: #666;
    }

    &:focus {
      background-color: #333;
      border-color: var(--accent-color);
      box-shadow: 0 0 0 4px rgba(120, 114, 159, 0.15);
    }
  }
`

const PrimaryButton = styled.button`
  appearance: none;
  border: none;
  border-radius: 12px;
  padding: 0.875rem 1rem;
  margin-top: 0.25rem;
  font-size: 1rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--accent-color) 0%, #5a5479 100%);
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;

  @media (min-width: 40rem) {
    padding: 1rem;
    margin-top: 0.5rem;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.2) 0%,
      transparent 100%
    );
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(64, 61, 88, 0.3);

    &::before {
      opacity: 1;
    }
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (prefers-color-scheme: dark) {
    background: linear-gradient(135deg, #78729f 0%, #5a5479 100%);

    &:hover:not(:disabled) {
      box-shadow: 0 8px 20px rgba(120, 114, 159, 0.3);
    }
  }
`

const ErrorText = styled.div`
  font-size: 0.85rem;
  color: #c72c41;
  font-weight: 500;
  padding: 0.5rem 0.75rem;
  background-color: rgba(199, 44, 65, 0.1);
  border-radius: 8px;
  border-left: 3px solid #c72c41;
`

const HelperText = styled.div`
  font-size: 0.875rem;
  margin: 1rem auto 0;
  text-align: center;
  max-width: 32rem;
  color: #666;

  @media (min-width: 40rem) {
    font-size: 0.9rem;
    margin: 1.25rem auto 0;
  }

  @media (prefers-color-scheme: dark) {
    color: #aaa;
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
            <ErrorText>{formError || authState.error}</ErrorText>
          )}
          <PrimaryButton type='submit' disabled={authState.isLoading}>
            {authState.isLoading
              ? formMode === 'login'
                ? 'Signing in…'
                : 'Creating account…'
              : formMode === 'login'
              ? 'Log In'
              : 'Sign Up'}
          </PrimaryButton>
        </LoginForm>
      </AuthCard>
      <HelperText>
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
      </HelperText>
    </>
  )
}
