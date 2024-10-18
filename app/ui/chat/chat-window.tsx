"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { SpeakingContext, SystemMessageContext } from "@/app/lib/contexts"
import { IMessage, ISystemMessage, IThread } from "@/app/lib/types"
import ChatBox from "@/app/ui/chat/chat-box"
import Messages from "@/app/ui/chat/messages"
import SystemMessageSelect from "@/app/ui/chat/system-message-select"

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

  const pathname = usePathname()

  return (
    <SpeakingContext.Provider
      value={{ isSpeaking, setIsSpeaking, activeMessage, setActiveMessage }}
    >
      <SystemMessageContext.Provider
        value={{ systemMessage, setSystemMessage }}
      >
        <div className="hidden lg:block">
          <SystemMessageSelect messages={systemMessages} className="w-full fixed top-0 shadow" />
        </div>
        {pathname.startsWith("/t") && <Messages thread={thread} />}
        <ChatBox userId={userId} thread={thread} />
      </SystemMessageContext.Provider>
    </SpeakingContext.Provider>
  )
}
