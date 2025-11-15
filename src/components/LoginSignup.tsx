import { useState } from 'react'
import type { FormEvent } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import { logIn, signUp } from '../store/slices/auth'
import type { RootState, AppDispatch } from '../store/store'

const AuthCard = styled.div`
  box-sizing: border-box;
  margin: 0 auto;
  padding: 1.5rem;
  max-width: 28rem;
  background-color: var(--content-background);
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.35);
  border-radius: 16px;

  @media (prefers-color-scheme: dark) {
    background-color: #333333;
  }
`

const FormTitle = styled.div`
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 1rem;
`

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

const TextInput = styled.input`
  appearance: none;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  background-color: white;

  &:focus {
    outline: none;
    border-color: var(--accent-color);
    box-shadow: 0 0 0 3px rgba(255, 135, 30, 0.25);
  }

  @media (prefers-color-scheme: dark) {
    background-color: rgb(45, 45, 45);
    color: white;
    border-color: rgba(255, 255, 255, 0.1);
  }
`

const PrimaryButton = styled.button`
  appearance: none;
  border: none;
  border-radius: 999px;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  font-weight: 700;
  background-color: var(--accent-color);
  color: white;
  cursor: pointer;
  transition: transform 0.1s ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

const ErrorText = styled.div`
  font-size: 0.85rem;
  color: #c72c41;
  font-weight: 500;
`

const HelperText = styled.div`
  font-size: 0.95rem;
  margin: 1.5rem auto 0;
  text-align: center;
  max-width: 32rem;
`

const ToggleLink = styled.button`
  appearance: none;
  border: none;
  background: none;
  color: var(--accent-color);
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  text-decoration: underline;

  &:hover {
    opacity: 0.8;
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
        <FormTitle>
          {formMode === 'login' ? 'Log in to continue' : 'Create an account'}
        </FormTitle>
        <LoginForm
          onSubmit={formMode === 'login' ? handleLogIn : handleSignUp}
        >
          {formMode === 'signup' && (
            <>
              <TextInput
                type='text'
                placeholder='Display Name'
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                autoComplete='name'
              />
              <TextInput
                type='email'
                placeholder='Email (optional)'
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete='email'
              />
            </>
          )}
          <TextInput
            type='text'
            placeholder='Username'
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoComplete='username'
          />
          <TextInput
            type='password'
            placeholder='Password'
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete={
              formMode === 'login' ? 'current-password' : 'new-password'
            }
          />
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
