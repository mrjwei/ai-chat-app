import axios from 'axios'
import {unstable_noStore as noStore} from 'next/cache'
import {Db} from 'mongodb'
import clientPromise from '@/app/lib/mongodb'
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

export const fetchThread = async (title: string) => {
  noStore()
  const client = await clientPromise
  const db: Db = client.db('conversation-data')
  try {
    const results = await db.collection('threads').findOne({
      title
    })
    if (results) {
      return results[0]
    }
    return null
  } catch (error) {
    console.error('Failed to create thread: ', error)
  }
}

export const createThread = async (thread: IThread) => {
  noStore()
  const client = await clientPromise
  const db: Db = client.db('conversation-data')
  try {
    const collection = db.collection('threads')
    await collection.insertOne(thread)
  } catch (error) {
    console.error('Failed to create thread: ', error)
  }
}

export const updateThread = async (title: string, updatedThread: IThread) => {
  noStore()
  const client = await clientPromise
  const db: Db = client.db('conversation-data')
  try {
    const collection = db.collection('threads')
    await collection.updateOne({title}, {
      $set: {
        ...updatedThread
      }
    })
  } catch (error) {
    console.error('Failed to update thread: ', error)
  }
}
