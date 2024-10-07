export type TRole = 'user' | 'system' | 'bot'

export interface IMessage {
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

export type TCurrentThreadContext = {
  thread?: IThread
  setThread: (thread: IThread) => void
}

export interface IUser {
  id: string
  name: string
  email: string
  password: string
  threads?: IThread[]
}
