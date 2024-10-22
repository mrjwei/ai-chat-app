'use client'

import {useEffect} from 'react'
import {useShallow} from 'zustand/shallow'
import clsx from 'clsx'
import {ISystemMessage} from '@/app/lib/types'
import {useSystemMessageStore} from '@/app/lib/stores'

export default function SystemMessageSelect({messages, className}: {messages?: ISystemMessage[], className?: string}) {
  const {systemMessage, changeSystemMessage} = useSystemMessageStore(useShallow((state) => ({
    systemMessage: state.systemMessage,
    changeSystemMessage: state.changeSystemMessage
  })))

  useEffect(() => {
    if (messages === undefined) {
      return
    }
    if (systemMessage === "") {
      changeSystemMessage(messages[0].content)
    }
  }, []);

  return (
    <div className={clsx(
      "flex items-center bg-white text-neutral-500 p-2 z-10 max-w-44 lg:max-w-96",
      className
    )}>
      {messages === undefined ? (
        <select className="block w-full p-2 border-2 border-neutral-200 rounded overflow-hidden text-ellipsis" disabled>
          <option>No context</option>
        </select>
      ) : (
        <select className="block w-full p-2 border-2 border-neutral-200 rounded overflow-hidden text-ellipsis" onChange={(e) => changeSystemMessage(e.target.value)} value={systemMessage}>
          {messages.map(message => {
            const {id, content, label} = message
            return (
              <option key={id} value={content}>{label}</option>
            )
          })}
        </select>
      )}
    </div>
  )
}
