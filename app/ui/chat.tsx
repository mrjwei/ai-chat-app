'use client'

import 'regenerator-runtime/runtime'
import {useState} from 'react'
import {sendMessage} from '@/app/lib/api'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import {IMessage} from '@/app/lib/types'

export const Chat = () => {
  const [messages, setMessages] = useState<IMessage[]>([])
  const [value, setValue] = useState('')
  const [isRecording, setIsRecording] = useState(false)

  const {
    transcript,
    resetTranscript,
    listening,
  } = useSpeechRecognition()

  const handleSend = async () => {
    const userMessage = value.trim()
    if (userMessage) {
      setMessages([...messages, {role: 'user', content: userMessage}])
      setValue('')
      const response = await sendMessage(userMessage)
      setMessages([...messages, {role: 'user', content: userMessage}, {role: 'bot', content: response}])
    }
  }

  const handleStartRecording = () => {
    setIsRecording(true)
    resetTranscript()
    SpeechRecognition.startListening({continuous: true, language: 'en-GB'})
  }

  const handleStopRecording = () => {
    setIsRecording(false)
    SpeechRecognition.stopListening()
    if (transcript) {
      setValue(transcript)
    }
  }

  return (
    <>
      <div>
      {messages.map((message: IMessage, i: number) => {
        return (
          <div key={`${i}-${message.content.slice(0, 10)}`}>
            {message.content}
          </div>
        )
      })}
      </div>
      <div>
        <button type="button" disabled={isRecording} onClick={handleStartRecording}>
          Start Recording
        </button>
        <button type="button" disabled={!isRecording} onClick={handleStopRecording}>
          Stop Recording
        </button>
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Type your message..."
        ></textarea>
        <button type="button" onClick={handleSend}>
          Send
        </button>
      </div>
    </>
  )
}
