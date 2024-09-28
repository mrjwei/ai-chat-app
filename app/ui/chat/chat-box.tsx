"use client"

import "regenerator-runtime/runtime"
import { useContext, useState } from "react"
import {
  PlayCircleIcon,
  StopCircleIcon,
  ArrowPathIcon,
  ArrowUpCircleIcon
} from '@heroicons/react/24/solid'
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition"
import Button from "@/app/ui/common/button"
import { CurrentThreadContext } from "@/app/lib/contexts"
import { sendMessage } from "@/app/lib/api"

export default function ChatBox() {
  const [status, setStatus] = useState("idle")
  const [textareaValue, setTextareaValue] = useState("")
  const { thread, setThread } = useContext(CurrentThreadContext)

  if (!thread) {
    return
  }

  const { transcript, resetTranscript, listening } = useSpeechRecognition()

  const handleStart = () => {
    setStatus("recording")
    resetTranscript()
    SpeechRecognition.startListening({ continuous: true, language: "en-GB" })
  }

  const handleStop = () => {
    setStatus("idle")
    SpeechRecognition.stopListening()
    if (transcript) {
      setTextareaValue(textareaValue + transcript.trim() + ". ")
    }
  }

  const handleReset = () => {
    if (listening) {
      SpeechRecognition.stopListening()
    }
    setStatus("idle")
    setTextareaValue("")
    resetTranscript()
  }

  const handleSend = async () => {
    if (textareaValue) {
      setThread({
        ...thread,
        messages: [...thread.messages, { role: "user", content: textareaValue }]
      })
      const response = await sendMessage(textareaValue)
      setThread({
        ...thread,
        messages: [
          ...thread.messages,
          { role: "user", content: textareaValue },
          { role: "bot", content: response },
        ]
      })
      const utterance = new SpeechSynthesisUtterance(response)
      utterance.lang = "en-GB"
      utterance.voice = window.speechSynthesis.getVoices()[8]
      window.speechSynthesis.speak(utterance)
      setTextareaValue("")
    }
    resetTranscript()
  }

  return (
    <div className="px-8 py-4 w-full bg-gray-100 shadow grid grid-cols-12 gap-4">
      <div className="flex col-span-2">
        {status === "recording" ? (
          <Button onClick={handleStop} className="block h-full text-red-500">
            <StopCircleIcon className="w-8"/>
          </Button>
        ) : (
          <Button onClick={handleStart} className="block h-full">
            <PlayCircleIcon className="w-8"/>
          </Button>
        )}
        <Button onClick={handleReset}>
          <ArrowPathIcon className="w-8"/>
        </Button>
      </div>
      <textarea
        className="block w-full col-span-8 md:max-w-3xl lg:max-w-[40rem] xl:max-w-[48rem] mx-auto p-2 rounded-md -translate-x-[7.5px]"
        value={textareaValue}
        onChange={(e) => setTextareaValue(e.target.value)}
        placeholder="Record or type your message..."
      ></textarea>
      <div className="col-span-2">
        <Button onClick={handleSend} className="block h-full">
          <ArrowUpCircleIcon className="w-8"/>
        </Button>
      </div>
    </div>
  )
}
