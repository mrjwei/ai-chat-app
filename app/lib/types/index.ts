export interface IMessage {
  role: 'user' | 'system' | 'bot'
  content: string
}

export type TMessagesContext = {
  messages: IMessage[]
  setMessages: (messages: IMessage[]) => void
}
