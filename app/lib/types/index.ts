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

export type TSpeakingContext = {
  isSpeaking: boolean
  setIsSpeaking: (val: boolean) => void
  activeMessage: IMessage | null
  setActiveMessage: (val: IMessage | null) => void
}

export type TSystemMessageContext = {
  systemMessage: string
  setSystemMessage: (val: string) => void
}

export type TVoiceContext = {
  voiceIndex: number
  setVoiceIndex: (val: number) => void
}

export interface IUser {
  id: string
  name: string
  email: string
  password: string
  threads?: IThread[]
}
