"use client"

import React, { useActionState } from "react"
import { signIn } from "@/app/lib/api"
import Button from "@/app/ui/common/button"
import FormControl from "@/app/ui/form/form-control"

export default function LoginForm() {
  const [errorMessage, formAction, isPending] = useActionState(
    signIn,
    undefined
  )

  return (
    <form action={formAction}>
      <div className="rounded-lg bg-white shadow">
        <div className="px-12 py-8">
          <h1 className="text-center text-2xl text-slate-400 font-bold mb-12">
            Log in to your account
          </h1>
          <FormControl
            label="Email"
            htmlFor="email"
            className="items-center mb-6"
            labelClassName="col-span-12 font-bold mb-2"
          >
            <input
              className="col-span-12 border-2 border-neutral-100 rounded p-2"
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email address"
              required
            />
          </FormControl>
          <FormControl
            label="Password"
            htmlFor="password"
            className="items-center mb-6"
            labelClassName="col-span-12 font-bold mb-2"
          >
            <input
              className="col-span-12 border-2 border-neutral-100 rounded p-2"
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              required
            />
          </FormControl>
          <Button
            type="submit"
            className="w-full bg-slate-600 hover:bg-slate-400 text-white p-2 rounded-lg"
            aria-disabled={isPending}
          >
            {isPending ? (
              <div className="flex items-center justify-center">
                <div className="relative flex justify-center items-center h-6 w-6 mr-2">
                  <div className="absolute rounded-full h-6 w-6 border-4 border-white opacity-50"></div>
                  <div className="absolute animate-spin rounded-full h-6 w-6 border-4 border-t-white border-transparent"></div>
                </div>
                <span>Processing</span>
              </div>
            ) : (
              "Log In"
            )}
          </Button>
          {/* <div
            className="flex h-8 items-end space-x-1"
            aria-live="polite"
            aria-atomic="true"
          >
            {errorMessage && (
              <>
                <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                <p className="text-sm text-red-500">{errorMessage}</p>
              </>
            )}
          </div> */}
        </div>
      </div>
    </form>
  )
}
