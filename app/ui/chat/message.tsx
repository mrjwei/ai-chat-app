"use client"

import { useState, useContext } from "react"
import Markdown from "react-markdown"
import clsx from "clsx"
import {
  StopCircleIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/solid'
import Button from "@/app/ui/common/button"
import { SpeakingContext } from "@/app/lib/contexts"
import { IMessage } from "@/app/lib/types"

export default function Message({message }: {message: IMessage }) {
  const {isSpeaking, setIsSpeaking} = useContext(SpeakingContext)

  const [isActive, setIsActive] = useState(false);

  const handleToggle = (e: React.MouseEvent) => {
    if (isSpeaking) {
      setIsActive(false)
      setIsSpeaking(false)
      window.speechSynthesis.cancel()
    } else {
      setIsActive(true)
      setIsSpeaking(true)
      const utterance = new SpeechSynthesisUtterance(message.content)
      utterance.lang = "en-GB"
      utterance.voice = window.speechSynthesis.getVoices()[8]
      window.speechSynthesis.speak(utterance)
      utterance.onend = () => setIsSpeaking(false)
    }
  }

  return (
    <div
      className={clsx("max-w-full p-4 rounded-md shadow", {
        "bg-gray-100": message.role === "user",
        "bg-blue-100": message.role === "assistant",
      })}
    >
      {message.role === "assistant" ? (
        <div className="flex items-center">
          <div>
            <Markdown>{message.content}</Markdown>
          </div>
          <Button
            id={message.id}
            onClick={handleToggle}
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
