# EventSphere 🎯

A modern campus event management platform built for **Sahyadri College of Engineering & Management**. Discover, register for, and manage college events in one place.

## Tech Stack

| Layer    | Technology                    |
|----------|-------------------------------|
| Frontend | Next.js 16, Tailwind CSS v3, Framer Motion, shadcn/ui |
| Backend  | Python FastAPI, Supabase (PostgreSQL) |
| Auth     | JWT (python-jose)             |

## Features

- 📅 **Event Feed** — Luma-style date-grouped event listings
- 🎨 **Event Detail Pages** — Full event info with registration form
- 🔐 **Admin Dashboard** — Create, edit, delete events + view registrations
- 🗺️ **Campus Map** — Embedded Google Maps
- ✉️ **Email Subscription** — Newsletter signup
- 📱 **Responsive Design** — Works on all screen sizes

## Quick Start

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: .\venv\Scripts\activate
pip install -r requirements.txt
# Configure .env (see .env.example)
uvicorn app.main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
# Configure .env.local with NEXT_PUBLIC_API_URL=http://localhost:8000
npm run dev
```

### Database
Run the SQL from `backend/sql/schema.sql` in your Supabase SQL editor, then optionally run `python seed.py` to populate demo data.

## Demo Credentials

| Role  | Email                   | Password  |
|-------|-------------------------|-----------|
| Admin | admin@sahyadri.edu.in   | admin123  |

## Project Structure

```
EventSphere/
├── backend/
│   ├── app/
│   │   ├── routers/      # API endpoints
│   │   ├── services/     # Business logic
│   │   ├── schemas/      # Pydantic models
│   │   ├── config.py     # Settings
│   │   ├── database.py   # Supabase client
│   │   └── main.py       # FastAPI app
│   ├── sql/              # Database schema
│   ├── seed.py           # Demo data seeder
│   └── requirements.txt
├── frontend/
│   ├── app/              # Next.js pages
│   ├── components/       # React components
│   ├── lib/              # API client
│   └── public/           # Static assets
└── .gitignore
```

## License

Built for academic demonstration purposes.
