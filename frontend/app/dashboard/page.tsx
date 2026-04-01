/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"

const SafetyMap = dynamic(() => import("../components/SafetyMap"), { ssr: false })

const API_URL = ""

export default function Dashboard() {
  const [zip, setZip] = useState("94102")
  const [inputZip, setInputZip] = useState("")
  const [incidents, setIncidents] = useState([])
  const [weather, setWeather] = useState<any>(null)
  const [emergency, setEmergency] = useState<any>(null)
  const [center, setCenter] = useState<[number, number]>([37.7749, -122.4194])
  const [loading, setLoading] = useState(false)
  const [aiSummary, setAiSummary] = useState("")
  const [aiLoading, setAiLoading] = useState(false)
  const [backendLoading, setBackendLoading] = useState(true)
  const [backendError, setBackendError] = useState(false)

useEffect(() => {
    fetchAllData(zip)
  }, [zip])

const fetchAllData = async (zipCode: string) => {
    setLoading(true)
    setBackendError(false)
    try {
      const [crimeRes, weatherRes, emergencyRes] = await Promise.all([
        fetch(`${API_URL}/api/crime?zip=${zipCode}`, { signal: AbortSignal.timeout(90000) }),
        fetch(`${API_URL}/api/weather?zip=${zipCode}`, { signal: AbortSignal.timeout(90000) }),
        fetch(`${API_URL}/api/emergency?zip=${zipCode}`, { signal: AbortSignal.timeout(90000) })
      ])
      const crimeData = await crimeRes.json()
      const weatherData = await weatherRes.json()
      const emergencyData = await emergencyRes.json()
      setIncidents(crimeData.incidents || [])
      setWeather(weatherData)
      setEmergency(emergencyData)
      setBackendLoading(false)
      if (weatherData.lat && weatherData.lng) {
        setCenter([weatherData.lat, weatherData.lng])
      }
      fetchAISummary(zipCode, crimeData.incidents || [], weatherData, emergencyData.emergencies || [])
    } catch (error) {
      console.error("Error fetching data:", error)
      setBackendError(true)
      setBackendLoading(false)
    }
    setLoading(false)
  }
  const fetchAISummary = async (zipCode: string, inc: any[], weath: any, emerg: any[]) => {
    setAiLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/summarize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ zip: zipCode, incidents: inc, weather: weath, emergencies: emerg })
      })
      const data = await res.json()
      setAiSummary(data.summary || "")
    } catch (error) {
      console.error("AI summary error:", error)
    }
    setAiLoading(false)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputZip.length === 5) setZip(inputZip)
  }

  const highCount = incidents.filter((i: any) => i.severity === "high").length
  const riskLevel = highCount >= 3 ? "high" : highCount >= 1 ? "moderate" : "low"

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      <nav className="flex justify-between items-center px-8 py-4 border-b border-gray-800/50 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl">⚡</span>
          <span className="font-bold text-white">Vigil-AI</span>
        </Link>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-full">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span className="text-green-400 text-xs font-medium">Live</span>
          </div>
          <Link
            href="https://github.com/anyarajesh1/Vigil-AI"
            target="_blank"
            className="text-gray-400 hover:text-white transition text-sm border border-gray-700 px-3 py-1.5 rounded-lg"
          >
            GitHub
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-8 py-8">

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-1">Neighborhood Safety Dashboard</h1>
          <p className="text-gray-400">Enter any US zip code to get real-time safety intelligence</p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-3 mb-8">
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">📍</span>
            <input
              type="text"
              placeholder="Enter zip code (e.g. 94102, 10001, 90210)"
              value={inputZip}
              onChange={(e) => setInputZip(e.target.value)}
              maxLength={5}
              className="w-full bg-gray-900 text-white pl-10 pr-4 py-3.5 rounded-xl outline-none border border-gray-700 focus:border-yellow-500 transition placeholder-gray-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-yellow-500 text-gray-950 px-8 py-3.5 rounded-xl hover:bg-yellow-400 transition font-bold disabled:opacity-50"
          >
            {loading ? "Loading..." : "Search"}
          </button>
        </form>
                
                {/* Backend Status Banner */}
        {backendLoading && !backendError && (
          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-2xl p-5 mb-6 flex items-center gap-4">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div>
              <p className="text-yellow-400 font-semibold">Backend is waking up...</p>
              <p className="text-gray-400 text-sm mt-0.5">
                Free hosting spins down after inactivity. This takes 30-60 seconds on first load. Hang tight!
              </p>
            </div>
          </div>
        )}

        {backendError && (
          <div className="bg-red-900/20 border border-red-500/30 rounded-2xl p-5 mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-red-400 font-semibold">Could not connect to backend</p>
              <p className="text-gray-400 text-sm mt-0.5">
                The server may still be starting up. Please wait a moment and try again.
              </p>
            </div>
            <button
              onClick={() => fetchAllData(zip)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition whitespace-nowrap"
            >
              Retry →
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className={`p-5 rounded-2xl border ${
            riskLevel === "high" ? "bg-red-900/20 border-red-500/30" :
            riskLevel === "moderate" ? "bg-orange-900/20 border-orange-500/30" :
            "bg-green-900/20 border-green-500/30"
          }`}>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Risk Assessment</p>
            <div className="flex items-center gap-3">
              <span className="text-3xl">
                {riskLevel === "high" ? "🔴" : riskLevel === "moderate" ? "🟠" : "🟢"}
              </span>
              <div>
                <p className={`text-xl font-bold ${
                  riskLevel === "high" ? "text-red-400" :
                  riskLevel === "moderate" ? "text-orange-400" :
                  "text-green-400"
                }`}>
                  {riskLevel === "high" ? "High Risk Area" :
                   riskLevel === "moderate" ? "Moderate Risk Area" :
                   "Low Risk Area"}
                </p>
                <p className="text-gray-400 text-sm">{incidents.length} incidents near {zip}</p>
              </div>
            </div>
          </div>

          {weather && (
            <div className={`p-5 rounded-2xl border ${
              weather.alert_level === "high" ? "bg-red-900/20 border-red-500/30" :
              weather.alert_level === "medium" ? "bg-orange-900/20 border-orange-500/30" :
              "bg-blue-900/20 border-blue-500/30"
            }`}>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Weather</p>
              <p className="font-semibold mb-2">{weather.alert_message}</p>
              <div className="flex gap-4 text-sm text-gray-300">
                <span>🌡️ {weather.temperature}°F</span>
                <span>💨 {weather.wind_speed} mph</span>
                <span>🌧️ {weather.precipitation}mm</span>
              </div>
            </div>
          )}
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🤖</span>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">AI Safety Summary</p>
            {aiLoading && (
              <span className="text-xs text-yellow-400 animate-pulse ml-auto">Analyzing...</span>
            )}
          </div>
          {aiLoading ? (
            <div className="space-y-2 animate-pulse">
              <div className="h-4 bg-gray-700 rounded-full w-full"></div>
              <div className="h-4 bg-gray-700 rounded-full w-5/6"></div>
              <div className="h-4 bg-gray-700 rounded-full w-4/6"></div>
            </div>
          ) : (
            <p className="text-gray-100 leading-relaxed">
              {aiSummary || "Enter a zip code above to get your AI-powered safety summary"}
            </p>
          )}
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-lg font-semibold">🗺️ Neighborhood Safety Map</h2>
              <p className="text-gray-400 text-sm">Showing incidents near zip code {zip}</p>
            </div>
            <div className="flex gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-gray-400">High</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span className="text-gray-400">Medium</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-gray-400">Low</span>
              </div>
            </div>
          </div>
          <SafetyMap zip={zip} incidents={incidents} center={center} />
        </div>

        {emergency && emergency.emergencies?.length > 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">🚨 Recent FEMA Declarations</h2>
            <div className="flex flex-col gap-3">
              {emergency.emergencies.map((e: any) => (
                <div key={e.id} className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50 flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{e.title}</p>
                    <p className="text-sm text-gray-400 mt-1">{e.type} — {e.state}</p>
                  </div>
                  <span className="text-xs text-gray-500 whitespace-nowrap ml-4">{e.date?.slice(0, 10)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-800 text-center text-gray-600 text-sm">
          ⚡ Vigil-AI — Data from FBI Crime API, NOAA, FEMA and Open-Meteo • AI by Groq
        </div>

      </div>
    </div>
  )
}