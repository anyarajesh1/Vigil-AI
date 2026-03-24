"use client"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import dynamic from "next/dynamic"

const SafetyMap = dynamic(() => import("../components/SafetyMap"), { ssr: false })

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [zip, setZip] = useState("94102")
  const [inputZip, setInputZip] = useState("")
  const [incidents, setIncidents] = useState([])
  const [weather, setWeather] = useState<any>(null)
  const [emergency, setEmergency] = useState<any>(null)
  const [center, setCenter] = useState<[number, number]>([37.7749, -122.4194])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status])

  useEffect(() => {
    if (zip) fetchAllData(zip)
  }, [zip])

  const fetchAllData = async (zipCode: string) => {
    setLoading(true)
    try {
      const [crimeRes, weatherRes, emergencyRes] = await Promise.all([
        fetch(`http://127.0.0.1:8000/api/crime?zip=${zipCode}`),
        fetch(`http://127.0.0.1:8000/api/weather?zip=${zipCode}`),
        fetch(`http://127.0.0.1:8000/api/emergency?zip=${zipCode}`)
      ])

      const crimeData = await crimeRes.json()
      const weatherData = await weatherRes.json()
      const emergencyData = await emergencyRes.json()

      setIncidents(crimeData.incidents || [])
      setWeather(weatherData)
      setEmergency(emergencyData)

      if (weatherData.lat && weatherData.lng) {
        setCenter([weatherData.lat, weatherData.lng])
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    }
    setLoading(false)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputZip.length === 5) setZip(inputZip)
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <p className="text-white text-xl">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">⚡ Vigil-AI</h1>
          <div className="flex items-center gap-4">
            <p className="text-gray-400">{session?.user?.name}</p>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 transition"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Zip Code Search */}
        <form onSubmit={handleSearch} className="flex gap-3 mb-6">
          <input
            type="text"
            placeholder="Enter zip code (e.g. 94102)"
            value={inputZip}
            onChange={(e) => setInputZip(e.target.value)}
            maxLength={5}
            className="bg-gray-800 text-white px-4 py-3 rounded-xl flex-1 outline-none border border-gray-700 focus:border-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 px-6 py-3 rounded-xl hover:bg-blue-700 transition font-semibold"
          >
            {loading ? "Loading..." : "Search"}
          </button>
        </form>

        {/* Weather Alert Banner */}
        {weather && (
          <div className={`p-4 rounded-xl mb-6 ${
            weather.alert_level === "high" ? "bg-red-900/50 border border-red-500" :
            weather.alert_level === "medium" ? "bg-orange-900/50 border border-orange-500" :
            "bg-green-900/50 border border-green-500"
          }`}>
            <p className="font-semibold">{weather.alert_message}</p>
            <p className="text-sm text-gray-300 mt-1">
              🌡️ {weather.temperature}°F &nbsp;
              💨 {weather.wind_speed} mph &nbsp;
              🌧️ {weather.precipitation}mm precipitation
            </p>
          </div>
        )}

        {/* Safety Map */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">
            🗺️ Neighborhood Safety Map — {zip}
          </h2>
          <SafetyMap
            zip={zip}
            incidents={incidents}
            center={center}
          />
        </div>

        {/* Legend */}
        <div className="flex gap-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-sm text-gray-400">High Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span className="text-sm text-gray-400">Medium Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-sm text-gray-400">Low Risk</span>
          </div>
        </div>

        {/* Emergency Alerts */}
        {emergency && emergency.emergencies?.length > 0 && (
          <div className="bg-gray-900 rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-4">🚨 Recent FEMA Declarations</h2>
            <div className="flex flex-col gap-3">
              {emergency.emergencies.map((e: any) => (
                <div key={e.id} className="bg-gray-800 p-4 rounded-xl">
                  <p className="font-semibold">{e.title}</p>
                  <p className="text-sm text-gray-400">{e.type} — {e.state}</p>
                  <p className="text-xs text-gray-500">{e.date}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}