"use client"

import { useState } from "react"
import clsx from "clsx"
import { useVoiceStore } from "@/app/lib/stores"
import Button from "@/app/ui/common/button"
import Dropdown from "@/app/ui/common/dropdown"

export default function VoiceSelect({ className }: { className?: string }) {
  const voiceIndex = useVoiceStore((state) => state.voiceIndex)
  const changeVoiceIndex = useVoiceStore((state) => state.changeVoiceIndex)

  const [label, setLabel] = useState(
    `${window.speechSynthesis.getVoices()[voiceIndex]?.name} (${
      window.speechSynthesis.getVoices()[voiceIndex]?.lang
    })`
  )

  const handleClick = (e: React.MouseEvent) => {
    changeVoiceIndex(Number((e.target as HTMLButtonElement).id))
    setLabel(
      `${
        window.speechSynthesis.getVoices()[
          Number((e.target as HTMLButtonElement).id)
        ].name
      } (${
        window.speechSynthesis.getVoices()[
          Number((e.target as HTMLButtonElement).id)
        ].lang
      })`
    )
  }
  return (
    <div className={clsx(
      "relative",
      className
    )}>
      <Dropdown
        initialLabel={label}
        className="block text-neutral-600 rounded"
        btnClassNameOnOpen="bg-neutral-100"
        btnClassName="w-44 lg:w-80"
        menuClassName="absolute top-full right-0 z-50 translate-y-2"
        labelClassName="flex-[2_1_0%]"
        iconClassName="flex-[1_0_0%]"
      >
        <>
          {window.speechSynthesis.getVoices().map((voice, i) => {
            const { name, lang } = voice
            return (
              <li key={name}>
                <Button id={String(i)} onClick={handleClick} className="w-full text-left hover:bg-neutral-100 rounded">
                  {name} ({lang})
                </Button>
              </li>
            )
          })}
        </>
      </Dropdown>
    </div>
  )
}
