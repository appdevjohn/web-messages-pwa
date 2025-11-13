import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { logIn, signUp, refresh } from '../store/slices/auth'
import { AppDispatch } from '../store/store'

export default function AuthView() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [displayName, setDisplayName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch<AppDispatch>()
  const authState = useSelector((state: any) => state.auth)

  console.log(authState)

  const handleLogin = () => {
    dispatch(logIn({ username, password }))
  }

  const handleSignUp = () => {
    dispatch(signUp({
      displayName,
      username,
      email: email || null,
      password
    }))
  }

  const handleRefresh = () => {
    dispatch(refresh())
  }

  const toggleMode = () => {
    setIsSignUp(!isSignUp)
    setDisplayName('')
    setEmail('')
  }

  return (
    <div>
      <h2>{isSignUp ? 'Sign Up' : 'Log In'}</h2>

      {isSignUp && (
        <>
          <input
            type='text'
            placeholder='Display Name'
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
          <input
            type='email'
            placeholder='Email (optional)'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </>
      )}

      <input
        type='text'
        placeholder='Username'
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type='password'
        placeholder='Password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {isSignUp ? (
        <button onClick={handleSignUp}>Sign Up</button>
      ) : (
        <button onClick={handleLogin}>Log In</button>
      )}

      <button onClick={toggleMode}>
        {isSignUp ? 'Already have an account? Log In' : "Don't have an account? Sign Up"}
      </button>

      <button onClick={handleRefresh}>Refresh</button>

      {authState.error && <p style={{ color: 'red' }}>{authState.error}</p>}
      {authState.isLoading && <p>Loading...</p>}
    </div>
  )
}
