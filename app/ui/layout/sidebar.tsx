import Link from "next/link"
import {
  PlusIcon
} from '@heroicons/react/24/outline'
import { fetchThreads, signOut } from "@/app/lib/api"
import ChatList from '@/app/ui/layout/chat-list'
import Button from '@/app/ui/common/button'
import { auth } from "@/auth"

export default async function Sidebar() {
  let threads = await fetchThreads()
  if (!threads) {
    threads = []
  }
  return (
    <aside className="bg-gray-800 text-white col-span-2 relative">
      <Link href='/' className="flex items-center border-b-2 border-neutral-600 p-4 mb-4">
        <PlusIcon className="w-5 mr-1" />
        <span>New Chat</span>
      </Link>
      <ChatList threads={threads} />
      </div>
      <form action={signOut}>
        <Button type="submit" className="w-full px-8 py-2 flex items-center rounded-lg font-medium hover:bg-slate-100">Sign Out</Button>
      </form>
    </aside>
  )
}
