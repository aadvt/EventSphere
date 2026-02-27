import uuid
from typing import Tuple, List, Dict, Any
from app.database import supabase
from app.schemas.event import EventCreate, EventUpdate

def get_events(page: int, size: int, search: str | None = None) -> Tuple[List[Dict[str, Any]], int]:
    try:
        offset = (page - 1) * size
        
        query = supabase.table("events").select("*, users(full_name)", count="exact")
        
        if search:
            query = query.ilike("title", f"%{search}%")
            
        query = query.eq("is_active", True)
        query = query.order("event_date").range(offset, offset + size - 1)
        
        response = query.execute()
        
        events = response.data if response.data else []
        total_count = response.count if response.count is not None else 0
        return events, total_count
    except Exception as e:
        import logging
        logging.error(f"Supabase error fetching events: {e}")
        return [], 0

def get_event_by_id(event_id: uuid.UUID) -> Dict[str, Any] | None:
    try:
        response = supabase.table("events").select("*, users(full_name)").eq("id", str(event_id)).single().execute()
        return response.data
    except Exception:
        return None

def create_event(data: EventCreate, user_id: uuid.UUID) -> Dict[str, Any]:
    event_data = data.model_dump()
    # Pydantic dict gives datetime objects; Supabase python SDK serializes them but it's safer to ensure string formats if issues arise.
    event_data["event_date"] = event_data["event_date"].isoformat()
    event_data["created_by"] = str(user_id)
    
    response = supabase.table("events").insert(event_data).execute()
    return response.data[0]

def update_event(event_id: uuid.UUID, data: EventUpdate) -> Dict[str, Any] | None:
    update_data = data.model_dump(exclude_unset=True)
    if not update_data:
        return get_event_by_id(event_id)
        
    if "event_date" in update_data and update_data["event_date"]:
        update_data["event_date"] = update_data["event_date"].isoformat()
        
    response = supabase.table("events").update(update_data).eq("id", str(event_id)).execute()
    if not response.data:
        return None
    return response.data[0]

def soft_delete_event(event_id: uuid.UUID) -> bool:
    response = supabase.table("events").update({"is_active": False}).eq("id", str(event_id)).execute()
    return len(response.data) > 0

def get_registration_count(event_id: uuid.UUID) -> int:
    response = supabase.table("registrations").select("id", count="exact").eq("event_id", str(event_id)).execute()
    return response.count if response.count is not None else 0
