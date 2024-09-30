import clsx from "clsx"
import {IMessage, IThread} from '@/app/lib/types'
import Message from '@/app/ui/chat/message'

export default function Messages({thread}: {thread: any}) {

  let messages: IMessage[]

  if (!thread) {
    messages = []
  } else {
    messages = thread.messages
  }

  return (
    <div className="flex-1 bg-white overflow-y-scroll p-8 grid grid-cols-12">
      <div className="col-span-8 col-start-3">
        {messages.map((message: IMessage, i: number) => {
          return (
            <div key={message.content} className={clsx(
              'w-full flex mb-8',
              {
                'justify-end': message.role === 'user',
                'justify-start': message.role === 'bot',
              }
            )}>
              <Message message={message} key={`${i}-${message.content.slice(0, 10)}`} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
