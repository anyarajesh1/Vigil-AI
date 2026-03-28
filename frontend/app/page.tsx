// import Link from "next/link"

// export default function Home() {
//   return (
//     <div className="min-h-screen bg-gray-950 text-white flex flex-col">

//       {/* Navbar */}
//       <nav className="flex justify-between items-center px-8 py-5 border-b border-gray-800">
//         <h1 className="text-2xl font-bold text-yellow-400">⚡ Vigil-AI</h1>
//         <Link
//           href="/login"
//           className="bg-yellow-500 text-gray-950 px-5 py-2 rounded-xl font-semibold hover:bg-yellow-400 transition"
//         >
//           Get Started
//         </Link>
//       </nav>

//       {/* Hero */}
//       <div className="flex flex-col items-center justify-center flex-1 px-8 py-20 text-center">
//         <div className="inline-block bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 px-4 py-1 rounded-full text-sm font-medium mb-6">
//           🚨 Real-time AI Safety Intelligence
//         </div>
//         <h1 className="text-5xl font-bold mb-6 max-w-3xl leading-tight">
//           AI That Watches Over
//           <span className="text-yellow-400"> Your Neighborhood</span>
//         </h1>
//         <p className="text-gray-400 text-xl max-w-2xl mb-10">
//           Vigil-AI combines real crime data, live weather alerts, and FEMA 
//           emergency feeds — powered by AI to keep your community safe 24/7.
//         </p>
//         <Link
//           href="/login"
//           className="bg-yellow-500 text-gray-950 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-yellow-400 transition"
//         >
//           Start Monitoring Your Neighborhood →
//         </Link>
//       </div>

//       {/* Features */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-8 pb-20 max-w-5xl mx-auto w-full">
//         <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
//           <p className="text-3xl mb-3">🗺️</p>
//           <h3 className="font-bold text-lg mb-2">Live Safety Map</h3>
//           <p className="text-gray-400 text-sm">Real-time crime incidents plotted on an interactive neighborhood map</p>
//         </div>
//         <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
//           <p className="text-3xl mb-3">🤖</p>
//           <h3 className="font-bold text-lg mb-2">AI Safety Summaries</h3>
//           <p className="text-gray-400 text-sm">Groq AI turns raw data into plain-English safety advice for your area</p>
//         </div>
//         <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
//           <p className="text-3xl mb-3">📧</p>
//           <h3 className="font-bold text-lg mb-2">Instant Email Alerts</h3>
//           <p className="text-gray-400 text-sm">Get notified immediately when high-risk incidents hit your saved locations</p>
//         </div>
//       </div>

//       {/* Footer */}
//       <div className="border-t border-gray-800 py-6 text-center text-gray-500 text-sm">
//         Built with Next.js, FastAPI, Groq AI — Vigil-AI 2026
//       </div>

//     </div>
//   )
// }

import { redirect } from "next/navigation"

export default function Home() {
  redirect("/dashboard")
}