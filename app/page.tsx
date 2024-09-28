import {v4 as uuidv4} from 'uuid'
import '@/app/globals.css'
import ChatBox from "@/app/ui/chat/chat-box"
import Messages from "@/app/ui/chat/messages"
import Header from "@/app/ui/layout/header"
import {CurrentThreadContext} from '@/app/lib/contexts'
import { IThread } from "@/app/lib/types"

export default function Top() {
  return (
    <ChatBox />
  )
}
