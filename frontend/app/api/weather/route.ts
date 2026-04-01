import { NextRequest, NextResponse } from "next/server"

async function getCoordsFromZip(zip: string) {
  const url = `https://nominatim.openstreetmap.org/search?postalcode=${zip}&country=US&format=json`
  const res = await fetch(url, {
    headers: { "User-Agent": "Vigil-AI/1.0" },
    next: { revalidate: 3600 }
  })
  const data = await res.json()
  if (data && data.length > 0) {
    return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }
  }
  return { lat: 37.7749, lng: -122.4194 }
}

export async function GET(request: NextRequest) {
  const zip = request.nextUrl.searchParams.get("zip") || "94102"

  try {
    const coords = await getCoordsFromZip(zip)
    const { lat, lng } = coords

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,wind_speed_10m,precipitation,weather_code&wind_speed_unit=mph&temperature_unit=fahrenheit`
    const res = await fetch(url)
    const data = await res.json()
    const current = data.current || {}
    const weatherCode = current.weather_code || 0

    let alertLevel = "low"
    let alertMessage = "Weather conditions are normal"
    if (weatherCode >= 80) {
      alertLevel = "high"
      alertMessage = "⚠️ Severe weather warning in your area"
    } else if (weatherCode >= 60) {
      alertLevel = "medium"
      alertMessage = "🌧️ Heavy rain expected today"
    } else if (weatherCode >= 40) {
      alertLevel = "medium"
      alertMessage = "🌦️ Light rain expected today"
    }

    return NextResponse.json({
      zip, status: "success",
      temperature: current.temperature_2m,
      wind_speed: current.wind_speed_10m,
      precipitation: current.precipitation,
      alert_level: alertLevel,
      alert_message: alertMessage,
      lat, lng
    })
  } catch (error) {
    return NextResponse.json({ zip, status: "error", error: String(error) })
  }
}