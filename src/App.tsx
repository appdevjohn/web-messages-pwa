import { useEffect, useState } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'

import { store } from './store/store'
import UserContext, { UserType } from './util/userContext'
import ConversationView from './pages/Conversation'
import NewConversation from './pages/NewConversation'
import AuthView from './pages/Auth'

const router = createBrowserRouter([
  {
    path: '/auth',
    element: <AuthView />,
  },
  {
    path: '/',
    element: <NewConversation />,
  },
  {
    path: '/:convoId',
    element: <ConversationView />,
  },
])

function App() {
  const [user, setUser] = useState<UserType>({ name: '', avatar: '' })

  useEffect(() => {
    const name = localStorage.getItem('name') || ''
    const avatar = localStorage.getItem('avatar') || ''
    setUser({ name, avatar })
  }, [])

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
