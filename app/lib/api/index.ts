'use server'

import axios from 'axios'
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { ObjectId } from "mongodb"
import clientPromise from '@/app/lib/mongodb'
import {unstable_noStore as noStore} from 'next/cache'
import { IMessage, IThread } from "@/app/lib/types"
import {signIn as authSignIn, signOut as authSignOut} from '@/auth'

const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY

export const sendMessages = async (messages: IMessage[]) => {
  const messagesWithoutId = messages.map(msg => ({
    role: msg.role,
    content: msg.content
  }))
  try {
    const res = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini',
        messages: messagesWithoutId
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
    const results = (await db.collection('threads').find({_id: new ObjectId(id)}).toArray()).map(doc => {
      const {_id, userId, title, description, messages} = doc
      return {id: String(_id), userId: String(userId), title, description, messages}
    })
    return results[0]
  } catch (error) {
    console.error('Failed to find thread: ', error)
  }
}

export const fetchThreads = async (userId: string) => {
  noStore()
  const client = await clientPromise
  const db = client.db('conversation-data')
  try {
    return (await db.collection('threads').find({userId: new ObjectId(userId)}).toArray()).map(doc => {
      const {_id, userId, title, description, messages} = doc
      return {id: String(_id), userId: String(userId), title, description, messages}
    })
  } catch (error) {
    console.error('Failed to find thread: ', error)
  }
}

export const createThread = async (thread: Omit<IThread, 'id'>) => {
  noStore()
  const client = await clientPromise
  const db = client.db('conversation-data')
  let id = ''
  try {
    const result = await db.collection('threads').insertOne({...thread, userId: new ObjectId(thread.userId)})
    id = String(result.insertedId)
  } catch (error) {
    console.error('Failed to create design: ', error)
  }
  revalidatePath(`/t/${id}`)
  redirect(`/t/${id}`)
  return id
}

export const updateThread = async (id: string, updatedThread: IThread) => {
  noStore()
  const client = await clientPromise
  const db = client.db('conversation-data')
  try {
    await db.collection('threads').updateOne({_id: new ObjectId(id)}, {
      $set: {
        title: updatedThread.title,
        description: updatedThread.description,
        messages: updatedThread.messages
      }
    })
  } catch (error) {
    console.error('Failed to create design: ', error)
  }
  revalidatePath(`/t/${id}`)
}

export const deleteThread = async (id: string) => {
  noStore()
  const client = await clientPromise
  const db = client.db('conversation-data')
  try {
    const collection = db.collection('threads')
    await collection.deleteOne({_id: new ObjectId(id)})
  } catch (error) {
    console.error('Failed to create design: ', error)
  }
  revalidatePath('/')
}

export const fetchUserByEmail = async (email: string) => {
  noStore()
  const client = await clientPromise
  const db = client.db('conversation-data')
  try {
    return (await db.collection('users').find({email}).toArray()).map(doc => {
      const {_id, name, email, password} = doc
      return {id: String(_id), name, email, password}
    })[0]
  } catch (error) {
    console.error('Failed to fetch user: ', error)
  }
}

export const signIn = async (prevState: any, formData: FormData) => {
  await authSignIn("credentials", {
    email: formData.get("email"),
    password: formData.get("password"),
    redirectTo: "/",
  })
}

export const signOut = async () => {
  await authSignOut({redirectTo: '/login'})
}
