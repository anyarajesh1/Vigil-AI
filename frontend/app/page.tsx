import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">

      <nav className="flex justify-between items-center px-8 py-5 border-b border-gray-800/50 sticky top-0 z-50 bg-gray-950/80">
        <div className="flex items-center gap-2">
          <span className="text-2xl">⚡</span>
          <h1 className="text-xl font-bold text-white">Vigil-AI</h1>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="https://github.com/anyarajesh1/Vigil-AI"
            target="_blank"
            className="text-gray-400 hover:text-white transition text-sm"
          >
            GitHub
          </Link>
          <Link
            href="/dashboard"
            className="bg-yellow-500 text-gray-950 px-5 py-2 rounded-xl font-semibold hover:bg-yellow-400 transition text-sm"
          >
            Open App →
          </Link>
        </div>
      </nav>

      <div className="flex flex-col items-center justify-center flex-1 px-8 py-24 text-center">
        <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 px-4 py-1.5 rounded-full text-sm font-medium mb-8">
          <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
          Live data updated in real-time
        </div>
        <h1 className="text-6xl font-bold mb-6 max-w-3xl leading-tight tracking-tight">
          AI That Watches Over
          <span className="text-yellow-400"> Your Neighborhood</span>
        </h1>
        <p className="text-gray-400 text-xl max-w-xl mb-10 leading-relaxed">
          Enter any US zip code and instantly see crime data, AI safety analysis,
          weather alerts and emergency declarations.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 items-center mb-6">
          <Link
            href="/dashboard"
            className="bg-yellow-500 text-gray-950 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-yellow-400 transition"
          >
            Check Your Neighborhood →
          </Link>
          <Link
            href="https://github.com/anyarajesh1/Vigil-AI"
            target="_blank"
            className="border border-gray-700 text-gray-300 px-8 py-4 rounded-2xl font-semibold text-lg hover:border-gray-500 hover:text-white transition"
          >
            View on GitHub
          </Link>
        </div>
        <p className="text-gray-600 text-sm">Free • No signup required • Works for any US zip code</p>
      </div>

      <div className="border-y border-gray-800 py-8 px-8">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-3xl font-bold text-yellow-400">6+</p>
            <p className="text-gray-400 text-sm mt-1">Live APIs</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-yellow-400">Real-time</p>
            <p className="text-gray-400 text-sm mt-1">Safety Data</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-yellow-400">AI</p>
            <p className="text-gray-400 text-sm mt-1">Powered Summaries</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-yellow-400">$0</p>
            <p className="text-gray-400 text-sm mt-1">Cost to Use</p>
          </div>
        </div>
      </div>

      <div className="px-8 py-20 max-w-5xl mx-auto w-full">
        <h2 className="text-3xl font-bold text-center mb-12">Everything you need to stay safe</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 hover:border-gray-600 transition">
            <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">🗺️</span>
            </div>
            <h3 className="font-bold text-lg mb-2">Live Safety Map</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Real-time crime incidents plotted on an interactive map with color-coded risk levels</p>
          </div>
          <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 hover:border-gray-600 transition">
            <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">🤖</span>
            </div>
            <h3 className="font-bold text-lg mb-2">AI Safety Summaries</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Groq Llama 3 AI turns raw data into plain-English safety advice for your neighborhood</p>
          </div>
          <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 hover:border-gray-600 transition">
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">⛈️</span>
            </div>
            <h3 className="font-bold text-lg mb-2">Weather and Emergencies</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Live weather from Open-Meteo and FEMA emergency declarations for your area</p>
          </div>
          <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 hover:border-gray-600 transition">
            <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">🔴</span>
            </div>
            <h3 className="font-bold text-lg mb-2">Risk Scoring</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Instant neighborhood risk assessment based on real incident data in your zip code</p>
          </div>
          <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 hover:border-gray-600 transition">
            <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">📍</span>
            </div>
            <h3 className="font-bold text-lg mb-2">Zip Code Search</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Search any US zip code instantly and the map and AI summary update automatically</p>
          </div>
          <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 hover:border-gray-600 transition">
            <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">🚨</span>
            </div>
            <h3 className="font-bold text-lg mb-2">FEMA Alerts</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Real federal emergency declarations — hurricanes, floods, wildfires and more</p>
          </div>
        </div>
      </div>

      <div className="px-8 py-16 bg-gray-900/50 border-y border-gray-800">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-yellow-500 text-gray-950 rounded-full flex items-center justify-center font-bold text-lg mb-4">1</div>
              <h3 className="font-semibold mb-2">Enter your zip code</h3>
              <p className="text-gray-400 text-sm">Type any US zip code into the search bar</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-yellow-500 text-gray-950 rounded-full flex items-center justify-center font-bold text-lg mb-4">2</div>
              <h3 className="font-semibold mb-2">AI analyzes your area</h3>
              <p className="text-gray-400 text-sm">We pull live data from 6 APIs and run it through Groq AI</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-yellow-500 text-gray-950 rounded-full flex items-center justify-center font-bold text-lg mb-4">3</div>
              <h3 className="font-semibold mb-2">Stay informed and safe</h3>
              <p className="text-gray-400 text-sm">See your map, risk score and plain-English safety summary</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-20 text-center">
        <h2 className="text-4xl font-bold mb-4">Ready to check your neighborhood?</h2>
        <p className="text-gray-400 mb-8">Free, instant and no signup required</p>
        <Link
          href="/dashboard"
          className="bg-yellow-500 text-gray-950 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-yellow-400 transition"
        >
          Open Vigil-AI →
        </Link>
      </div>

      <div className="border-t border-gray-800 py-8 px-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span>⚡</span>
            <span className="font-bold">Vigil-AI</span>
            <span className="text-gray-500 text-sm">— AI community safety platform</span>
          </div>
          <p className="text-gray-500 text-sm">Data from FBI, NOAA, FEMA and Open-Meteo • Built with Next.js and FastAPI</p>
          <Link
            href="https://github.com/anyarajesh1/Vigil-AI"
            target="_blank"
            className="text-gray-400 hover:text-white transition text-sm"
          >
            GitHub →
          </Link>
        </div>
      </div>

    </div>
  )
}