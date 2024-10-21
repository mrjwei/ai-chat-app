"use client"

import { useEffect, useRef } from "react"
import { ArrowUpCircleIcon } from "@heroicons/react/24/solid"
import Button from "@/app/ui/common/button"

export default function TextBox({ value, handleChange, handleSend }: {value: string, handleChange: (val: string) => void, handleSend: () => void}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      if (value === "") {
        textareaRef.current.style.height = "auto"
      } else {
        const height = textareaRef.current.scrollHeight
        textareaRef.current.style.height = height + "px"
      }
    }
  }, [value])

  return (
    <>
      <textarea
        ref={textareaRef}
        className="block flex-1 min-w-40 lg:max-w-[40rem] p-2 rounded-md -translate-x-[7.5px] mr-1"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Record or type your message..."
      ></textarea>
      <Button onClick={handleSend} className="!p-2">
        <ArrowUpCircleIcon className="w-8" />
      </Button>
    </>
  )
}
