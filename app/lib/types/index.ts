export type TRole = 'user' | 'system' | 'assistant'

export interface IMessage {
  id: string
  role: TRole
  content: string
}

export interface ISystemMessage extends IMessage {
  role: 'system'
  userId: string,
  label: string
}

export interface IThread {
  id: string
  userId: string
  title: string
  description: string
  messages: IMessage[]
}

export interface IUser {
  id: string
  name: string
  email: string
  password: string
  threads?: IThread[]
}

export interface ISpeakingMessageState {
  speakingMessage: IMessage | null
  setSpeakingMessage: (message: IMessage | null) => void
}

export interface IVoiceState {
  voiceIndex: number
  changeVoiceIndex: (newIndex: number) => void
}

export interface ISystemMessageState {
  systemMessage: ISystemMessage | null
  changeSystemMessage: (newMessage: ISystemMessage) => void
}

export interface IMenuState {
  isOpen: boolean
  setIsOpen: (val: boolean) => void
}

