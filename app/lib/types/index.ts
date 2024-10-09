export type TRole = 'user' | 'system' | 'assistant'

export interface IMessage {
  id: string
  role: TRole
  content: string
}

export interface IThread {
  id: string
  userId: string
  title: string
  description: string
  messages: IMessage[]
}

export type TSpeakingContext = {
  isSpeaking: boolean
  setIsSpeaking: (val: boolean) => void
}

export interface IUser {
  id: string
  name: string
  email: string
  password: string
  threads?: IThread[]
}
