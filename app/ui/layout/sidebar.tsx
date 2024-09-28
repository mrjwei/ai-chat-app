import { fetchThreads } from "@/app/lib/api"
import Link from "next/link"

export default async function Sidebar() {
  let threads = await fetchThreads()
  if (!threads) {
    threads = []
  }
  return (
    <aside className="bg-gray-800 text-white p-4 col-span-2">
      <ul>
        {threads.map(thread => {
          return (
            <li>
              <Link href={`/t/${thread.id}`} className="block w-full whitespace-nowrap overflow-hidden text-ellipsis">
                {thread.title}
              </Link>
            </li>
          )
        })}
      </ul>
    </aside>
  )
}
