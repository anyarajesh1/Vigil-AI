/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useEffect, useRef } from "react"

interface Incident {
  id: number
  type: string
  severity: string
  lat: number
  lng: number
  description: string
  date: string
}

interface SafetyMapProps {
  zip: string
  incidents: Incident[]
  center: [number, number]
}

const severityColors: Record<string, string> = {
  high: "#ef4444",
  medium: "#f97316",
  low: "#eab308",
}

export default function SafetyMap({ incidents, center }: SafetyMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)

  useEffect(() => {
    if (typeof window === "undefined") return
    if (!mapRef.current) return

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove()
      mapInstanceRef.current = null
    }

    const timer = setTimeout(async () => {
      if (!mapRef.current) return

      const L = (await import("leaflet")).default
      await import("leaflet/dist/leaflet.css")

      if (mapInstanceRef.current) return

      const map = L.map(mapRef.current, {
        center: center,
        zoom: 13,
      })
      mapInstanceRef.current = map

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map)

      incidents.forEach((incident: Incident) => {
        const circle = L.circleMarker([incident.lat, incident.lng], {
          radius: 10,
          fillColor: severityColors[incident.severity],
          color: severityColors[incident.severity],
          fillOpacity: 0.7,
          weight: 2,
        }).addTo(map)

        circle.bindPopup(`
          <div>
            <p style="font-weight:bold">${incident.type}</p>
            <p style="font-size:12px">${incident.description}</p>
            <p style="font-size:11px;color:#888">${incident.date}</p>
          </div>
        `)
      })
    }, 100)

    return () => {
      clearTimeout(timer)
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [incidents, center])

  return (
    <div
      ref={mapRef}
      style={{ height: "400px", width: "100%", borderRadius: "16px" }}
    />
  )
}