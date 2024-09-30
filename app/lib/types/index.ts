export type TRole = 'user' | 'system' | 'bot'

export interface IMessage {
  role: TRole
  content: string
}

export interface IThread {
  id: string
  title: string
  description: string
  messages: IMessage[]
}

export type TCurrentThreadContext = {
  thread?: IThread
  setThread: (thread: IThread) => void
}
