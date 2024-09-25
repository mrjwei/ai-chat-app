import {createContext} from 'react'
import { TMessagesContext } from "@/app/lib/types"

export const MessagesContext = createContext<TMessagesContext>({
  messages: [],
  setMessages: () => {}
})
