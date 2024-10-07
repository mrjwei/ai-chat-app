import { redirect } from "next/navigation"
import '@/app/globals.css'
import ChatBox from "@/app/ui/chat/chat-box"

  if (!session) {
    redirect('/login')
  }
  return (
    <ChatBox thread={null} />
  )
}
