import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { fetchSystemMessages } from "@/app/lib/api"
import Accordion from '@/app/ui/form/accordion'
import SystemMessageForm from '@/app/ui/form/system-message-form'


export default async function Page() {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  const systemMessages = await fetchSystemMessages(session.user.id!)

  return (
    <div className="mx-auto lg:max-w-4xl">
      <h1 className="font-bold text-3xl mb-8">Setting</h1>
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="font-bold text-2xl text-neutral-600 mb-4">System Messages</h2>
        <Accordion items={systemMessages} />
        <SystemMessageForm userId={session.user.id!} className="mt-4" />
      </div>
    </div>
  )
}
