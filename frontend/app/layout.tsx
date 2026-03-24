import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { getServerSession } from "next-auth"
import SessionProvider from "./SessionProvider"
import { authOptions } from "./api/auth/[...nextauth]/route"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Vigil-AI",
  description: "AI that watches over your neighborhood 24/7",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider session={session}>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}