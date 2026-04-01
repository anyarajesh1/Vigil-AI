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
    const lat = coords.lat
    const lng = coords.lng

    const crimeTypes = [
      { type: "Vehicle Break-In", severity: "medium" },
      { type: "Package Theft", severity: "low" },
      { type: "Assault", severity: "high" },
      { type: "Vandalism", severity: "low" },
      { type: "Burglary", severity: "high" },
      { type: "Robbery", severity: "high" },
      { type: "Shoplifting", severity: "low" },
    ]

    const seed = parseInt(zip) || 12345
    const incidents = Array.from({ length: 6 }, (_, i) => {
      const crime = crimeTypes[(seed + i) % crimeTypes.length]
      const latOffset = ((seed * (i + 1) * 9301 + 49297) % 233280) / 233280 * 0.04 - 0.02
      const lngOffset = ((seed * (i + 2) * 9301 + 49297) % 233280) / 233280 * 0.04 - 0.02
      return {
        id: i + 1,
        type: crime.type,
        severity: crime.severity,
        lat: lat + latOffset,
        lng: lng + lngOffset,
        description: `${crime.type} reported in your area`,
        date: `2024-03-${String((i + 1) * 4).padStart(2, "0")}`
      }
    })

    return NextResponse.json({ zip, status: "success", incidents })
  } catch (error) {
    return NextResponse.json({ zip, status: "error", incidents: [], error: String(error) })
  }
}