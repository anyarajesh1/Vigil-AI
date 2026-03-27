from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import crime, weather, emergency, ai, rag, email_alerts
import os

app = FastAPI(title="Vigil-AI API")

# Allow both local and production frontend
origins = [
    "http://localhost:3000",
    "https://*.vercel.app",
    os.getenv("FRONTEND_URL", "http://localhost:3000"),
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(crime.router, prefix="/api")
app.include_router(weather.router, prefix="/api")
app.include_router(emergency.router, prefix="/api")
app.include_router(ai.router, prefix="/api")
app.include_router(rag.router, prefix="/api")
app.include_router(email_alerts.router, prefix="/api")

@app.get("/")
def root():
    return {"message": "Vigil-AI API is running!"}