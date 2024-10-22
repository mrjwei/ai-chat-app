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
    changeSystemMessage(messages[0].content)
  }, []);

  return (
    <div className={clsx(
      "flex items-center bg-white text-neutral-500 p-4 z-10",
      className
    )}>
      {messages === undefined ? (
        <select className="p-2 border-2 border-neutral-200 rounded" disabled>
          <option>No context</option>
        </select>
      ) : (
        <select className="p-2 border-2 border-neutral-200 rounded" onChange={(e) => changeSystemMessage(e.target.value)} value={systemMessage}>
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
