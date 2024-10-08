'use client'

import {useState} from 'react'
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline"
import Button from '@/app/ui/common/button'

export default function SidebarContainer({children}: {children: React.ReactNode}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div>
      <Button onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? (<XMarkIcon className="w-8"/>) : (<Bars3Icon className="w-8"/>)}
      </Button>
      {isOpen && (children)}
    </div>
  )
}
