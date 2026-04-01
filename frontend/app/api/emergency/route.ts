import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const zip = request.nextUrl.searchParams.get("zip") || "94102"

  try {
    const url = `https://www.fema.gov/api/open/v2/disasterDeclarationsSummaries?$orderby=declarationDate%20desc&$top=5`
    const res = await fetch(url, { next: { revalidate: 3600 } })
    const data = await res.json()
    const disasters = data.DisasterDeclarationsSummaries || []

    const emergencies = disasters.slice(0, 3).map((d: any) => ({
      id: d.id,
      type: d.incidentType || "Unknown",
      state: d.state,
      title: d.declarationTitle,
      date: d.declarationDate,
      severity: ["Hurricane", "Earthquake", "Tornado"].includes(d.incidentType) ? "high" : "medium"
    }))

    return NextResponse.json({ zip, status: "success", emergencies })
  } catch (error) {
    return NextResponse.json({ zip, status: "error", emergencies: [], error: String(error) })
  }
}