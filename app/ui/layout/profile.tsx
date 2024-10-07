'use client'

import {useState, useRef, useEffect} from 'react'
import Link from 'next/link'
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
        className={`w-full flex items-center text-white ${isProfileMenuOpen ? 'bg-gray-600' : ''}`}
        onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
        ref={profileRef}
      >
        <span className="mr-2">{user.name}</span>
        {isProfileMenuOpen ? (<ChevronUpIcon className="w-4" />) : (<ChevronDownIcon className="w-4" />)}
      </Button>
      {isProfileMenuOpen && (
        <ul className="absolute bottom-full -translate-y-1 left-2 bg-white shadow-md rounded-lg p-2" ref={profileMenuRef}>
          <li>
            <Link href="/" className="block w-full text-gray-800 px-8 py-2 rounded-lg hover:bg-gray-100">Setting</Link>
          </li>
          <li>
            <form action={signOut}>
              <Button type="submit" className="w-full px-8 py-2 flex items-center rounded-lg font-medium text-gray-800 hover:bg-gray-100">Sign Out</Button>
            </form>
          </li>
        </ul>
      )}
    </div>
  )
}
