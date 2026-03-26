from fastapi import APIRouter
from pydantic import BaseModel
from database import get_db
import json

router = APIRouter()

class LocationRequest(BaseModel):
    user_id: str
    label: str
    address: str
    zip_code: str
    lat: float
    lng: float

class AlertRequest(BaseModel):
    user_id: str
    zip: str
    incidents: list
    weather: dict

@router.post("/locations/save")
async def save_location(request: LocationRequest):
    try:
        conn = get_db()
        cur = conn.cursor()

        # Check if location already exists
        cur.execute(
            "SELECT id FROM saved_locations WHERE user_id = %s AND zip_code = %s",
            (request.user_id, request.zip_code)
        )
        existing = cur.fetchone()

        if existing:
            conn.close()
            return {"status": "exists", "message": "Location already saved"}

        # Save new location
        cur.execute(
            """INSERT INTO saved_locations 
            (user_id, label, address, zip_code, lat, lng) 
            VALUES (%s, %s, %s, %s, %s, %s) RETURNING id""",
            (request.user_id, request.label, request.address,
             request.zip_code, request.lat, request.lng)
        )
        location_id = cur.fetchone()[0]
        conn.commit()
        conn.close()

        return {
            "status": "success",
            "message": f"Location '{request.label}' saved!",
            "id": location_id
        }
    except Exception as e:
        return {"status": "error", "error": str(e)}

@router.get("/locations/{user_id}")
async def get_locations(user_id: str):
    try:
        conn = get_db()
        cur = conn.cursor()
        cur.execute(
            """SELECT id, label, address, zip_code, lat, lng 
            FROM saved_locations WHERE user_id = %s""",
            (user_id,)
        )
        rows = cur.fetchall()
        conn.close()

        locations = [
            {
                "id": row[0],
                "label": row[1],
                "address": row[2],
                "zip_code": row[3],
                "lat": row[4],
                "lng": row[5]
            }
            for row in rows
        ]

        return {"status": "success", "locations": locations}
    except Exception as e:
        return {"status": "error", "locations": [], "error": str(e)}

@router.delete("/locations/{location_id}")
async def delete_location(location_id: int):
    try:
        conn = get_db()
        cur = conn.cursor()
        cur.execute("DELETE FROM saved_locations WHERE id = %s", (location_id,))
        conn.commit()
        conn.close()
        return {"status": "success", "message": "Location removed"}
    except Exception as e:
        return {"status": "error", "error": str(e)}

@router.post("/rag-alert")
async def get_rag_alert(request: AlertRequest):
    try:
        conn = get_db()
        cur = conn.cursor()

        # Get user's saved locations
        cur.execute(
            "SELECT zip_code, label FROM saved_locations WHERE user_id = %s",
            (request.user_id,)
        )
        saved = cur.fetchall()
        conn.close()

        # Check if current zip matches any saved location
        matched_label = None
        for zip_code, label in saved:
            if zip_code == request.zip:
                matched_label = label
                break

        high_severity = [i for i in request.incidents if i.get("severity") == "high"]

        if matched_label and high_severity:
            alert = f"⚠️ {len(high_severity)} high-risk incident(s) near your saved location '{matched_label}'. Stay alert!"
        elif matched_label:
            alert = f"✅ Your saved location '{matched_label}' looks safe right now."
        else:
            alert = "📍 Save this location to get personalized alerts here."

        return {
            "status": "success",
            "alert": alert,
            "matched_location": matched_label
        }
    except Exception as e:
        return {"status": "error", "alert": "Unable to load personalized alerts.", "error": str(e)}