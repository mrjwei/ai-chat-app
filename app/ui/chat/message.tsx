import Markdown from 'react-markdown'
import clsx from "clsx"
import {IMessage} from '@/app/lib/types'

export default function Message({message}: {message: IMessage}) {
  return (
    <div className={clsx(
      'max-w-full p-4 rounded-md shadow',
      {
        'bg-gray-100': message.role === 'user',
        'bg-blue-100': message.role === 'bot',
      }
    )}>
      {message.role === 'bot' ? (
        <Markdown>
          {message.content}
        </Markdown>
      ) : (message.content)}
    </div>
  )
}
