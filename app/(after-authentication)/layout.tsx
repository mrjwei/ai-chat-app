import { redirect } from "next/navigation"
import Sidebar from "@/app/ui/layout/sidebar"
import SidebarContainer from "@/app/ui/layout/sidebar-container"
import { fetchSystemMessages } from "@/app/lib/api"
import { auth } from "@/auth"

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

  return (
    <div className="flex-1 grid grid-cols-12 relative h-full">
      <SidebarContainer systemMessages={systemMessages}>
        <Sidebar />
      </SidebarContainer>
      <main className="relative col-span-12 lg:col-span-10 flex flex-col justify-end h-full">
        {children}
      </main>
    </div>
  )
}
