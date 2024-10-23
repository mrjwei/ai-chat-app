"use client"

import Link from "next/link"
import { signOut } from "@/app/lib/api"
import Button from "@/app/ui/common/button"
import Dropdown from "@/app/ui/common/dropdown"
import { IUser } from "@/app/lib/types"

export default function Profile({ user }: { user: IUser }) {
  return (
    <div className="relative w-full">
      <Dropdown
        initialLabel={user.name}
        btnClassName="w-28"
        btnClassNameOnOpen="bg-neutral-100"
        menuClassName="absolute top-full right-0 z-50 translate-y-2"
      >
        <>
          <li>
            <Link
              href="/setting"
              className="block text-gray-800 p-2 rounded hover:bg-gray-100"
            >
              Setting
            </Link>
          </li>
          <li>
            <form action={signOut}>
              <Button
                type="submit"
                className="w-full !p-2 flex items-center rounded text-gray-800 font-normal hover:bg-gray-100"
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
