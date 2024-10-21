"use client"

import "regenerator-runtime/runtime"
import { useState, useContext, useEffect, useRef } from "react"
import dynamic from "next/dynamic"
import { v4 as uuidv4 } from "uuid"
import {
  PlayCircleIcon,
  StopCircleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/solid"
import Button from "@/app/ui/common/button"
import {
  transcribe,
  sendMessages,
  createThread,
  updateThread,
  fetchThreadById,
} from "@/app/lib/api"
import { TRole, IThread } from "@/app/lib/types"
import { SpeakingContext, SystemMessageContext } from "@/app/lib/contexts"
import TextBox from "@/app/ui/chat/text-box"
import { utter } from "@/app/lib/utilities"

const ReactMic = dynamic(
  () => import("react-mic").then((mod) => mod.ReactMic),
  { ssr: false }
)

export default function ChatBox({
  userId,
  thread,
}: {
  userId: string
  thread: IThread | null
}) {
  const { setIsSpeaking, setActiveMessage } = useContext(SpeakingContext)
  const { systemMessage } = useContext(SystemMessageContext)

  const shouldTranscribeRef = useRef(false)

  const [record, setRecord] = useState(false)
  const [textareaValue, setTextareaValue] = useState("")
  const [activeThread, setActiveThread] = useState<IThread | null>(thread)
  const [shouldUpdateThread, setShouldUpdateThread] = useState(false)

  useEffect(() => {
    const fetchThread = async () => {
      if (!activeThread) {
        return null
      }
      return await fetchThreadById(activeThread.id)
    }
    if (shouldUpdateThread) {
      fetchThread().then((res) => {
        if (res) {
          setActiveThread(res)
          setActiveMessage(res.messages.slice(-1)[0])
          utter({
            text: res.messages.slice(-1)[0].content,
            voiceIndex: 8,
            onStart: () => setIsSpeaking(true),
            onEnd: () => {
              setIsSpeaking(false)
              setShouldUpdateThread(false)
            }
          })
        }
      })
    }
  }, [shouldUpdateThread])

  const handleStart = () => {
    setRecord(true)
  }

  const handleStop = () => {
    shouldTranscribeRef.current = true
    setRecord(false)
  }

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

  const handleReset = () => {
    shouldTranscribeRef.current = false
    setRecord(false)
    setTextareaValue("")
  }

  const handleChange = (text: string) => {
    setTextareaValue(text)
  }

  const handleSend = async () => {
    setShouldUpdateThread(false)

    if (textareaValue) {
      if (thread === null) {
        // create thread
        const messages = [
          {
            id: uuidv4(),
            role: "system" as TRole,
            content: systemMessage,
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
        const thread = await fetchThreadById(id)
        if (thread) {
          setShouldUpdateThread(true)
        }
      } else {
        const newMessage = {
          id: uuidv4(),
          role: "user" as TRole,
          content: textareaValue,
        }
        const res = await sendMessages([...activeThread!.messages, newMessage])

        const updatedThread = {
          ...activeThread!,
          messages: [
            ...activeThread!.messages,
            newMessage,
            {
              id: uuidv4(),
              role: "assistant" as TRole,
              content: res.content,
            },
          ],
        }
        await updateThread(activeThread!.id, updatedThread)
        setShouldUpdateThread(true)
      }
      setTextareaValue("")
    }
  }

  return (
    <div className="sticky bottom-0 right-0 px-4 lg:px-8 py-4 w-full bg-gray-100 shadow flex items-stretch justify-center z-40">
      <ReactMic
        record={record}
        className="hidden"
        onStop={handleTranscribe}
        mimeType="audio/wav"
        strokeColor="#000"
        backgroundColor="#FF4081"
      />
      <div className="flex mr-1">
        {record ? (
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
      <TextBox
        value={textareaValue}
        handleChange={handleChange}
        handleSend={handleSend}
      />
    </div>
  )
}
