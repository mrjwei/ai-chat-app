'use client'

import { useState, useContext } from "react"
import clsx from "clsx"
import {IMessage} from '@/app/lib/types'
import Message from '@/app/ui/chat/message'
import { SpeakingContext } from "@/app/lib/contexts"

export default function Messages({thread}: {thread: any}) {
  const {isSpeaking, setIsSpeaking} = useContext(SpeakingContext)

  const [activeMessageId, setActiveMessageId] = useState('')

  const handleToggle = (message: IMessage) => {
    if (isSpeaking) {
      setActiveMessageId('')
      setIsSpeaking(false)
      window.speechSynthesis.cancel()
    } else {
      setActiveMessageId(message.id)
      setIsSpeaking(true)
      const utterance = new SpeechSynthesisUtterance(message.content)
      utterance.lang = "en-GB"
      utterance.voice = window.speechSynthesis.getVoices()[8]
      window.speechSynthesis.speak(utterance)
      utterance.onend = () => setIsSpeaking(false)
    }
  }

  let messages: IMessage[]

  if (!thread) {
    messages = []
  } else {
    messages = thread.messages
  }

  return (
    <div className="flex-1 h-[calc(100%-96px)] bg-white px-8 pt-16 pb-8 grid grid-cols-12">
      <div className="col-span-8 col-start-3">
        {messages.map((message: IMessage) => {
          return (
            <div key={message.id} className={clsx(
              'w-full flex mb-8',
              {
                'justify-end': message.role === 'user',
                'justify-start': message.role === 'assistant',
              }
            )}>
              <Message isActive={activeMessageId === message.id} message={message} handleToggle={handleToggle} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
