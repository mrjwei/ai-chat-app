"use client"

import {useShallow} from 'zustand/shallow'
import clsx from "clsx"
import {useVoiceStore} from '@/app/lib/stores'

export default function VoiceSelect({className}: {className?: string}) {
  const {voiceIndex, changeVoiceIndex} = useVoiceStore(useShallow((state) => ({
    voiceIndex: state.voiceIndex,
    changeVoiceIndex: state.changeVoiceIndex
  })))

  return (
    <div
      className={clsx(
        "flex items-center bg-white text-neutral-500 p-4 z-10",
        className
      )}
    >
      <select
        className="p-2 border-2 border-neutral-200 rounded"
        onChange={(e) => changeVoiceIndex(Number(e.target.value))}
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
