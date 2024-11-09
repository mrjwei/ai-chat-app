"use client"

import { usePathname } from "next/navigation"
import { IThread } from "@/app/lib/types"
import ChatBox from "@/app/ui/chat/chat-box"
import Thread from "@/app/ui/chat/thread"

export default function ChatWindow({
  thread,
  userId,
}: {
  thread: IThread | null
  userId: string
}) {

  const pathname = usePathname()

  return (
    <>
      {pathname.startsWith("/t") && <Thread thread={thread} />}
      <ChatBox userId={userId} thread={thread} />
    </>
  )
}
