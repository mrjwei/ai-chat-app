"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { SpeakingContext, SystemMessageContext, VoiceContext } from "@/app/lib/contexts"
import { IMessage, ISystemMessage, IThread } from "@/app/lib/types"
import ChatBox from "@/app/ui/chat/chat-box"
import Thread from "@/app/ui/chat/thread"
import SystemMessageSelect from "@/app/ui/chat/system-message-select"
import VoiceSelect from "@/app/ui/chat/voice-select"

export default function ChatWindow({
  thread,
  userId,
  systemMessages,
}: {
  thread: IThread | null
  userId: string
  systemMessages: ISystemMessage[] | undefined
}) {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [activeMessage, setActiveMessage] = useState<IMessage | null>(null)
  const [systemMessage, setSystemMessage] = useState("")
  const [voiceIndex, setVoiceIndex] = useState(0)

  const pathname = usePathname()

  return (
    <SpeakingContext.Provider
      value={{ isSpeaking, setIsSpeaking, activeMessage, setActiveMessage }}
    >
      <SystemMessageContext.Provider
        value={{ systemMessage, setSystemMessage }}
      >
        <VoiceContext.Provider value={{voiceIndex, setVoiceIndex}}>
          <div className="hidden w-full fixed top-0 shadow bg-white lg:flex lg:items-center">
            <SystemMessageSelect messages={systemMessages} className="" />
            <VoiceSelect className="" />
          </div>
          {pathname.startsWith("/t") && <Thread thread={thread} />}
          <ChatBox userId={userId} thread={thread} />
        </VoiceContext.Provider>
      </SystemMessageContext.Provider>
    </SpeakingContext.Provider>
  )
}
