'use client'

import {useState, useRef, useEffect} from 'react'
import Link from 'next/link'
import clsx from 'clsx'
import { usePathname, useSearchParams } from 'next/navigation'
import {
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline'
import { signOut } from "@/app/lib/api"
import Button from '@/app/ui/common/button'
import { IUser } from "@/app/lib/types"

export default function Profile({user}: {user: IUser}) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const profileRef = useRef<HTMLButtonElement>(null)
  const profileMenuRef = useRef<HTMLUListElement>(null)

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  useEffect(() => {
    const handleClickOnWindow = (event: MouseEvent) => {
      if (profileRef.current && profileMenuRef.current && !profileRef.current.contains(event.target as Node) && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false)
      }
    }
    document.addEventListener('click', handleClickOnWindow)
    return () => document.removeEventListener('click', handleClickOnWindow)
  }, [])

  useEffect(() => {
    setIsProfileMenuOpen(false)
  }, [pathname, searchParams])

  return (
    <div className="w-full relative">
      <Button
        type="button"
        className={clsx(
          'w-full flex items-center text-white px-4 py-1 rounded',
          {
            'bg-gray-600': isProfileMenuOpen
          }
        )}
        onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
        ref={profileRef}
      >
        <span className="mr-2">{user.name}</span>
        {isProfileMenuOpen ? (<ChevronUpIcon className="w-4" />) : (<ChevronDownIcon className="w-4" />)}
      </Button>
      {isProfileMenuOpen && (
        <ul className="absolute w-2/3 bottom-full -translate-y-1 left-0 bg-white shadow-md rounded p-2" ref={profileMenuRef}>
          <li>
            <Link href="/setting" className="block text-gray-800 p-2 rounded hover:bg-gray-100">Setting</Link>
          </li>
          <li>
            <form action={signOut}>
              <Button type="submit" className="w-full !p-2 flex items-center rounded text-gray-800 font-normal hover:bg-gray-100">Sign Out</Button>
            </form>
          </li>
        </ul>
      )}
    </div>
  )
}
