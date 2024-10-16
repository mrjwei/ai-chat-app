'use client'

import {useState} from 'react'
import { PlusIcon } from "@heroicons/react/24/outline"
import Button from '@/app/ui/common/button'
import FormControl from '@/app/ui/form/form-control'
import {createSystemMessage} from '@/app/lib/api'

export default function SystemMessageForm({userId, className}: {userId: string,className?: string}) {
  const [formVisible, setFormVisible] = useState(false)
  const [label, setLabel] = useState('')
  const [content, setContent] = useState('')

  const handleSubmit = async () => {
    await createSystemMessage(userId, label, content)
    setFormVisible(false)
    setLabel('')
    setContent('')
  }

  return (
    <div className={className}>
      {formVisible ? (
        <div className="p-2">
          <FormControl label="Label" htmlFor="label" isGrid={false} labelClassName="block mb-2" className="mb-4">
            <input type="text" name="label" id="label" className="block w-full border-2 border-neutral-200" value={label} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLabel((e.target as HTMLInputElement).value)} />
          </FormControl>
          <FormControl label="Content" htmlFor="content" isGrid={false} labelClassName="block mb-2" className="mb-4">
            <textarea rows={5} name="content" id="content"  className="block w-full border-2 border-neutral-200" value={content} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent((e.target as HTMLTextAreaElement).value)} />
          </FormControl>
          <div className="flex items-center">
            <Button className="bg-neutral-800 text-white rounded mr-2" onClick={handleSubmit}>
              Save
            </Button>
            <Button onClick={() => setFormVisible(false)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Button className="flex items-center !px-0 mt-2" onClick={() => setFormVisible(true)}>
          <PlusIcon className="w-5 mr-1" />
          <span>New System Message</span>
        </Button>
      )}
    </div>
  )
}
