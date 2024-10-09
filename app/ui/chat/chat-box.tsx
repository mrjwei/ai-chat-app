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
import { sendMessages, createThread, updateThread, fetchThreadById } from "@/app/lib/api"
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
  const [activeThread, setActiveThread] = useState<IThread | null>(thread)
  const [shouldUpdateThread, setShouldUpdateThread] = useState(false)

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

  useEffect(() => {
    const fetchThread = async () => {
      if (!activeThread) {
        return null
      }
      return await fetchThreadById(activeThread.id)
    }
    if (shouldUpdateThread) {
      fetchThread().then(res => {
        if (res) {
          setActiveThread(res)
        }
      })
    }
  }, [shouldUpdateThread])

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
    setShouldUpdateThread(false)

    if (textareaValue) {
      let response
      if (thread === null) {
        // create thread
        const messages = [
          {
            id: uuidv4(),
            role: "system" as TRole,
            content: 'You are a native English teacher. From now on, please help me practise English speaking for IELTS speaking test. You should ask me 4 to 5 questions in total on a topic about me or things that are closely related to me. You should ask only one question per time and should end our conversation after the specified number of questions by signaling that it is the end for the practice. If relevant, please correct my major mistakes that impede understanding while ignoring minor errors. Please also suggest more idiomatic words and expressions where relevant. Please choose questions as close to the real test as possible and please use UK English instead of US English. After final question, please give me a score based on IELTS 9.0 scale.',
          },
          {
            id: uuidv4(),
            role: 'user' as TRole,
            content: textareaValue
          }
        ]
        response = await sendMessages(messages)

        const newThread = {
          userId,
          title: "Untitled",
          description: "",
          messages: [
            ...messages,
            {
              id: uuidv4(),
              role: "assistant" as TRole,
              content: response,
            },
          ]
        }
        const id = await createThread(newThread)
        const thread = await fetchThreadById(id)
        if (thread) {
          setActiveThread(thread)
        }
      } else {
        const newMessage = {
          id: uuidv4(),
          role: "user" as TRole,
          content: textareaValue,
        },
        response = await sendMessages([...activeThread!.messages, newMessage])

        const updatedThread = {
          ...activeThread!,
          messages: [
            ...activeThread!.messages,
            newMessage,
            {
              id: uuidv4(),
              role: "assistant" as TRole,
              content: response,
            },
          ],
        }
        await updateThread(activeThread!.id, updatedThread)
      }

      setTextareaValue("")
      setShouldUpdateThread(true)
      handleStartUttering(response)
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
