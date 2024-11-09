"use client"

import Link from "next/link"
import clsx from 'clsx'
import { UserCircleIcon } from "@heroicons/react/24/outline"
import { signOut } from "@/app/lib/api"
import Button from "@/app/ui/common/button"
import Dropdown from "@/app/ui/common/dropdown"
import { IUser } from "@/app/lib/types"

export default function Profile({ user, className }: { user: IUser, className?: string }) {
  return (
    <div className={clsx(
      "relative w-full flex justify-center items-center",
      className
    )}>
      <Dropdown
        initialLabel={<UserCircleIcon className="w-6" />}
        hasChevron={false}
        className="block text-neutral-600 rounded"
        btnClassName="w-full !p-2"
        btnClassNameOnOpen="bg-neutral-100"
        menuClassName="absolute top-full right-0 z-50 translate-y-2"
      >
        <>
          <li>
            <Link
              href="/setting"
              className="block text-gray-800 p-2 rounded hover:bg-gray-100 whitespace-nowrap"
            >
              Setting
            </Link>
          </li>
          <li>
            <form action={signOut}>
              <Button
                type="submit"
                className="w-full !p-2 flex items-center rounded text-gray-800 font-normal hover:bg-gray-100 whitespace-nowrap"
              >
                Sign Out
              </Button>
            </form>
          </li>
        </>
      </Dropdown>
    </div>
  )
}
