import { create } from "zustand"
import { persist } from "zustand/middleware"
import {
  IMessage,
  ISpeakingMessageState,
  IVoiceState,
  ISystemMessageState,
} from "@/app/lib/types"

export const useSpeakingMessageStore = create<ISpeakingMessageState>()(
  (set) => ({
    speakingMessage: null,
    setSpeakingMessage: (message: IMessage | null) =>
      set((state) => ({ speakingMessage: message })),
  })
)

export const useVoiceStore = create<IVoiceState>()(
  persist(
    (set) => ({
      voiceIndex: 0,
      changeVoiceIndex: (newIndex: number) =>
        set((state) => ({
          voiceIndex: newIndex,
        })),
    }),
    {
      name: "voiceIndex",
    }
  )
)

export const useSystemMessageStore = create<ISystemMessageState>()(
  persist(
    (set) => ({
      systemMessage: "",
      changeSystemMessage: (newMessage: string) =>
        set((state) => ({
          systemMessage: newMessage,
        })),
    }),
    {
      name: "systemMessage",
    }
  )
)
