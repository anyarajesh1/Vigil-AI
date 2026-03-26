from fastapi import APIRouter
from pydantic import BaseModel
import resend
import os
from dotenv import load_dotenv

load_dotenv()
resend.api_key = os.getenv("RESEND_API_KEY")

router = APIRouter()

class AlertEmailRequest(BaseModel):
    to_email: str
    user_name: str
    zip_code: str
    alert_type: str
    message: str
    incident_count: int

@router.post("/send-alert")
async def send_alert_email(request: AlertEmailRequest):
    try:
        html_content = f"""
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: white; padding: 32px; border-radius: 16px;">
            <h1 style="color: #f59e0b; margin-bottom: 8px;">⚡ Vigil-AI Safety Alert</h1>
            <p style="color: #94a3b8; margin-bottom: 24px;">Real-time neighborhood safety update</p>
            
            <div style="background: #1e293b; padding: 20px; border-radius: 12px; border-left: 4px solid #ef4444; margin-bottom: 20px;">
                <h2 style="color: #ef4444; margin: 0 0 8px 0;">🚨 {request.alert_type}</h2>
                <p style="margin: 0; color: #e2e8f0;">{request.message}</p>
            </div>
            
            <div style="background: #1e293b; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                <p style="margin: 0; color: #94a3b8;">📍 <strong style="color: white;">Zip Code:</strong> {request.zip_code}</p>
                <p style="margin: 8px 0 0 0; color: #94a3b8;">⚠️ <strong style="color: white;">Incidents:</strong> {request.incident_count} reported in your area</p>
            </div>

            <p style="color: #64748b; font-size: 12px; margin-top: 24px;">
                You received this because you saved this location in Vigil-AI. 
                Stay safe, {request.user_name}!
            </p>
        </div>
        """

        params = {
            "from": "Vigil-AI <onboarding@resend.dev>",
            "to": [request.to_email],
            "subject": f"⚡ Vigil-AI Alert: {request.incident_count} incidents near {request.zip_code}",
            "html": html_content,
        }

        email = resend.Emails.send(params)

        return {
            "status": "success",
            "message": "Alert email sent!",
            "id": email.get("id")
        }
    except Exception as e:
        return {"status": "error", "error": str(e)}