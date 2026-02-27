import uuid
from datetime import datetime, timedelta, timezone
from fastapi import HTTPException
from app.database import supabase
from app.services.event_service import get_event_by_id, get_registration_count

def register_user(user_id: uuid.UUID, event_id: uuid.UUID) -> dict:
    # Check if event exists and is active
    event = get_event_by_id(event_id)
    if not event or not event.get("is_active"):
        raise HTTPException(status_code=404, detail="Event not found or inactive")
        
    # Check if event date has passed
    # Supabase gives ISO format string, e.g. "2024-03-20T12:00:00+00:00"
    event_date_str = event.get("event_date")
    if event_date_str:
        # replace Z if present depending on how it's stored
        event_date_str = event_date_str.replace("Z", "+00:00")
        event_date = datetime.fromisoformat(event_date_str)
        if event_date <= datetime.now(timezone.utc):
            raise HTTPException(status_code=400, detail="Cannot register for past events")
        
    # Check capacity
    current_count = get_registration_count(event_id)
    if current_count >= event.get("capacity", 0):
        raise HTTPException(status_code=400, detail="Event is full")
        
    # Check if already registered
    existing_res = supabase.table("registrations").select("id").eq("user_id", str(user_id)).eq("event_id", str(event_id)).execute()
    if existing_res.data:
        raise HTTPException(status_code=400, detail="Already registered for this event")
        
    # Create registration
    data = {
        "user_id": str(user_id),
        "event_id": str(event_id)
    }
    response = supabase.table("registrations").insert(data).execute()
    return response.data[0]

def get_user_registrations(user_id: uuid.UUID) -> list[dict]:
    response = supabase.table("registrations").select("*, events(title, event_date)").eq("user_id", str(user_id)).order("registered_at", desc=True).execute()
    return response.data if response.data else []

def cancel_registration(registration_id: uuid.UUID, user_id: uuid.UUID) -> None:
    # Fetch registration
    reg_res = supabase.table("registrations").select("*").eq("id", str(registration_id)).maybe_single().execute()
    registration = reg_res.data
    
    if not registration:
        raise HTTPException(status_code=404, detail="Registration not found")
        
    if registration.get("user_id") != str(user_id):
        raise HTTPException(status_code=403, detail="Not authorized to cancel this registration")
        
    event = get_event_by_id(registration.get("event_id"))
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
        
    event_date_str = event.get("event_date")
    if event_date_str:
        event_date_str = event_date_str.replace("Z", "+00:00")
        event_date = datetime.fromisoformat(event_date_str)
        if event_date - datetime.now(timezone.utc) < timedelta(hours=24):
            raise HTTPException(status_code=400, detail="Cannot cancel within 24 hours of the event")
        
    supabase.table("registrations").delete().eq("id", str(registration_id)).execute()
