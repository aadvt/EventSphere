import uuid
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from app.schemas.user import UserOut
from app.schemas.registration import RegistrationCreate, RegistrationOut
from app.dependencies import get_current_user
from app.services.registration_service import register_user, get_user_registrations, cancel_registration
from app.database import supabase

router = APIRouter(prefix="/api/registrations", tags=["registrations"])

# --- Public Registration (no auth required) ---
class PublicRegistrationCreate(BaseModel):
    event_id: uuid.UUID
    name: str
    email: str

@router.post("/public", status_code=status.HTTP_201_CREATED)
async def create_public_registration(data: PublicRegistrationCreate):
    """Register for an event without authentication (demo/public use)."""
    # Find or create a guest user
    existing = supabase.table("users").select("*").eq("email", data.email).execute()
    
    if existing.data and len(existing.data) > 0:
        user = existing.data[0]
    else:
        # Create a guest user with a dummy password
        user_res = supabase.table("users").insert({
            "email": data.email,
            "full_name": data.name,
            "hashed_password": "guest_no_login",
            "is_admin": False,
            "is_active": True,
        }).execute()
        user = user_res.data[0]
    
    user_id = user["id"]
    
    # Use existing registration logic
    try:
        reg = register_user(uuid.UUID(user_id), data.event_id)
    except HTTPException as e:
        raise e
    
    return {"id": reg["id"], "message": "Registration successful", "name": data.name, "email": data.email}

@router.post("/", response_model=RegistrationOut, status_code=status.HTTP_201_CREATED)
async def create_registration(
    data: RegistrationCreate,
    current_user: UserOut = Depends(get_current_user)
):
    """Register for an event."""
    reg = register_user(current_user.id, data.event_id)
    
    # Needs to eagerly load event to get title, wait the get_user_registrations needs selectinload or we fetch it
    from app.services.event_service import get_event_by_id
    event = get_event_by_id(data.event_id)
    
    reg_dict = {
        **reg,
        "event_title": event.get("title") if event else None,
        "user_full_name": current_user.full_name
    }
    return RegistrationOut(**reg_dict)

@router.get("/my", response_model=list[RegistrationOut])
async def list_my_registrations(
    current_user: UserOut = Depends(get_current_user)
):
    """Get all registrations for the current user."""
    regs = get_user_registrations(current_user.id)
    out_regs = []
    
    for reg in regs:
        # registration_service.py already does left join: *, events(title, event_date)
        event_data = reg.get("events")
        
        reg_dict = {
            **reg,
            "event_title": event_data.get("title") if event_data else None,
            "user_full_name": current_user.full_name
        }
        out_regs.append(RegistrationOut(**reg_dict))
    return out_regs

@router.delete("/{registration_id}", status_code=status.HTTP_204_NO_CONTENT)
async def cancel_user_registration(
    registration_id: uuid.UUID,
    current_user: UserOut = Depends(get_current_user)
):
    """Cancel a registration (at least 24 hours before event)."""
    cancel_registration(registration_id, current_user.id)
