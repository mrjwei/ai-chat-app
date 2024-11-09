"use client"

import "regenerator-runtime/runtime"
import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { v4 as uuidv4 } from "uuid"
import {
  transcribe,
  sendMessages,
  createThread,
  updateThread,
} from "@/app/lib/api"
import { TRole, IThread } from "@/app/lib/types"
import TextBox from "@/app/ui/chat/text-box"
import Recorder from "@/app/ui/chat/recorder"
import { utter } from "@/app/lib/utilities"
import {useSpeakingMessageStore, useVoiceStore, useSystemMessageStore} from '@/app/lib/stores'

export default function ChatBox({
  userId,
  thread,
}: {
  userId: string
  thread: IThread | null
}) {
  const router = useRouter()

  const setSpeakingMessage = useSpeakingMessageStore((state) => state.setSpeakingMessage)
  const voiceIndex = useVoiceStore((state) => state.voiceIndex)
  const systemMessage = useSystemMessageStore((state) => state.systemMessage)

  const shouldTranscribeRef = useRef(false)

  const [record, setRecord] = useState(false)
  const [textareaValue, setTextareaValue] = useState("")

  const handleTranscribe = async (recordedBlob: any) => {
    if (shouldTranscribeRef.current) {
      const transcript = await transcribe(recordedBlob.blob)
      setTextareaValue((prev) => {
        if (
          transcript.endsWith(".") ||
          transcript.endsWith(",") ||
          transcript.endsWith(";") ||
          transcript.endsWith(":") ||
          transcript.endsWith("?") ||
          transcript.endsWith("!")
        ) {
          return prev + transcript + " "
        } else {
          return prev + transcript + ". "
        }
      })
    }
    shouldTranscribeRef.current = false
  }

  const handleStart = () => {
    setRecord(true)
  }

  const handleStop = () => {
    shouldTranscribeRef.current = true
    setRecord(false)
  }

  const handleReset = () => {
    shouldTranscribeRef.current = false
    setRecord(false)
    setTextareaValue("")
  }

  const handleChange = (text: string) => {
    setTextareaValue(text)
  }

  const handleSend = async () => {
    if (textareaValue) {
      if (thread === null) {
        // create thread
        const messages = [
          {
            id: uuidv4(),
            role: "system" as TRole,
            content: systemMessage!.content,
          },
          {
            id: uuidv4(),
            role: "user" as TRole,
            content: textareaValue,
          },
        ]
        const res = await sendMessages(messages)

        const newThread = {
          userId,
          title: "Untitled",
          description: "",
          messages: [
            ...messages,
            {
              id: uuidv4(),
              role: "assistant" as TRole,
              content: res.content,
            },
          ],
        }

        const id = await createThread(newThread)
        if (id) {
          router.replace(`/t/${id}`)
          setSpeakingMessage(newThread.messages.slice(-1)[0])
          utter({
            text: newThread.messages.slice(-1)[0].content,
            voiceIndex,
            onStart: null,
            onEnd: () => setSpeakingMessage(null),
          })
        }
      } else {
        const newMessage = {
          id: uuidv4(),
          role: "user" as TRole,
          content: textareaValue,
        }
        const res = await sendMessages([...thread.messages, newMessage])

        const updatedThread = {
          ...thread!,
          messages: [
            ...thread!.messages,
            newMessage,
            {
              id: uuidv4(),
              role: "assistant" as TRole,
              content: res.content,
            },
          ],
        }

        await updateThread(thread!.id, updatedThread)
        setSpeakingMessage(updatedThread.messages.slice(-1)[0])
        utter({
          text: updatedThread.messages.slice(-1)[0].content,
          voiceIndex,
          onStart: null,
          onEnd: () => setSpeakingMessage(null),
        })
      }
      setTextareaValue("")
    }
  }

  return (
    <div className="sticky bottom-0 right-0 px-4 lg:px-8 py-2 w-full bg-gray-100 shadow flex items-stretch justify-center z-30">
      <Recorder
        record={record}
        handleStart={handleStart}
        handleStop={handleStop}
        handleReset={handleReset}
        handleTranscribe={handleTranscribe}
      />
      <TextBox
        value={textareaValue}
        handleChange={handleChange}
        handleSend={handleSend}
      />
    </div>
  )
}
