"use client"

import { useContext } from "react"
import Markdown from "react-markdown"
import clsx from "clsx"
import {
  StopCircleIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/solid'
import Button from "@/app/ui/common/button"
import { IMessage } from "@/app/lib/types"
import { SpeakingContext } from "@/app/lib/contexts"
import {utter, cancelUtter} from '@/app/lib/utilities'

export default function Message({message}: {message: IMessage }) {
  const {isSpeaking, setIsSpeaking, activeMessage, setActiveMessage} = useContext(SpeakingContext)

  const handleToggle = (message: IMessage) => {
    if (isSpeaking) {
      setIsSpeaking(false)
      setActiveMessage(null)
      cancelUtter()
    } else {
      setActiveMessage(message)
      utter({text: message.content, voiceIndex: 8, onStart: () => setIsSpeaking(true), onEnd: () => setIsSpeaking(false)})
    }
  }

  return (
    <div
      className={clsx("max-w-full p-4 rounded-md shadow", {
        "bg-gray-100": message.role === "user",
        "bg-blue-50": message.role === "assistant",
      })}
    >
      {message.role === "assistant" ? (
        <div className="flex items-center">
          <div>
            <Markdown>{message.content}</Markdown>
          </div>
          <Button
            id={message.id}
            onClick={() => handleToggle(message)}
            className={clsx("block h-full", {
              "text-red-500": isSpeaking && activeMessage?.id === message.id
            })}
          >
            {(isSpeaking && activeMessage?.id === message.id) ? (
              <StopCircleIcon className="w-6" />
            ) : (
              <ArrowPathIcon className="w-6" />
            )}
          </Button>
        </div>
      ) : (
        message.content
      )}
    </div>
  )
}
