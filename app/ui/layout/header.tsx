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
    <header className="fixed top-0 w-full z-50 px-4 py-1 bg-white shadow grid grid-cols-12 gap-2">
      <Button onClick={handleClick} className="col-span-2 !p-0">
        {isOpen ? (
          <XMarkIcon className="w-6" />
        ) : (
          <Bars3Icon className="w-6" />
        )}
      </Button>
      <div className="col-span-10 grid grid-cols-subgrid gap-2">
        <SystemMessageSelect messages={systemMessages} className="col-span-4" />
        <VoiceSelect className="col-span-4" />
        <div className="col-span-2 grid grid-cols-6">
          <Link href='/' className=" w-full flex items-center justify-center col-span-3 lg:col-span-2 lg:col-start-2">
            <PlusIcon className="w-6" />
          </Link>
          <Profile user={user} className="col-span-3 lg:col-span-2" />
        </div>
      </div>
    </header>
  )
}
