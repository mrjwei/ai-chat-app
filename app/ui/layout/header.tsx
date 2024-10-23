'use client'

import Link from 'next/link'
import { Bars3Icon, XMarkIcon, PlusIcon } from "@heroicons/react/24/outline"
import {useShallow} from 'zustand/shallow'
import Button from '@/app/ui/common/button'
import SystemMessageSelect from '@/app/ui/chat/system-message-select'
import VoiceSelect from '@/app/ui/chat/voice-select'
import { ISystemMessage } from "@/app/lib/types"
import {useMenuStore} from '@/app/lib/stores'

export default function Header({systemMessages}: {systemMessages: ISystemMessage[] | undefined}) {
  const {isOpen, setIsOpen} = useMenuStore(
    useShallow((state) => ({
      isOpen: state.isOpen,
      setIsOpen:state.setIsOpen
    }))
  )

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
      </div>
    </header>
  )
}
