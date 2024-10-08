"use client"

import "regenerator-runtime/runtime"
import { useState, useContext } from "react"
import {v4 as uuidv4} from 'uuid'
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
import { sendMessage, createThread, updateThread } from "@/app/lib/api"
import { TRole, IThread } from "@/app/lib/types"
import { SpeakingContext } from "@/app/lib/contexts"

export default function ChatBox({userId, thread}: {userId: string, thread: IThread | null}) {
  const {setIsSpeaking} = useContext(SpeakingContext)

  const [status, setStatus] = useState("idle")
  const [textareaValue, setTextareaValue] = useState("")

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
      const response = await sendMessage(textareaValue)

      if (thread === null) {
        const newThread = {
          userId,
          title: 'Untitled',
          description: '',
          messages: [
            {
              id: uuidv4(),
              role: 'user' as TRole,
              content: textareaValue
            },
            {
              id: uuidv4(),
              role: 'bot' as TRole,
              content: response
            }
          ]
        }
        await createThread(newThread)
      } else {
        const updatedThread = {
          ...thread,
          messages: [
            ...thread.messages,
            {
              id: uuidv4(),
              role: 'user' as TRole,
              content: textareaValue
            },
            {
              id: uuidv4(),
              role: 'bot' as TRole,
              content: response
            }
          ]
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
    <div className="sticky bottom-0 right-0 px-8 py-4 w-full bg-gray-100 shadow grid grid-cols-12 gap-4">
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
