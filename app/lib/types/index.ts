export interface IMessage {
  role: 'user' | 'system' | 'bot'
  content: string
}
