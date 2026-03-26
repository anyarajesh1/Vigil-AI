from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import crime, weather, emergency, ai

app = FastAPI(title="Vigil-AI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(crime.router, prefix="/api")
app.include_router(weather.router, prefix="/api")
app.include_router(emergency.router, prefix="/api")
app.include_router(ai.router, prefix="/api")

@app.get("/")
def root():
    return {"message": "Vigil-AI API is running!"}