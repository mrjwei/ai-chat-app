"use client"

import "regenerator-runtime/runtime"
import { useState, useContext, useEffect, useRef } from "react"
import { v4 as uuidv4 } from "uuid"
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
import Recorder from "@/app/ui/chat/recorder"
import { utter } from "@/app/lib/utilities"

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
            },
          })
        }
      })
    }
  }, [shouldUpdateThread])

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
