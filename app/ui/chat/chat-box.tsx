"use client"

import "regenerator-runtime/runtime"
import { useState, useContext, useEffect, useRef } from "react"
import { v4 as uuidv4 } from "uuid"
import {
  PlayCircleIcon,
  StopCircleIcon,
  ArrowPathIcon,
  ArrowUpCircleIcon,
} from "@heroicons/react/24/solid"
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition"
import Button from "@/app/ui/common/button"
import { sendMessage, createThread, updateThread } from "@/app/lib/api"
import { TRole, IThread } from "@/app/lib/types"
import { SpeakingContext } from "@/app/lib/contexts"

export default function ChatBox({
  userId,
  thread,
}: {
  userId: string
  thread: IThread | null
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const { setIsSpeaking } = useContext(SpeakingContext)

  const [status, setStatus] = useState("idle")
  const [textareaValue, setTextareaValue] = useState("")

  const { transcript, resetTranscript, listening } = useSpeechRecognition()

  useEffect(() => {
    if (textareaRef.current) {
      if (textareaValue === "") {
        textareaRef.current.style.height = "auto"
      } else {
        const height = textareaRef.current.scrollHeight
        textareaRef.current.style.height = height + "px"
      }
    }
  }, [textareaValue])

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
      const response = await sendMessage(textareaValue)

      if (thread === null) {
        const newThread = {
          userId,
          title: "Untitled",
          description: "",
          messages: [
            {
              id: uuidv4(),
              role: "user" as TRole,
              content: textareaValue,
            },
            {
              id: uuidv4(),
              role: "bot" as TRole,
              content: response,
            },
          ],
        }
        await createThread(newThread)
      } else {
        const updatedThread = {
          ...thread,
          messages: [
            ...thread.messages,
            {
              id: uuidv4(),
              role: "user" as TRole,
              content: textareaValue,
            },
            {
              id: uuidv4(),
              role: "bot" as TRole,
              content: response,
            },
          ],
        }
        await updateThread(thread.id, updatedThread)
      }

      handleStartUttering(response)
      setTextareaValue("")
    }
    resetTranscript()
  }

  const handleStartUttering = (text: string) => {
    setIsSpeaking(true)
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = "en-GB"
    utterance.voice = window.speechSynthesis.getVoices()[8]
    window.speechSynthesis.speak(utterance)
    utterance.onend = () => setIsSpeaking(false)
  }

  return (
    <div className="sticky bottom-0 right-0 px-4 lg:px-8 py-4 w-full bg-gray-100 shadow flex items-stretch justify-center z-40">
      <div className="flex mr-1">
        {status === "recording" ? (
          <Button onClick={handleStop} className="text-red-500 !p-2">
            <StopCircleIcon className="w-8" />
          </Button>
        ) : (
          <Button onClick={handleStart} className="!p-2">
            <PlayCircleIcon className="w-8" />
          </Button>
        )}
        <Button onClick={handleReset} className="!p-2">
          <ArrowPathIcon className="w-8" />
        </Button>
      </div>
      <textarea
        ref={textareaRef}
        className="block flex-1 min-w-40 lg:max-w-[40rem] p-2 rounded-md -translate-x-[7.5px] mr-1"
        value={textareaValue}
        onChange={(e) => setTextareaValue(e.target.value)}
        placeholder="Record or type your message..."
      ></textarea>
      <Button onClick={handleSend} className="!p-2">
        <ArrowUpCircleIcon className="w-8" />
      </Button>
    </div>
  )
}
