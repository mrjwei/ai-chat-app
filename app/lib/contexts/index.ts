import {createContext} from 'react'
import {TSpeakingContext, TSystemMessageContext, TVoiceContext} from '@/app/lib/types'

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

export const VoiceContext = createContext<TVoiceContext>({
  voiceIndex: 0,
  setVoiceIndex: () => {}
})
