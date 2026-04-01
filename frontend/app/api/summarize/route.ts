import { NextRequest, NextResponse } from "next/server"
import Groq from "groq-sdk"

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { zip, incidents, weather, emergencies } = body

    const prompt = `
You are Vigil-AI, a neighborhood safety assistant.
Analyze this safety data for zip code ${zip} and give a 
friendly, plain-English summary in 3-4 sentences. 
Be specific and actionable. End with one safety tip.

Crime incidents: ${incidents.length} reported
Most severe: ${incidents.length > 0 ? Math.max(...incidents.map((i: any) => i.severity === "high" ? 3 : i.severity === "medium" ? 2 : 1)) : 0}
Crime types: ${[...new Set(incidents.map((i: any) => i.type))].join(", ")}

Weather: ${weather?.alert_message || "Normal conditions"}
Temperature: ${weather?.temperature}°F
Wind: ${weather?.wind_speed} mph

Emergency alerts: ${emergencies?.length || 0} active FEMA declarations

Keep response under 100 words. Be helpful and calm, not alarming.
    `

    const chat = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
    })

    const summary = chat.choices[0].message.content

    return NextResponse.json({ status: "success", summary, zip })
  } catch (error) {
    return NextResponse.json({
      status: "error",
      summary: "Stay aware of your surroundings and report suspicious activity to local authorities.",
      error: String(error)
    })
  }
}