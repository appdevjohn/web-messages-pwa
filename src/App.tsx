import MessageView from './components/MessageView'

function App() {
  return (
    <>
      <div>
        <MessageView
          highlightId='1'
          isLoadingOlderMessages={false}
          onLoadOlderMessages={() => {}}
          showLoadOlderMessagesButton={false}
          messages={[
            {
              content: 'First Message',
              delivered: 'delivered',
              timestamp: new Date(),
              type: 'text',
              userFullName: 'John Champion',
              userProfilePic: '',
              userId: '1',
              id: '1',
            },
            {
              content: 'Second Message',
              delivered: 'delivered',
              timestamp: new Date(),
              type: 'text',
              userFullName: 'John Champion',
              userProfilePic: '',
              userId: '1',
              id: '2',
            },
            {
              content: 'Third Message',
              delivered: 'delivered',
              timestamp: new Date(),
              type: 'text',
              userFullName: 'Kyle Champion',
              userProfilePic: '',
              userId: '2',
              id: '3',
            },
          ]}
        />
      </div>
    </>
  )
}

export default App
