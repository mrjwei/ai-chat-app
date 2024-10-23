import { create } from "zustand"
import { persist } from "zustand/middleware"
import {
  IMessage,
  ISpeakingMessageState,
  IVoiceState,
  ISystemMessageState,
  IMenuState,
  ISystemMessage
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
      systemMessage: null,
      changeSystemMessage: (newMessage: ISystemMessage) =>
        set((state) => ({
          systemMessage: newMessage,
        })),
    }),
    {
      name: "systemMessage",
    }
  )
)

export const useMenuStore = create<IMenuState>()((set) => ({
  isOpen: true,
  setIsOpen: (val: boolean) => set({isOpen: val})
}))
