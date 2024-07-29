export type StoredConversationType = {
  convoId: string
  name: string
  dateStored: Date
  deletionDate: Date
}

export type MessageType = {
  id: string
  userId: string
  timestamp: Date
  content: string
  type: string
  userProfilePic: string
  userFullName: string
  delivered: string
}

export type MessagesPayloadType = {
  messages: any[]
  conversation: any
  deletionDate: Date
}
