'use client'

import 'regenerator-runtime/runtime'
import {useState} from 'react'
import {v4 as uuidv4} from 'uuid'
import '@/app/globals.css'
import ChatBox from "@/app/ui/chat/chat-box"
import Messages from "@/app/ui/chat/messages"
import Button from "@/app/ui/common/button"
import {CurrentThreadContext} from '@/app/lib/contexts'
import { IThread } from "@/app/lib/types"
import { createThread } from "@/app/lib/api"

export default function Top() {
  const [thread, setThread] = useState<IThread>({
    id: uuidv4(),
    title: 'Untitled',
    description: 'Sample description.',
    messages: []
  })

  const handleSave = async () => {
    await createThread({
      ...thread,
      title: `${thread.title}-${thread.id}`,
    })
    console.log(JSON.stringify(thread))
  }

  return (
    <CurrentThreadContext.Provider value={{thread, setThread}}>
      <header className="bg-gray-100 p-4">
        <Button onClick={handleSave}>
          Save
        </Button>
      </header>
      <div className="flex flex-col h-[calc(100vh-56px)]">
        <Messages />
        <ChatBox />
      </div>
    </CurrentThreadContext.Provider>
  )
}
