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
  const [aiSummary, setAiSummary] = useState("")
  const [aiLoading, setAiLoading] = useState(false)
  const [ragAlert, setRagAlert] = useState("")
  const [savedLocations, setSavedLocations] = useState<any[]>([])
  const [saveLabel, setSaveLabel] = useState("")
  const [showSaveForm, setShowSaveForm] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login")
  }, [status])

  useEffect(() => {
    if (zip) fetchAllData(zip)
  }, [zip])

  useEffect(() => {
    if (session?.user?.id) fetchSavedLocations()
  }, [session])

  const fetchAllData = async (zipCode: string) => {
    setLoading(true)
    try {
      const [crimeRes, weatherRes, emergencyRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/crime?zip=${zipCode}`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/weather?zip=${zipCode}`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/emergency?zip=${zipCode}`)
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

      // Get AI summary
      fetchAISummary(zipCode, crimeData.incidents || [], weatherData, emergencyData.emergencies || [])

      // Get RAG personalized alert
      if (session?.user?.id) {
        fetchRagAlert(zipCode, crimeData.incidents || [], weatherData)
      }

    } catch (error) {
      console.error("Error fetching data:", error)
    }
    setLoading(false)
  }

  const fetchAISummary = async (zipCode: string, inc: any[], weath: any, emerg: any[]) => {
    setAiLoading(true)
    try {
      const res = await fetch("${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          zip: zipCode,
          incidents: inc,
          weather: weath,
          emergencies: emerg
        })
      })
      const data = await res.json()
      setAiSummary(data.summary || "")
    } catch (error) {
      console.error("AI summary error:", error)
    }
    setAiLoading(false)
  }

const fetchRagAlert = async (zipCode: string, inc: any[], weath: any) => {
    const userId = session?.user?.id || session?.user?.email
    if (!userId) return
    try {
      const res = await fetch("${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/rag-alert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          zip: zipCode,
          incidents: inc,
          weather: weath
        })
      })
      const data = await res.json()
      setRagAlert(data.alert || "")
    } catch (error) {
      console.error("RAG alert error:", error)
    }
  }

const fetchSavedLocations = async () => {
    const userId = session?.user?.id || session?.user?.email
    if (!userId) return
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/locations/${userId}`)
      const data = await res.json()
      setSavedLocations(data.locations || [])
    } catch (error) {
      console.error("Error fetching locations:", error)
    }
  }

const saveCurrentLocation = async () => {
    if (!saveLabel.trim()) return
    
    const userId = session?.user?.id || session?.user?.email
    if (!userId) {
      alert("Please sign in again")
      return
    }

    try {
      const res = await fetch("${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/locations/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          label: saveLabel,
          address: zip,
          zip_code: zip,
          lat: center[0],
          lng: center[1]
        })
      })
      const data = await res.json()
      console.log("Save response:", data)
      if (data.status === "success" || data.status === "exists") {
        fetchSavedLocations()
        setSaveLabel("")
        setShowSaveForm(false)
        alert(data.message)
      } else {
        alert("Error saving: " + data.error)
      }
    } catch (error) {
      console.error("Error saving location:", error)
      alert("Could not connect to backend. Is it running?")
    }
  }

  const deleteLocation = async (id: number) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/locations/${id}`, { method: "DELETE" })
      fetchSavedLocations()
    } catch (error) {
      console.error("Error deleting location:", error)
    }
  }

  const sendAlertEmail = async () => {
    const highIncidents = incidents.filter((i: any) => i.severity === "high")
    if (highIncidents.length === 0) {
      alert("No high-risk incidents to alert about right now!")
      return
    }
    try {
      const res = await fetch("${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/send-alert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to_email: session?.user?.email,
          user_name: session?.user?.name,
          zip_code: zip,
          alert_type: "High Risk Incidents Detected",
          message: `${highIncidents.length} high-risk incidents reported near zip code ${zip}. Stay aware of your surroundings.`,
          incident_count: highIncidents.length
        })
      })
      const data = await res.json()
      if (data.status === "success") {
        alert("✅ Alert email sent to " + session?.user?.email)
      } else {
        alert("Error sending email: " + data.error)
      }
    } catch (error) {
      alert("Could not send email. Is backend running?")
    }
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
              onClick={sendAlertEmail}
              className="bg-yellow-600 px-4 py-2 rounded-lg hover:bg-yellow-700 transition text-sm"
            >
              📧 Email Alert
            </button>
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


        {/* Safety Score */}
        {incidents.length > 0 && (
          <div className="flex items-center gap-4 mb-6">
            <div className={`px-6 py-3 rounded-2xl font-bold text-lg ${
              incidents.filter((i: any) => i.severity === "high").length >= 3
                ? "bg-red-900/50 border border-red-500 text-red-300"
                : incidents.filter((i: any) => i.severity === "high").length >= 1
                ? "bg-orange-900/50 border border-orange-500 text-orange-300"
                : "bg-green-900/50 border border-green-500 text-green-300"
            }`}>
              {incidents.filter((i: any) => i.severity === "high").length >= 3
                ? "🔴 High Risk Area"
                : incidents.filter((i: any) => i.severity === "high").length >= 1
                ? "🟠 Moderate Risk Area"
                : "🟢 Low Risk Area"
              }
            </div>
            <p className="text-gray-400 text-sm">
              {incidents.length} incidents reported near {zip}
            </p>
          </div>
        )}

        {/* RAG Personalized Alert */}
        {ragAlert && (
          <div className="bg-blue-900/40 border border-blue-500 p-4 rounded-xl mb-6">
            <p className="text-blue-300 font-semibold text-sm uppercase mb-1">
              📍 Personalized Alert
            </p>
            <p>{ragAlert}</p>
          </div>
        )}

        {/* AI Summary */}
        <div className="bg-gray-900 border border-gray-700 p-6 rounded-2xl mb-6">
          <p className="text-gray-400 font-semibold text-sm uppercase mb-3">
            🤖 AI Safety Summary
          </p>
          {aiLoading ? (
            <div className="space-y-2 animate-pulse">
              <div className="h-4 bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-700 rounded w-5/6"></div>
              <div className="h-4 bg-gray-700 rounded w-4/6"></div>
            </div>
          ) : (
            <p className="text-gray-100 leading-relaxed">{aiSummary}</p>
          )}
        </div>

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
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-semibold">
              🗺️ Neighborhood Safety Map — {zip}
            </h2>
            <button
              onClick={() => setShowSaveForm(!showSaveForm)}
              className="bg-green-600 px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm"
            >
              + Save Location
            </button>
          </div>

          {/* Save Location Form */}
          {showSaveForm && (
            <div className="bg-gray-800 p-4 rounded-xl mb-4 flex gap-3">
              <input
                type="text"
                placeholder='Label (e.g. "Home", "Work")'
                value={saveLabel}
                onChange={(e) => setSaveLabel(e.target.value)}
                className="bg-gray-700 text-white px-4 py-2 rounded-lg flex-1 outline-none"
              />
              <button
                onClick={saveCurrentLocation}
                className="bg-green-600 px-4 py-2 rounded-lg hover:bg-green-700 transition"
              >
                Save
              </button>
              <button
                onClick={() => setShowSaveForm(false)}
                className="bg-gray-600 px-4 py-2 rounded-lg hover:bg-gray-500 transition"
              >
                Cancel
              </button>
            </div>
          )}

          <SafetyMap zip={zip} incidents={incidents} center={center} />
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

        {/* Saved Locations */}
        {savedLocations.length > 0 && (
          <div className="bg-gray-900 rounded-2xl p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">📍 Saved Locations</h2>
            <div className="flex flex-col gap-3">
              {savedLocations.map((loc: any) => (
                <div key={loc.id} className="bg-gray-800 p-4 rounded-xl flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{loc.label}</p>
                    <p className="text-sm text-gray-400">Zip: {loc.zip_code}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setZip(loc.zip_code)}
                      className="bg-blue-600 px-3 py-1 rounded-lg text-sm hover:bg-blue-700 transition"
                    >
                      View
                    </button>
                    <button
                      onClick={() => deleteLocation(loc.id)}
                      className="bg-red-600 px-3 py-1 rounded-lg text-sm hover:bg-red-700 transition"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

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