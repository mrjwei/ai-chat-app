"use client"

import "regenerator-runtime/runtime"
import dynamic from "next/dynamic"
import {
  PlayCircleIcon,
  StopCircleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/solid"
import Button from "@/app/ui/common/button"

const ReactMic = dynamic(
  () => import("react-mic").then((mod) => mod.ReactMic),
  { ssr: false }
)

export default function Recorder({
  record,
  handleStart,
  handleStop,
  handleReset,
  handleTranscribe
}: {
  record: boolean,
  handleStart: () => void,
  handleStop: () => void,
  handleReset: () => void,
  handleTranscribe: (blob: any) => void
}) {
  return (
    <>
      <ReactMic
        record={record}
        className="hidden"
        onStop={handleTranscribe}
        mimeType="audio/wav"
      />
      <div className="flex">
        {record ? (
          <Button onClick={handleStop} className="text-red-500 !p-2">
            <StopCircleIcon className="w-8" />
          </Button>
        ) : (
          <Button onClick={handleStart} className="!p-2">
            <PlayCircleIcon className="w-8" />
          </Button>
        )}
        <Button onClick={handleReset} className="!p-2">
          <ArrowPathIcon className="w-8" />
        </Button>
      </div>
    </>
  )
}
