import {createContext} from 'react'
import {TSpeakingContext} from '@/app/lib/types'

export const SpeakingContext = createContext<TSpeakingContext>({
  isSpeaking: false,
  setIsSpeaking: () => {}
})
