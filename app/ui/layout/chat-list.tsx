"use client"

import { useState, useEffect, useRef } from "react"
import clsx from 'clsx'
import Link from "next/link"
import {usePathname, useRouter} from 'next/navigation'
import { IThread } from "@/app/lib/types"
import Button from "@/app/ui/common/button"
import { deleteThread, updateThread } from "@/app/lib/api"

export default function ChatList({ threads }: { threads: IThread[] }) {
  const displayedThreadId = usePathname().split('/').slice(-1)[0]
  const router = useRouter()

  const [isMobile, setIsMobile] = useState(false)
  const [menuVisible, setMenuVisible] = useState(false)
  const [menuPos, setMenuPos] = useState({
    x: 0,
    y: 0,
  })
  const [targetThread, setTargetThread] = useState<IThread | null>(null)
  const [inputVal, setInputVal] = useState("")
  const [isEditing, setIsEditing] = useState(false)

  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>()

  const contextMenu = [
    {
      label: "Rename",
      handler: (event: React.MouseEvent, thread: IThread) => {
        setInputVal(thread.title)
        setIsEditing(true)
      },
    },
    {
      label: "Delete",
      handler: async (event: React.MouseEvent, thread: IThread) => {
        await deleteThread(thread.id)
        if (thread.id === displayedThreadId) {
          router.replace('/')
        }
      },
    },
  ]

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase()
    if (/android|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(userAgent)) {
      setIsMobile(true)
    }
  }, []);

  useEffect(() => {
    const handleClick = () => {
      setMenuVisible(false)
    }
    document.addEventListener("click", handleClick)
    return () => document.removeEventListener("click", handleClick)
  }, [])

  const handleRightClick = (event: React.MouseEvent, thread: IThread) => {
    if (!isMobile) {
      event.preventDefault()
      setMenuPos({
        x: event.clientX,
        y: event.clientY,
      })
      setTargetThread(thread)
      setMenuVisible(true)
    }
  }

  const handleTouchStart = (event: React.TouchEvent, thread: IThread) => {
    if (isMobile) {
      const touch = event.touches[0]
      timerRef.current = setTimeout(() => {
        setMenuPos({
          x: touch.pageX,
          y: touch.pageY,
        })
        setTargetThread(thread)
        setMenuVisible(true)
      }, 1000)
    }
  }

  const handleTouchEnd = () => {
    if (isMobile) {
      clearTimeout(timerRef.current)
    }
  }

  const handleTouchMove = () => {
    if (isMobile) {
      clearTimeout(timerRef.current)
    }
  }

  const handleSave = async () => {
    const updatedThread = {
      ...targetThread!,
      title: inputVal
    }
    await updateThread(targetThread!.id, updatedThread)
    setIsEditing(false)
  }

  return (
    <>
      <ul>
        {threads.map((thread) => {
          return (
            <li
              key={thread.id}
              onContextMenu={(e) => handleRightClick(e, thread)}
              onTouchStart={(e) => handleTouchStart(e, thread)}
              onTouchEnd={handleTouchEnd}
              onTouchMove={handleTouchMove}
            >
              {isEditing && targetThread && thread.id === targetThread.id ? (
                <div className="px-4 py-1">
                  <input type="text" value={inputVal} onChange={(e) => setInputVal(e.target.value)} className="text-neutral-800 mb-2 p-1" />
                  <div className="flex">
                    <Button className="text-sm flex-1 border-2 border-white bg-white text-neutral-800 rounded mr-2" size="small" onClick={handleSave}>
                      Save
                    </Button>
                    <Button className="text-sm flex-1 text-white border-2 border-white rounded" size="small" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <Link
                  href={`/t/${thread.id}`}
                  className={clsx(
                    "block w-full whitespace-nowrap overflow-hidden text-ellipsis px-4 py-1 rounded",
                    {
                      'bg-gray-600': displayedThreadId === thread.id
                    }
                  )}
                >
                  {thread.title}
                </Link>
              )}
            </li>
          )
        })}
      </ul>
      {menuVisible && (
        <ul
          className="absolute bg-white text-neutral-800 shadow rounded"
          style={{
            top: `${menuPos.y + 12}px`,
            left: `${menuPos.x + 12}px`,
          }}
        >
          {contextMenu.map((item) => {
            const { label, handler } = item
            return (
              <li key={label}>
                <Button
                  className="w-full hover:bg-neutral-100"
                  onClick={(e) => handler(e, targetThread!)}
                >
                  {label}
                </Button>
              </li>
            )
          })}
        </ul>
      )}
    </>
  )
}
