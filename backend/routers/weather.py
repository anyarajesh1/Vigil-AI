from fastapi import APIRouter
import httpx

router = APIRouter()

@router.get("/weather")
async def get_weather(zip: str):
    try:
        # Using zip code to get approximate coordinates
        # Open-Meteo is 100% free, no API key needed
        coords = await get_coords_from_zip(zip)
        
        url = f"https://api.open-meteo.com/v1/forecast?latitude={coords['lat']}&longitude={coords['lng']}&current=temperature_2m,wind_speed_10m,precipitation,weather_code&wind_speed_unit=mph&temperature_unit=fahrenheit"
        
        async with httpx.AsyncClient() as client:
            response = await client.get(url, timeout=10.0)
            data = response.json()
            
        current = data.get("current", {})
        weather_code = current.get("weather_code", 0)
        
        # Determine alert level based on weather code
        alert_level = "low"
        alert_message = "Weather conditions are normal"
        
        if weather_code >= 80:
            alert_level = "high"
            alert_message = "⚠️ Severe weather warning in your area"
        elif weather_code >= 60:
            alert_level = "medium"
            alert_message = "🌧️ Heavy rain expected today"
        elif weather_code >= 40:
            alert_level = "medium" 
            alert_message = "🌦️ Light rain expected today"
            
        return {
            "zip": zip,
            "status": "success",
            "temperature": current.get("temperature_2m"),
            "wind_speed": current.get("wind_speed_10m"),
            "precipitation": current.get("precipitation"),
            "alert_level": alert_level,
            "alert_message": alert_message,
            "lat": coords["lat"],
            "lng": coords["lng"]
        }
    except Exception as e:
        return {"zip": zip, "status": "error", "error": str(e)}

async def get_coords_from_zip(zip: str):
    # Use OpenStreetMap Nominatim - free, no key needed
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
        return {"lat": 37.7749, "lng": -122.4194}  # Default to SF
