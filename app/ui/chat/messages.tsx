import clsx from "clsx"
import {IMessage} from '@/app/lib/types'
import Message from '@/app/ui/chat/message'

export default function Messages({thread}: {thread: any}) {
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
              <Message message={message} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
