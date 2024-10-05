import Sidebar from "@/app/ui/layout/sidebar"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex-1 grid grid-cols-12 relative">
      <Sidebar />
      <main className="col-span-10 flex flex-col justify-end h-full">
        {children}
      </main>
    </div>
  );
}
