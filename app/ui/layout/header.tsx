'use client'

import Link from 'next/link'
import { Bars3Icon, XMarkIcon, PlusIcon } from "@heroicons/react/24/outline"
import Button from '@/app/ui/common/button'
import SystemMessageSelect from '@/app/ui/chat/system-message-select'
import VoiceSelect from '@/app/ui/chat/voice-select'
import { ISystemMessage, IUser } from "@/app/lib/types"
import {useMenuStore} from '@/app/lib/stores'
import Profile from "@/app/ui/layout/profile"

export default function Header({systemMessages, user}: {systemMessages: ISystemMessage[] | undefined, user: IUser}) {
  const isOpen = useMenuStore((state) => state.isOpen)
  const setIsOpen = useMenuStore((state) => state.setIsOpen)

  const handleClick = () => {
    setIsOpen(!isOpen)
  }

  return (
    <header className="fixed top-0 w-full z-50 p-1 bg-white shadow flex justify-between">
      <Button onClick={handleClick}>
        {isOpen ? (
          <XMarkIcon className="w-6" />
        ) : (
          <Bars3Icon className="w-6" />
        )}
      </Button>
      <div className="flex items-center">
        <SystemMessageSelect messages={systemMessages} />
        <VoiceSelect />
        <Link href='/' className="px-4 py-2">
          <PlusIcon className="w-6" />
        </Link>
        <Profile user={user} />
      </div>
    </header>
  )
}
