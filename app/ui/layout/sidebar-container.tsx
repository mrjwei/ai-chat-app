"use client"

import { useState, useEffect } from "react"
import {usePathname} from 'next/navigation'
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline"
import Button from "@/app/ui/common/button"
import SystemMessageSelect from "@/app/ui/chat/system-message-select"
import { ISystemMessage } from "@/app/lib/types"

export default function SidebarContainer({
  systemMessages,
  children,
}: {
  systemMessages: ISystemMessage[] | undefined,
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setIsOpen(false)
  }, [pathname]);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [isOpen])

  return (
    <>
      {/* large screen */}
      <div className="hidden lg:col-span-2 lg:block">{children}</div>
      {/* small screen */}
      <div className="lg:hidden fixed w-full left-0 top-0 z-50">
        <div className="bg-white shadow flex items-center justify-between">
          <Button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? (
              <XMarkIcon className="w-8" />
            ) : (
              <Bars3Icon className="w-8" />
            )}
          </Button>
          <SystemMessageSelect messages={systemMessages} />
        </div>
        {isOpen && (
          <div className="h-[calc(100vh-48px)]">
            {children}
          </div>
        )}
      </div>
    </>
  )
}
