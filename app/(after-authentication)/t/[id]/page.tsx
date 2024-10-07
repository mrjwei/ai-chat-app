import { redirect } from "next/navigation"
import { fetchThreadById } from "@/app/lib/api"
import { IThread } from "@/app/lib/types"
import ChatBox from "@/app/ui/chat/chat-box"
import Messages from "@/app/ui/chat/messages"

export default async function Page({params}: {params: {id: string}}) {
  if (!session) {
    redirect('/login')
  }
  const id = params.id
  const thread = await fetchThreadById(id) as IThread

  return (
    <>
      <Messages thread={thread} />
      <ChatBox thread={thread} />
    </>
  )
}
