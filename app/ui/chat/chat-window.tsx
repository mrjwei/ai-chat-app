"use client"

import { usePathname } from "next/navigation"
import { ISystemMessage, IThread } from "@/app/lib/types"
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

  const pathname = usePathname()

  return (
    <>
      {pathname.startsWith("/t") && <Thread thread={thread} />}
      <ChatBox userId={userId} thread={thread} />
    </>
  )
}
