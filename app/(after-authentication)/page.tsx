import { redirect } from "next/navigation"
import { auth } from "@/auth"
import '@/app/globals.css'
import ChatBox from "@/app/ui/chat/chat-box"

export default async function Page() {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  return (
    <ChatBox userId={session.user.id!} thread={null} />
  )
}
