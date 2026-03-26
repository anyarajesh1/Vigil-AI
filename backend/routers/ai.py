from fastapi import APIRouter
from pydantic import BaseModel
from groq import Groq
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

class SummarizeRequest(BaseModel):
    zip: str
    incidents: list
    weather: dict
    emergencies: list

@router.post("/summarize")
async def summarize_safety(request: SummarizeRequest):
    try:
        # Build prompt from real data
        prompt = f"""
You are Vigil-AI, a neighborhood safety assistant.
Analyze this safety data for zip code {request.zip} and give a 
friendly, plain-English summary in 3-4 sentences. 
Be specific and actionable. End with one safety tip.

Crime incidents: {len(request.incidents)} reported
Most severe: {max([i.get('severity', 'low') for i in request.incidents], default='none')}
Crime types: {list(set([i.get('type', '') for i in request.incidents]))}

Weather: {request.weather.get('alert_message', 'Normal conditions')}
Temperature: {request.weather.get('temperature')}°F
Wind: {request.weather.get('wind_speed')} mph

Emergency alerts: {len(request.emergencies)} active FEMA declarations

Keep response under 100 words. Be helpful and calm, not alarming.
        """

        chat_completion = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama-3.3-70b-versatile",
        )

        summary = chat_completion.choices[0].message.content

        return {
            "status": "success",
            "summary": summary,
            "zip": request.zip
        }

    except Exception as e:
        return {
            "status": "error",
            "summary": "Stay aware of your surroundings and report suspicious activity to local authorities.",
            "error": str(e)
        }