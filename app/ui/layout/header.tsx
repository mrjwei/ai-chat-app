import Link from "next/link"
import {
  PlusIcon
} from '@heroicons/react/24/outline'

export default async function Header() {
  return (
    <header className="bg-gray-100 p-4">
      <Link href='/' className="flex items-center">
        <PlusIcon className="w-5 mr-1" />
        <span>New Chat</span>
      </Link>
    </header>
  )
}
