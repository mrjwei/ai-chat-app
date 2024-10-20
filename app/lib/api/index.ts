"use server"

import axios from "axios"
import { z } from "zod"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { ObjectId } from "mongodb"
import clientPromise from "@/app/lib/mongodb"
import { unstable_noStore as noStore } from "next/cache"
import { IMessage, IThread } from "@/app/lib/types"
import { signIn as authSignIn, signOut as authSignOut } from "@/auth"

const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY

export const transcribe = async (audioBlob: Blob) => {
  const formData = new FormData()
  formData.append("file", audioBlob, "audio.wav")
  formData.append("model", "whisper-1")

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/audio/transcriptions",
      formData,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "multipart/form-data",
        },
      }
    )
    const { text } = response.data
    return text
  } catch (error) {
    console.error("Error during transcription:", error)
  }
}

export const sendMessages = async (messages: IMessage[]) => {
  const messagesWithoutId = messages.map((msg) => ({
    role: msg.role,
    content: msg.content,
  }))
  try {
    const res = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: messagesWithoutId,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    )
    return res.data.choices[0].message
  } catch (error) {
    console.error(`Error sending message: ${error}`)
    return "Something went wrong"
  }
}

export const fetchThreadById = async (id: string) => {
  noStore()
  const client = await clientPromise
  const db = client.db("conversation-data")
  try {
    const results = (
      await db
        .collection("threads")
        .find({ _id: new ObjectId(id) })
        .toArray()
    ).map((doc) => {
      const { _id, userId, title, description, messages } = doc
      return {
        id: String(_id),
        userId: String(userId),
        title,
        description,
        messages,
      }
    })
    return results[0]
  } catch (error) {
    console.error("Failed to find thread: ", error)
  }
}

export const fetchThreads = async (userId: string) => {
  noStore()
  const client = await clientPromise
  const db = client.db("conversation-data")
  try {
    return (
      await db
        .collection("threads")
        .find({ userId: new ObjectId(userId) })
        .toArray()
    ).map((doc) => {
      const { _id, userId, title, description, messages } = doc
      return {
        id: String(_id),
        userId: String(userId),
        title,
        description,
        messages,
      }
    })
  } catch (error) {
    console.error("Failed to find thread: ", error)
  }
}

export const createThread = async (thread: Omit<IThread, "id">) => {
  noStore()
  const client = await clientPromise
  const db = client.db("conversation-data")
  let id = ""
  try {
    const result = await db
      .collection("threads")
      .insertOne({ ...thread, userId: new ObjectId(thread.userId) })
    id = String(result.insertedId)
  } catch (error) {
    console.error("Failed to create design: ", error)
  }
  revalidatePath(`/t/${id}`)
  redirect(`/t/${id}`)
}

export const updateThread = async (id: string, updatedThread: IThread) => {
  noStore()
  const client = await clientPromise
  const db = client.db("conversation-data")
  try {
    await db.collection("threads").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          title: updatedThread.title,
          description: updatedThread.description,
          messages: updatedThread.messages,
        },
      }
    )
  } catch (error) {
    console.error("Failed to create design: ", error)
  }
  revalidatePath(`/t/${id}`)
}

export const deleteThread = async (id: string) => {
  noStore()
  const client = await clientPromise
  const db = client.db("conversation-data")
  try {
    const collection = db.collection("threads")
    await collection.deleteOne({ _id: new ObjectId(id) })
  } catch (error) {
    console.error("Failed to create design: ", error)
  }
  revalidatePath("/")
}

export const fetchUserByEmail = async (email: string) => {
  noStore()
  const client = await clientPromise
  const db = client.db("conversation-data")
  try {
    return (await db.collection("users").find({ email }).toArray()).map(
      (doc) => {
        const { _id, name, email, password } = doc
        return { id: String(_id), name, email, password }
      }
    )[0]
  } catch (error) {
    console.error("Failed to fetch user: ", error)
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
  await authSignOut({ redirectTo: "/login" })
}

export const fetchSystemMessages = async (userId: string) => {
  noStore()
  const client = await clientPromise
  const db = client.db("conversation-data")
  try {
    return (
      await db
        .collection("system-messages")
        .find({ userId: new ObjectId(userId) })
        .toArray()
    ).map((doc) => {
      const { _id, role, content, userId, label } = doc
      return { id: String(_id), role, content, userId, label }
    })
  } catch (error) {
    console.error("Failed to find system messages: ", error)
  }
}

export const createSystemMessage = async (
  userId: string,
  label: string,
  content: string
) => {
  noStore()
  const client = await clientPromise
  const db = client.db("conversation-data")

  const validatedFields = z
    .object({
      label: z.string().min(1),
      content: z.string().min(1),
    })
    .safeParse({
      label,
      content,
    })

  if (!validatedFields.success) {
    return
  }

  const {label: validatedLabel, content: validatedContent} = validatedFields.data

  try {
    await db.collection("system-messages").insertOne({
      role: "system",
      label: validatedLabel,
      content: validatedContent,
      userId: new ObjectId(userId),
    })
  } catch (error) {
    console.error("Failed to create system message: ", error)
  }
  revalidatePath(`/setting`)
}

export const deleteSystemMessage = async (id: string) => {
  noStore()
  const client = await clientPromise
  const db = client.db("conversation-data")
  try {
    const collection = db.collection("system-messages")
    await collection.deleteOne({ _id: new ObjectId(id) })
  } catch (error) {
    console.error("Failed to delete system message: ", error)
  }
  revalidatePath("/setting")
}

export const updateSystemMessage = async (id: string, label: string | undefined, content: string | undefined) => {
  noStore()
  const client = await clientPromise
  const db = client.db("conversation-data")
  try {
    if (label === undefined && content === undefined) {
      return
    }
    if (label === undefined && content !== undefined) {
      await db.collection("system-messages").updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            content
          },
        }
      )
    } else if (label !== undefined && content === undefined) {
      await db.collection("system-messages").updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            label
          },
        }
      )
    } else {
      await db.collection("system-messages").updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            label,
            content
          },
        }
      )
    }
  } catch (error) {
    console.error("Failed to update system message: ", error)
  }
  revalidatePath("/setting")
}
