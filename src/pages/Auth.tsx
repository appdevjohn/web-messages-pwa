import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { logIn, refresh } from '../store/slices/auth'
import { AppDispatch } from '../store/store'

export default function AuthView() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch<AppDispatch>()
  const authState = useSelector((state: any) => state.auth)

  console.log(authState)

  const handleLogin = () => {
    dispatch(logIn({ username, password }))
  }

  const handleRefresh = () => {
    dispatch(refresh())
  }

  return (
    <div>
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
      <button onClick={handleLogin}>Log In</button>
      <button onClick={handleRefresh}>Refresh</button>
    </div>
  )
}
