import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { fetchThreadById, fetchSystemMessages } from "@/app/lib/api"
import { IThread } from "@/app/lib/types"
import ChatWindow from "@/app/ui/chat/chat-window"

export default async function Page({params}: {params: {id: string}}) {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  const id = params.id
  const thread = await fetchThreadById(id) as IThread
  const systemMessages = await fetchSystemMessages(session.user.id!)

  return (
    <ChatWindow thread={thread} userId={session.user.id!} />
  )
}
