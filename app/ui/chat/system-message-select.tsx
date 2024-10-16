'use client'

import {useContext, useEffect} from 'react'
import {ISystemMessage} from '@/app/lib/types'
import { SystemMessageContext } from "@/app/lib/contexts"

export default function SystemMessageSelect({messages}: {messages?: ISystemMessage[]}) {
  const {systemMessage, setSystemMessage} = useContext(SystemMessageContext)

  useEffect(() => {
    if (messages === undefined) {
      return
    }
    setSystemMessage(messages[0].content)
  }, []);

  return (
    <div className="w-full fixed top-0 flex items-center bg-white text-neutral-500 p-4 shadow-md z-10">
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
