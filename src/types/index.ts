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
  daysRemaining: number
}
