"use client"

import { useState } from "react"
import clsx from "clsx"
import { ISystemMessage } from "@/app/lib/types"
import { useSystemMessageStore } from "@/app/lib/stores"
import Button from "@/app/ui/common/button"
import Dropdown from "@/app/ui/common/dropdown"

export default function SystemMessageSelect({
  messages,
  className,
}: {
  messages?: ISystemMessage[]
  className?: string
}) {
  const changeSystemMessage = useSystemMessageStore((state) => state.changeSystemMessage)

  const [label, setLabel] = useState(messages ? messages[0].label : "")

  if (!messages) {
    return
  }

  const handleClick = (e: React.MouseEvent) => {
    const message = messages.find(m => m.label === (e.target as HTMLButtonElement).id) as ISystemMessage
    changeSystemMessage(message)
    setLabel(message.label)
  }

  return (
    <div className={clsx(
      "relative",
      className
    )}>
      <Dropdown
        initialLabel={label}
        className="block text-neutral-600 rounded z-50"
        btnClassName="w-44 lg:w-80"
        btnClassNameOnOpen="bg-neutral-100"
        menuClassName="absolute top-full right-0 z-50 translate-y-2"
        labelClassName="flex-[2_1_0%]"
        iconClassName="flex-[1_0_0%]"
      >
        {messages === undefined ? (
          <>
            <li>
              <Button disabled>
                No context
              </Button>
            </li>
          </>
        ) : (
          <>
            {messages.map((message) => {
            const { id, label } = message
            return (
              <li key={id}>
                <Button id={label} onClick={handleClick} className="w-full text-left hover:bg-neutral-100 rounded">
                  {label}
                </Button>
              </li>
            )
          })}
          </>
        )}
      </Dropdown>
    </div>
  )
}
