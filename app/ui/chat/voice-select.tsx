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
        "flex items-center bg-white text-neutral-500 p-2 z-10 max-w-44 lg:max-w-96",
        className
      )}
    >
      <select
        className="block w-full p-2 border-2 border-neutral-200 rounded overflow-hidden text-ellipsis"
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
