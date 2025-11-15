import { useEffect, useState } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'

import { store } from './store/store'
import { initializeAuth } from './store/slices/auth'
import UserContext, { UserType } from './util/userContext'
import ConversationView from './pages/Conversation'
import NewConversation from './pages/NewConversation'

const router = createBrowserRouter([
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
    store.dispatch(initializeAuth())
  }, [])

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
