"use client"

import Markdown from "react-markdown"
import clsx from "clsx"
import {
  StopCircleIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/solid'
import Button from "@/app/ui/common/button"
import { IMessage } from "@/app/lib/types"

export default function Message({isActive, message, handleToggle, isSpeaking}: {isActive: boolean, message: IMessage, handleToggle: (message: IMessage) => void, isSpeaking: boolean }) {

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
              "text-red-500": isSpeaking && isActive
            })}
          >
            {(isSpeaking && isActive) ? (
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
