export interface IMessage {
  role: 'user' | 'system' | 'bot'
  content: string
}

export interface IThread {
  id: string
  title: string
  description?: string
  messages: IMessage[]
}

export type TCurrentThreadContext = {
  thread?: IThread
  setThread: (thread: IThread) => void
}
