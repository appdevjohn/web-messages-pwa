import { createBrowserRouter, RouterProvider } from 'react-router-dom'

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
  return <RouterProvider router={router} />
}

export default App
