"""
Seed script: Creates an admin user and demo events in Supabase.
Run from the backend directory: python seed.py
"""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from passlib.context import CryptContext
from app.database import supabase

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

ADMIN_EMAIL = "admin@sahyadri.edu.in"
ADMIN_PASSWORD = "admin123"
ADMIN_NAME = "Sahyadri Admin"

def seed():
    print("[SEED] Starting seed...")

    # --- 1. Create admin user ---
    existing = supabase.table("users").select("id").eq("email", ADMIN_EMAIL).maybe_single().execute()

    if existing.data:
        admin_id = existing.data["id"]
        print(f"[OK] Admin user already exists (id={admin_id})")
    else:
        hashed = pwd_context.hash(ADMIN_PASSWORD)
        res = supabase.table("users").insert({
            "email": ADMIN_EMAIL,
            "full_name": ADMIN_NAME,
            "hashed_password": hashed,
            "is_admin": True,
            "is_active": True,
        }).execute()
        admin_id = res.data[0]["id"]
        print(f"[OK] Created admin user: {ADMIN_EMAIL} / {ADMIN_PASSWORD} (id={admin_id})")

    # --- 2. Insert demo events ---
    demo_events = [
        {
            "title": "Skill Lab Presentation",
            "description": "A hands-on session showcasing innovative student projects built during the Skill Lab program. Teams present their prototypes and receive feedback from industry mentors.",
            "location": "Sahyadri Seminar Hall A",
            "event_date": "2026-02-28T10:00:00+05:30",
            "capacity": 150,
            "is_active": True,
            "created_by": admin_id,
        },
        {
            "title": "ProtoThon Hackathon",
            "description": "A 24-hour hackathon where students build working prototypes from scratch. Open to all departments. Prizes worth ₹50,000 for top 3 teams!",
            "location": "Sahyadri Innovation Center",
            "event_date": "2026-03-13T09:00:00+05:30",
            "capacity": 200,
            "is_active": True,
            "created_by": admin_id,
        },
        {
            "title": "AI & Machine Learning Workshop",
            "description": "Dive deep into neural networks, NLP, and computer vision with hands-on Python exercises. Covers TensorFlow, PyTorch, and real-world AI applications.",
            "location": "CS Lab 3, Block B",
            "event_date": "2026-03-20T14:00:00+05:30",
            "capacity": 80,
            "is_active": True,
            "created_by": admin_id,
        },
        {
            "title": "GitHub & Open Source Bootcamp",
            "description": "Learn Git workflows, pull requests, and how to contribute to open-source projects. Perfect for beginners looking to build their developer profile.",
            "location": "Sahyadri Auditorium",
            "event_date": "2026-03-27T11:00:00+05:30",
            "capacity": 120,
            "is_active": True,
            "created_by": admin_id,
        },
        {
            "title": "Cloud Computing Seminar",
            "description": "Industry experts from AWS and GCP discuss cloud architecture, serverless computing, and career paths in cloud engineering.",
            "location": "Conference Room, Admin Block",
            "event_date": "2026-04-05T10:00:00+05:30",
            "capacity": 100,
            "is_active": True,
            "created_by": admin_id,
        },
        {
            "title": "Full-Stack Web Dev Workshop",
            "description": "Build a complete web application using React, Next.js, and FastAPI in this intensive 2-day workshop. Covers frontend, backend, and deployment.",
            "location": "CS Lab 1, Block A",
            "event_date": "2026-04-12T09:30:00+05:30",
            "capacity": 60,
            "is_active": True,
            "created_by": admin_id,
        },
    ]

    # Check if events already exist
    existing_events = supabase.table("events").select("title").eq("is_active", True).execute()
    existing_titles = {e["title"] for e in (existing_events.data or [])}

    inserted = 0
    for event in demo_events:
        if event["title"] in existing_titles:
            print(f"  [SKIP] Already exists: {event['title']}")
            continue
        supabase.table("events").insert(event).execute()
        print(f"  [OK] Created: {event['title']}")
        inserted += 1

    print(f"\n[DONE] Seed complete! Inserted {inserted} new events.")
    print(f"   Admin login: {ADMIN_EMAIL} / {ADMIN_PASSWORD}")

if __name__ == "__main__":
    seed()
