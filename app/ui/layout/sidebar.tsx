import Link from "next/link"
import {
  PlusIcon
} from '@heroicons/react/24/outline'
import { fetchThreads } from "@/app/lib/api"
import ChatList from '@/app/ui/layout/chat-list'
import { auth } from "@/auth"
import Profile from '@/app/ui/layout/profile'
import { IThread, IUser } from "@/app/lib/types"

export default async function Sidebar() {
  const session = await auth()

  if (!session) {
    return
  }

  const threads = await fetchThreads(session.user.id!) as IThread[]
  console.log(session.user.id)
  console.log(JSON.stringify(threads))
  return (
    <aside className="bg-gray-800 text-white col-span-2 sticky top-0 h-screen flex flex-col justify-between">
      <div className="">
        <Link href='/' className="flex items-center border-b-2 border-gray-600 p-4 mb-4">
          <PlusIcon className="w-5 mr-1" />
          <span>New Chat</span>
        </Link>
        <ChatList threads={threads} />
      </div>
      <Profile user={session.user as IUser} />
    </aside>
  )
}
