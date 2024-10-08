import React from 'react'
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import '@/app/globals.css'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="min-h-screen h-full">
      <body className={`bg-gray-100 min-h-screen h-full ${inter.className}`}>
        {children}
      </body>
    </html>
  );
}
