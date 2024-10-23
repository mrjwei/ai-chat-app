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
        btnClassName="text-white !w-full"
        btnClassNameOnOpen="bg-neutral-600"
        menuClassName="absolute w-2/3 bottom-full -translate-y-1 left-0"
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
