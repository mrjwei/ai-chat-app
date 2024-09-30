import Link from "next/link"
import {
  PlusIcon
} from '@heroicons/react/24/outline'
import { fetchThreads } from "@/app/lib/api"
import ChatList from '@/app/ui/layout/chat-list'

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
    </aside>
  )
}
