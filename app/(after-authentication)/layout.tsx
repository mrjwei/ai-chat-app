import { redirect } from "next/navigation"
import Sidebar from "@/app/ui/layout/sidebar"
import Header from "@/app/ui/layout/header"
import { fetchSystemMessages, fetchThreads } from "@/app/lib/api"
import { auth } from "@/auth"
import { IThread, IUser } from "@/app/lib/types"

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  const systemMessages = await fetchSystemMessages(session.user.id!)
  const threads = (await fetchThreads(session.user.id!)) as IThread[]

  return (
    <div className="h-full">
      <Header systemMessages={systemMessages} user={session.user as IUser} />
      <div className="lg:flex h-full bg-white">
        <Sidebar threads={threads} />
        <main className="relative flex-1 flex flex-col justify-end h-full">
          {children}
        </main>
      </div>
    </div>
  )
}
