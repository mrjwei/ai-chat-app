"use client"

import { useState } from "react"
import clsx from "clsx"
import {
  ChevronDownIcon,
  ChevronUpIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline"
import Button from "@/app/ui/common/button"
import {updateSystemMessage, deleteSystemMessage} from '@/app/lib/api'

export default function Accordion({ items }: { items: any }) {
  const [activeId, setActiveId] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [labelInput, setLabelInput] = useState<string | undefined>()
  const [contentInput, setContentInput] = useState<string | undefined>();

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    if ((e.target as HTMLElement).tagName === "DIV" || (e.target as HTMLElement).tagName === "SPAN") {
      if ((e.currentTarget as HTMLDivElement).id === activeId) {
        setActiveId("")
        setIsEditing(false)
      } else {
        setActiveId((e.currentTarget as HTMLDivElement).id)
      }
    }
  }

  const handleEdit = (id: string) => {
    setActiveId(id)
    setIsEditing(true)
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteSystemMessage(id)
    } catch (error) {
      console.log("Failed to handle deletion of system message: ", error)
    }
  }

  const handleSave = async (id: string) => {
    try {
      await updateSystemMessage(id, labelInput, contentInput)
      setIsEditing(false)
      setLabelInput(undefined)
      setContentInput(undefined)
    } catch (error) {
      console.log("Failed to handle saving of system message: ", error)
    }
  }

  const handleCancel = () => {
    setActiveId("")
    setIsEditing(false)
  }

  return (
    <ul>
      {items.map((item: any) => {
        const { id, label, content } = item
        return (
          <li
            key={id}
          >
            <div
              id={id}
              className={clsx(
                "flex justify-between items-center cursor-pointer text-purple-500 p-2 hover:bg-purple-50",
                {
                  "bg-purple-50": activeId === id,
                }
              )}
              onClick={handleClick}
            >
              {(isEditing && activeId === id) ? (
                <input className="text-neutral-800" type="text" defaultValue={label} value={labelInput} onChange={(e) => setLabelInput(e.target.value)} />
              ) : (
                <span>{label}</span>
              )}
              <div className="flex items-center">
                <Button className="!p-2 text-neutral-400 hover:text-neutral-800" onClick={() => handleEdit(id)}>
                  <PencilIcon className="w-5" />
                </Button>
                <Button className="!p-2 text-red-300 hover:text-red-600 mr-4" onClick={() => handleDelete(id)}>
                  <TrashIcon className="w-5" />
                </Button>
                {activeId === id ? (
                  <ChevronUpIcon className="w-5" />
                ) : (
                  <ChevronDownIcon className="w-5" />
                )}
              </div>
            </div>
            {(isEditing && activeId === id) ? (
              <div>
                <textarea className="block w-full my-2 p-2 border-2 border-neutral-100" defaultValue={content} value={contentInput} onChange={(e) => setContentInput(e.target.value)} />
                <Button size="small" className="border-2 border-neutral-800 bg-neutral-800 text-white rounded mr-2" onClick={() => handleSave(id)}>Save</Button>
                <Button size="small" className="border-2 border-neutral-800 rounded" onClick={handleCancel}>Cancel</Button>
              </div>
            ) : (
              <span
              className={clsx("text-neutral-800 p-2", {
                "block": activeId === id,
                "hidden": activeId !== id,
              })}
            >
              {content}
            </span>
            )}
          </li>
        )
      })}
    </ul>
  )
}
