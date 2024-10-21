"use client"

import { useContext } from "react"
import clsx from "clsx"
import { VoiceContext } from "@/app/lib/contexts"

export default function VoiceSelect({className}: {className?: string}) {
  const {voiceIndex, setVoiceIndex} = useContext(VoiceContext)

  return (
    <div
      className={clsx(
        "flex items-center bg-white text-neutral-500 p-4 z-10",
        className
      )}
    >
      <select
        className="p-2 border-2 border-neutral-200 rounded"
        onChange={(e) => setVoiceIndex(Number(e.target.value))}
        value={voiceIndex}
      >
        {window.speechSynthesis.getVoices().map((voice, i) => {
          const {name, lang} = voice
          return (
            <option key={name} value={i}>
              {name} ({lang})
            </option>
          )
        })}
      </select>
    </div>
  )
}
