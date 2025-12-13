import { useEffect, useState } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Provider, useSelector } from 'react-redux'

import { store } from './store/store'
import { initializeAuth } from './store/slices/auth'
import type { RootState } from './store/store'
import UserContext, { UserType } from './util/userContext'
import ConversationView from './pages/Conversation'
import NewConversation from './pages/NewConversation'
import Landing from './pages/Landing'
import About from './pages/About'

function HomePage() {
  const authState = useSelector((state: RootState) => state.auth)
  const isLoggedIn = Boolean(authState.accessToken)

  if (!isLoggedIn) {
    return <Landing />
  }

  return <NewConversation />
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/about',
    element: <About />,
  },
  {
    path: '/:convoId',
    element: <ConversationView />,
  },
])

function App() {
  const [user, setUser] = useState<UserType>({ name: '', avatar: '' })

  useEffect(() => {
    store.dispatch(initializeAuth())
  }, [])

  // Retrieve user info for users without an account.
  useEffect(() => {
    const name = localStorage.getItem('name') || ''
    const avatar = localStorage.getItem('avatar') || ''
    setUser({ name, avatar })
  }, [])

  // Store user info for users without an account.
  useEffect(() => {
    if (user.name.length > 0 || user.avatar.length > 0) {
      localStorage.setItem('name', user.name)
      localStorage.setItem('avatar', user.avatar)
    }
  }, [user])

  return (
    <Provider store={store}>
      <UserContext.Provider value={[user, setUser]}>
        <RouterProvider router={router} />
      </UserContext.Provider>
    </Provider>
  )
}

export default App
