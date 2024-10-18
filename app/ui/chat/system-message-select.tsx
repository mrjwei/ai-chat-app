'use client'

import {useContext, useEffect} from 'react'
import clsx from 'clsx'
import {ISystemMessage} from '@/app/lib/types'
import { SystemMessageContext } from "@/app/lib/contexts"

export default function SystemMessageSelect({messages, className}: {messages?: ISystemMessage[], className?: string}) {
  const {systemMessage, setSystemMessage} = useContext(SystemMessageContext)

  useEffect(() => {
    if (messages === undefined) {
      return
    }
    setSystemMessage(messages[0].content)
  }, []);

  return (
    <div className={clsx(
      "flex items-center bg-white text-neutral-500 p-4 z-10",
      className
    )}>
      <label htmlFor="system-message" className="block mr-1">Context:</label>
      {messages === undefined ? (
        <select className="p-2 border-2 border-neutral-200 rounded" disabled>
          <option>No context</option>
        </select>
      ) : (
        <select className="p-2 border-2 border-neutral-200 rounded" onChange={(e) => setSystemMessage(e.target.value)} value={systemMessage}>
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
