'use client'

import { useContext } from "react"
import clsx from "clsx"
import {IMessage} from '@/app/lib/types'
import Message from '@/app/ui/chat/message'
import { SpeakingContext } from "@/app/lib/contexts"
import {utter, cancelUtter} from '@/app/lib/utilities'

export default function Thread({thread}: {thread: any}) {
  const {isSpeaking, setIsSpeaking, activeMessage, setActiveMessage} = useContext(SpeakingContext)

  const handleToggle = (message: IMessage) => {
    if (isSpeaking) {
      setIsSpeaking(false)
      setActiveMessage(null)
      cancelUtter()
    } else {
      setActiveMessage(message)
      utter({text: message.content, voiceIndex: 8, onStart: () => setIsSpeaking(true), onEnd: () => setIsSpeaking(false)})
    }
  }

  let messages: IMessage[]

  if (!thread) {
    messages = []
  } else {
    messages = thread.messages
  }

  return (
    <div className="flex-1 h-[calc(100%-96px)] bg-white px-8 pt-24 pb-4 grid grid-cols-12">
      <div className="col-span-12 lg:col-span-10 2xl:col-span-8 lg:col-start-2 2xl:col-start-3">
        {messages.filter((message: IMessage) => message.role !== 'system').map((message: IMessage) => {
          return (
            <div key={message.id} className={clsx(
              'w-full flex mb-8',
              {
                'justify-end': message.role === 'user',
                'justify-start': message.role === 'assistant',
              }
            )}>
              <Message isActive={activeMessage?.id === message.id} message={message} handleToggle={handleToggle} isSpeaking={isSpeaking} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
