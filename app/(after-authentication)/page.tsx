import { redirect } from "next/navigation"
import { auth } from "@/auth"
import '@/app/globals.css'
import ChatWindow from "@/app/ui/chat/chat-window"

export default async function Page() {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  return (
    <ChatWindow thread={null} userId={session.user.id!} />
  )
}
