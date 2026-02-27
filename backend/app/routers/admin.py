import uuid
from typing import Annotated
from fastapi import APIRouter, Depends, Query, HTTPException, status
from app.database import supabase
from app.schemas.user import UserOut
from app.dependencies import get_admin_user

router = APIRouter(prefix="/api/admin", tags=["admin"])

@router.get("/events/{event_id}/registrations")
async def get_event_registrations(
    event_id: uuid.UUID,
    current_user: UserOut = Depends(get_admin_user)
):
    """Admin: Get all registrations for a specific event."""
    response = supabase.table("registrations").select("*, users(full_name, email)").eq("event_id", str(event_id)).order("registered_at", desc=False).execute()
    regs = response.data if response.data else []
    
    out = []
    for reg in regs:
        u_data = reg.get("users", {})
        out.append({
            "registration_id": reg.get("id"),
            "user_full_name": u_data.get("full_name") if u_data else None,
            "user_email": u_data.get("email") if u_data else None,
            "registered_at": reg.get("registered_at")
        })
    return out

@router.get("/users", response_model=list[UserOut])
async def get_all_users(
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=50),
    current_user: UserOut = Depends(get_admin_user)
):
    """Admin: Get a paginated list of all users."""
    offset = (page - 1) * size
    response = supabase.table("users").select("*").order("created_at", desc=True).range(offset, offset + size - 1).execute()
    users = response.data if response.data else []
    return [UserOut(**u) for u in users]

@router.patch("/users/{user_id}/toggle-admin", response_model=UserOut)
async def toggle_admin_status(
    user_id: uuid.UUID,
    current_user: UserOut = Depends(get_admin_user)
):
    """Admin: Toggle the is_admin field for a user."""
    if str(user_id) == str(current_user.id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Cannot demote yourself"
        )
        
    # Get current user status
    user_res = supabase.table("users").select("is_admin").eq("id", str(user_id)).maybe_single().execute()
    if not user_res.data:
        raise HTTPException(status_code=404, detail="User not found")
        
    current_is_admin = user_res.data.get("is_admin", False)
    
    # Update and return
    update_res = supabase.table("users").update({"is_admin": not current_is_admin}).eq("id", str(user_id)).execute()
    if not update_res.data:
        raise HTTPException(status_code=404, detail="User not found")
        
    return UserOut(**update_res.data[0])
