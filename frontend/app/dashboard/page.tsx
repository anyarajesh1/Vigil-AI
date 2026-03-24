"use client"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <p className="text-white text-xl">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">⚡ Vigil-AI Dashboard</h1>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Sign Out
          </button>
        </div>
        <div className="bg-gray-900 rounded-2xl p-6">
          <p className="text-gray-400">Welcome back,</p>
          <p className="text-2xl font-semibold">{session?.user?.name} 👋</p>
          <p className="text-gray-400 mt-1">{session?.user?.email}</p>
        </div>
        <div className="mt-6 bg-gray-900 rounded-2xl p-6">
          <p className="text-gray-400 text-center">
            🗺️ Your neighborhood safety map will appear here on Day 3
          </p>
        </div>
      </div>
    </div>
  )
}