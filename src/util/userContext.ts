import { createContext, Dispatch, SetStateAction } from 'react'

export type UserType = {
  name: string
  avatar: string
}

const defaultValue: [UserType, Dispatch<SetStateAction<UserType>>] = [
  { name: '', avatar: '' },
  () => {},
]

const UserContext = createContext(defaultValue)

export default UserContext
