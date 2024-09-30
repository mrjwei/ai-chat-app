'use server'

import axios from 'axios'
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import clientPromise from '@/app/lib/mongodb'
import {unstable_noStore as noStore} from 'next/cache'
import { IThread } from "@/app/lib/types"

const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY

export const sendMessage = async (msg: string) => {
  try {
    const res = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: msg
          }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      },
    )
    return res.data.choices[0].message.content
  } catch (error) {
    console.error(`Error sending message: ${error}`)
    return 'Something went wrong'
  }
}

export const fetchThreadById = async (id: string) => {
  noStore()
  const client = await clientPromise
  const db = client.db('conversation-data')
  try {
    const collection = db.collection('threads')
    const results = (await collection.find({id}).toArray()).map(doc => {
      const {id, title, description, messages} = doc
      return {id, title, description, messages}
    })
    return results[0]
  } catch (error) {
    console.error('Failed to find thread: ', error)
  }
}

export const fetchThreads = async () => {
  noStore()
  const client = await clientPromise
  const db = client.db('conversation-data')
  try {
    const collection = db.collection('threads')
    return await collection.find({}).toArray()
  } catch (error) {
    console.error('Failed to find thread: ', error)
  }
}

export const createThread = async (thread: IThread) => {
  noStore()
  const client = await clientPromise
  const db = client.db('conversation-data')
  try {
    const collection = db.collection('threads')
    await collection.insertOne(thread)
  } catch (error) {
    console.error('Failed to create design: ', error)
  }
  revalidatePath(`/t/${thread.id}`)
  redirect(`/t/${thread.id}`)
}

export const updateThread = async (id: string, updatedThread: IThread) => {
  noStore()
  const client = await clientPromise
  const db = client.db('conversation-data')
  try {
    const collection = db.collection('threads')
    await collection.updateOne({id}, {
      $set: {
        ...updatedThread
      }
    })
  } catch (error) {
    console.error('Failed to create design: ', error)
  }
  revalidatePath(`/t/${id}`)
}
