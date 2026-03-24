from fastapi import APIRouter
import httpx

router = APIRouter()

@router.get("/emergency")
async def get_emergency_data(zip: str):
    try:
        # FEMA API - 100% free, no key needed
        url = f"https://www.fema.gov/api/open/v2/disasterDeclarationsSummaries?$filter=incidentBeginDate%20ge%20'2024-01-01'&$orderby=declarationDate%20desc&$top=5"
        
        async with httpx.AsyncClient() as client:
            response = await client.get(url, timeout=10.0)
            data = response.json()
            
        disasters = data.get("DisasterDeclarationsSummaries", [])
        
        formatted = []
        for d in disasters[:3]:
            formatted.append({
                "id": d.get("id"),
                "type": d.get("incidentType", "Unknown"),
                "state": d.get("state"),
                "title": d.get("declarationTitle"),
                "date": d.get("declarationDate"),
                "severity": "high" if d.get("incidentType") in ["Hurricane", "Earthquake", "Tornado"] else "medium"
            })
            
        return {
            "zip": zip,
            "status": "success",
            "emergencies": formatted
        }
    except Exception as e:
        return {"zip": zip, "status": "error", "emergencies": [], "error": str(e)}
