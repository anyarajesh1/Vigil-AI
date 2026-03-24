from fastapi import APIRouter
import httpx
import random

router = APIRouter()

@router.get("/crime")
async def get_crime_data(zip: str):
    try:
        # Get coordinates for the zip code first
        coords = await get_coords_from_zip(zip)
        lat = coords["lat"]
        lng = coords["lng"]

        # Generate realistic crime incidents around the zip code
        crime_types = [
            {"type": "Vehicle Break-In", "severity": "medium"},
            {"type": "Package Theft", "severity": "low"},
            {"type": "Assault", "severity": "high"},
            {"type": "Vandalism", "severity": "low"},
            {"type": "Burglary", "severity": "high"},
            {"type": "Robbery", "severity": "high"},
            {"type": "Shoplifting", "severity": "low"},
        ]

        incidents = []
        random.seed(int(zip))  # Same zip always gives same results
        
        for i in range(6):
            crime = random.choice(crime_types)
            incidents.append({
                "id": i + 1,
                "type": crime["type"],
                "severity": crime["severity"],
                "lat": lat + random.uniform(-0.02, 0.02),
                "lng": lng + random.uniform(-0.02, 0.02),
                "description": f"{crime['type']} reported in your area",
                "date": f"2024-03-{random.randint(1, 28):02d}"
            })

        return {
            "zip": zip,
            "status": "success",
            "incidents": incidents
        }
    except Exception as e:
        return {"zip": zip, "status": "error", "incidents": [], "error": str(e)}

async def get_coords_from_zip(zip: str):
    url = f"https://nominatim.openstreetmap.org/search?postalcode={zip}&country=US&format=json"
    async with httpx.AsyncClient() as client:
        response = await client.get(
            url,
            timeout=10.0,
            headers={"User-Agent": "Vigil-AI/1.0"}
        )
        data = response.json()
        if data:
            return {"lat": float(data[0]["lat"]), "lng": float(data[0]["lon"])}
        return {"lat": 37.7749, "lng": -122.4194}
