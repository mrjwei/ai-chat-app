'use client'

import {useState} from 'react'
import { SpeakingContext } from "@/app/lib/contexts"
import { IThread } from "@/app/lib/types"
import ChatBox from "@/app/ui/chat/chat-box"
import Messages from "@/app/ui/chat/messages"

export default function ChatWindow({thread, userId}: {thread: IThread | null, userId: string}) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  return (
    <SpeakingContext.Provider value={{isSpeaking, setIsSpeaking}}>
      <Messages thread={thread} />
      <ChatBox userId={userId} thread={thread} />
    </SpeakingContext.Provider>
  )
}
