import Sidebar from "@/app/ui/layout/sidebar"
import SidebarContainer from "@/app/ui/layout/sidebar-container"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex-1 grid grid-cols-12 relative h-full">
      <SidebarContainer>
        <Sidebar />
      </SidebarContainer>
      <main className="relative col-span-12 lg:col-span-10 flex flex-col justify-end h-full">
        {children}
      </main>
    </div>
  )
}
