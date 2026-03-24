"use client"
import { signIn } from "next-auth/react"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="bg-gray-900 p-10 rounded-2xl shadow-2xl flex flex-col items-center gap-6">
        <h1 className="text-4xl font-bold text-white">⚡ Vigil-AI</h1>
        <p className="text-gray-400 text-center">
          AI that watches over your neighborhood 24/7
        </p>
        <button
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="bg-white text-gray-900 font-semibold px-6 py-3 rounded-xl hover:bg-gray-100 transition flex items-center gap-3"
        >
          <img src="https://www.google.com/favicon.ico" className="w-5 h-5" />
          Sign in with Google
        </button>
      </div>
    </div>
  )
}