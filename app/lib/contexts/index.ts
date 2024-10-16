import {createContext} from 'react'
import {TSpeakingContext, TSystemMessageContext} from '@/app/lib/types'

export const SpeakingContext = createContext<TSpeakingContext>({
  isSpeaking: false,
  setIsSpeaking: () => {},
  activeMessage: null,
  setActiveMessage: () => {}
})

export const SystemMessageContext = createContext<TSystemMessageContext>({
  systemMessage: '',
  setSystemMessage: () => {}
})
