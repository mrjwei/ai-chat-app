import {createContext} from 'react'
import { TCurrentThreadContext } from "@/app/lib/types"

export const CurrentThreadContext = createContext<TCurrentThreadContext>({
  thread: {
    id: '',
    title: '',
    messages: []
  },
  setThread: () => {}
})
