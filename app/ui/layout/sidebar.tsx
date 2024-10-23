'use client'

import {useEffect} from 'react'
import {useShallow} from 'zustand/shallow'
import {usePathname} from 'next/navigation'
import clsx from "clsx"
import ThreadList from "@/app/ui/layout/thread-list"
import Profile from "@/app/ui/layout/profile"
import { IThread, IUser } from "@/app/lib/types"
import {useMenuStore} from '@/app/lib/stores'

export default function Sidebar({threads, user}: {threads: IThread[], user: IUser}) {
  const pathname = usePathname()

  const {isOpen, setIsOpen} = useMenuStore(useShallow((state) => ({
    isOpen: state.isOpen,
    setIsOpen: state.setIsOpen
  })))

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

  useEffect(() => {
    setIsOpen(false)
  }, [pathname]);

  return (
    <aside className={clsx(
      `${isOpen ? 'flex' : 'hidden'} bg-neutral-800 text-white flex-col justify-between p-4 text-sm absolute w-full z-40 lg:w-72 h-[calc(100vh-48px)] lg:sticky top-[48px]`
    )}>
      <ThreadList threads={threads} />
      <Profile user={user} />
    </aside>
  )
}
