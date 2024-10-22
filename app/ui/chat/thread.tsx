'use client'

import {useShallow} from 'zustand/shallow'
import clsx from "clsx"
import {IMessage} from '@/app/lib/types'
import Message from '@/app/ui/chat/message'
import { utter, cancelUtter } from "@/app/lib/utilities"
import {useSpeakingMessageStore, useVoiceStore} from '@/app/lib/stores'

export default function Thread({thread}: {thread: any}) {
  const {speakingMessage, setSpeakingMessage} = useSpeakingMessageStore(useShallow((state) => ({
    speakingMessage: state.speakingMessage,
    setSpeakingMessage: state.setSpeakingMessage
  })))
  const voiceIndex = useVoiceStore((state) => state.voiceIndex)

  const handleClick = (message: IMessage) => {
    if (speakingMessage) {
      cancelUtter()
      setSpeakingMessage(null)
    } else {
      setSpeakingMessage(message)
      utter({
        text: message.content,
        voiceIndex,
        onStart: null,
        onEnd: null,
      })
    }
  }

  return (
    <div className="flex-1 h-[calc(100%-96px)] bg-white px-8 pt-24 pb-4 grid grid-cols-12">
      <div className="col-span-12 lg:col-span-10 2xl:col-span-8 lg:col-start-2 2xl:col-start-3">
        {thread?.messages.filter((message: IMessage) => message.role !== 'system').map((message: IMessage) => {
          return (
            <div key={message.id} className={clsx(
              'w-full flex mb-8',
              {
                'justify-end': message.role === 'user',
                'justify-start': message.role === 'assistant',
              }
            )}>
              <Message message={message} isActive={speakingMessage !== null && (speakingMessage.id === message.id)} handleClick={handleClick} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
