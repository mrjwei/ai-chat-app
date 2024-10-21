'use client'

import clsx from "clsx"
import {IMessage} from '@/app/lib/types'
import Message from '@/app/ui/chat/message'

export default function Thread({thread}: {thread: any}) {
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
              <Message message={message} />
            </div>
          )
        })}
      </div>
    </div>
  )
}