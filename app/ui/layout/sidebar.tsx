import Link from "next/link"
import { PlusIcon } from "@heroicons/react/24/outline"
import { fetchThreads } from "@/app/lib/api"
import ChatList from "@/app/ui/layout/chat-list"
import { auth } from "@/auth"
import Profile from "@/app/ui/layout/profile"
import { IThread, IUser } from "@/app/lib/types"

export default async function Sidebar() {
  const session = await auth()

  if (!session) {
    return
  }

  const threads = (await fetchThreads(session.user.id!)) as IThread[]

  return (
    <aside className="bg-gray-800 text-white h-screen lg:flex lg:flex-col justify-between p-4 text-sm lg:sticky top-0">
      <div>
        <Link href="/" className="flex items-center p-2 rounded border-2 border-white mb-4 font-medium hover:text-gray-800 hover:bg-white">
          <PlusIcon className="w-5 mr-1" />
          <span>New Chat</span>
        </Link>
        <ChatList threads={threads} />
      </div>
      <Profile user={session.user as IUser} />
    </aside>
  )
}
