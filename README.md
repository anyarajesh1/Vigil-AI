# ⚡ Vigil-AI
### AI that watches over your neighborhood 24/7

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat&logo=next.js)
![FastAPI](https://img.shields.io/badge/FastAPI-Python-009688?style=flat&logo=fastapi)
![Groq](https://img.shields.io/badge/Groq-AI-orange?style=flat)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?style=flat&logo=vercel)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat)

## 🌐 Live Demo
**[→ Try Vigil-AI Live](https://vigil-ai-two.vercel.app)**

- **Frontend:** https://vigil-ai-two.vercel.app
- **Backend API:** https://vigil-ai-backend.onrender.com

---

## 🚨 What is Vigil-AI?

Vigil-AI is a real-time, AI-powered community safety platform that helps
everyday people understand what's happening in their neighborhood. Enter
any US zip code and instantly see:

- 🗺️ **Live crime incidents** plotted on an interactive map
- 🤖 **AI-generated safety summaries** in plain English
- ⛈️ **Real-time weather alerts** and conditions
- 🚨 **FEMA emergency declarations** for your area
- 🔴 **Risk level scoring** (High / Moderate / Low)

No signup required — just enter your zip code and go!

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** — React framework with App Router
- **Tailwind CSS** — Utility-first styling
- **Leaflet.js** — Interactive maps with OpenStreetMap

### Backend
- **FastAPI** (Python) — High-performance REST API
- **PostgreSQL + pgvector** — Database with vector search
- **Prisma ORM** — Type-safe database client

### AI & Data
- **Groq API** (Llama 3) — Lightning-fast AI summaries
- **FBI Crime Data API** — Real crime statistics
- **NOAA API** — Official weather data
- **FEMA API** — Emergency declarations
- **Open-Meteo API** — Hyperlocal weather conditions
- **OpenStreetMap + Nominatim** — Free map tiles & geocoding

### Infrastructure
- **Vercel** — Frontend deployment
- **Render.com** — Backend deployment
- **Supabase** — PostgreSQL database hosting

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js 18+
- Python 3.11+
- PostgreSQL 17+

### 1. Clone the repo
```bash
git clone https://github.com/anyarajesh1/Vigil-AI.git
cd Vigil-AI
```

### 2. Set up the backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Create `backend/.env`:
```
GROQ_API_KEY=your_groq_api_key
RESEND_API_KEY=your_resend_api_key
```

Start the backend:
```bash
uvicorn main:app --reload
```

### 3. Set up the frontend
```bash
cd frontend
npm install --legacy-peer-deps
```

Create `frontend/.env`:
```
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

Start the frontend:
```bash
npm run dev
```

### 4. Open the app
```
http://localhost:3000
```

---

## 🔑 Free API Keys

| Service | Link | Cost |
|---------|------|------|
| Groq AI | console.groq.com | Free |
| Resend Email | resend.com | Free |
| FBI Crime API | api.data.gov | Free |
| NOAA | api.noaa.gov | Free |
| FEMA | api.fema.gov | Free |
| Open-Meteo | open-meteo.com | Free — no key needed |

---

## 📁 Project Structure
```
Vigil-AI/
├── frontend/                 # Next.js 14 app
│   ├── app/
│   │   ├── page.tsx         # Landing page
│   │   ├── dashboard/       # Main dashboard
│   │   └── components/
│   │       └── SafetyMap.tsx
│   └── prisma/              # Database schema
├── backend/                  # FastAPI Python app
│   ├── routers/
│   │   ├── crime.py         # FBI crime data
│   │   ├── weather.py       # Weather data
│   │   ├── emergency.py     # FEMA data
│   │   ├── ai.py            # Groq AI summaries
│   │   └── email_alerts.py  # Email notifications
│   └── main.py
└── database/
    └── schema.sql
```

---

## 🌟 Key Features

- **Real-time data** — All safety data updates live
- **AI-powered** — Groq Llama 3 generates plain-English advice
- **Hyperlocal** — Zip code precision across the entire US
- **100% Free** — Built entirely on free APIs
- **No signup required** — Open to everyone instantly
- **Mobile friendly** — Works on any device

---

## 📄 License
MIT — feel free to use and build on this!

---

Built by [Anya Rajesh](https://github.com/anyarajesh1)