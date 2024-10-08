"use client"

import { useState, useEffect } from "react"
import {usePathname} from 'next/navigation'
import clsx from "clsx"
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline"
import Button from "@/app/ui/common/button"

export default function SidebarContainer({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setIsOpen(false)
  }, [pathname]);

  return (
    <>
      {/* large screen */}
      <div className="hidden lg:col-span-2 lg:block">{children}</div>
      {/* small screen */}
      <div className="lg:hidden absolute w-full h-full left-0 top-0 z-10">
        <div className="bg-white shadow">
          <Button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? (
              <XMarkIcon className="w-8" />
            ) : (
              <Bars3Icon className="w-8" />
            )}
          </Button>
        </div>
        {isOpen && (
          <div className="">
            {children}
          </div>
        )}
      </div>
    </>
  )
}
