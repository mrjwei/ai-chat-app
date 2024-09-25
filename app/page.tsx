'use client'

import 'regenerator-runtime/runtime'
import {useState} from 'react'
import '@/app/globals.css'
import ChatBox from "@/app/ui/chat/chat-box"
import Messages from "@/app/ui/chat/messages"
import {MessagesContext} from '@/app/lib/contexts'
import { IMessage } from "@/app/lib/types"

export default function Top() {
  const [messages, setMessages] = useState<IMessage[]>([])

  return (
    <MessagesContext.Provider value={{messages, setMessages}}>
      <div className="flex flex-col h-[calc(100vh-56px)]">
        <Messages />
        <ChatBox />
      </div>
    </MessagesContext.Provider>
  )
}
