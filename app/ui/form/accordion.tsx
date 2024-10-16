'use client'

import {useState} from 'react'
import clsx from 'clsx'
import {
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline'

export default function Accordion({items}: {items: any}) {
  const [visibleId, setVisibleId] = useState('')

  const handleClick = (e: React.MouseEvent<HTMLLIElement>) => {
    if ((e.currentTarget as HTMLLIElement).id === visibleId) {
      setVisibleId('')
    } else {
      setVisibleId((e.currentTarget as HTMLLIElement).id)
    }
  }
  return (
    <ul>
      {items.map((item: any) => {
        const {id, label, content} = item
        return (
          <li key={id} id={id} onClick={handleClick} className="cursor-pointer text-purple-500">
            <div className={clsx(
              "flex justify-between items-center p-2",
              {
                'bg-purple-50': visibleId === id
              }
            )}>
              <span>{label}</span>
              {
                visibleId === id ? (
                  <ChevronUpIcon className="w-5" />
                ) : (
                  <ChevronDownIcon className="w-5" />
                )
              }
            </div>
            <span className={clsx(
              'text-neutral-800 p-2',
              {
                'block': visibleId === id,
                'hidden': visibleId !== id,
              }
            )}>
              {content}
            </span>
          </li>
        )
      })}
    </ul>
  )
}
