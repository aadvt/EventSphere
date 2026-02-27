import uuid
from fastapi import APIRouter, Depends, HTTPException, status, Query
from app.schemas.user import UserOut
from app.schemas.event import EventCreate, EventUpdate, EventOut, EventList
from app.dependencies import get_admin_user
from app.services.event_service import (
    get_events, get_event_by_id, create_event, 
    update_event, soft_delete_event, get_registration_count
)

router = APIRouter(prefix="/api/events", tags=["events"])

@router.get("/", response_model=EventList)
async def list_events(
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=50),
    search: str | None = None
):
    """Retrieve a paginated list of active events."""
    events, total = get_events(page, size, search)
    
    out_events = []
    for event_data in events:
        reg_count = get_registration_count(event_data["id"])
        
        # Handle the joined user data
        creator_name = event_data.get("users", {}).get("full_name") if event_data.get("users") else None
            
        event_dict = {
            **event_data,
            "registration_count": reg_count,
            "creator_name": creator_name
        }
        out_events.append(EventOut(**event_dict))
        
    return EventList(items=out_events, total=total, page=page, size=size)

@router.get("/{event_id}", response_model=EventOut)
async def get_event(event_id: uuid.UUID):
    """Retrieve a specific event by its ID."""
    event_data = get_event_by_id(event_id)
    if not event_data or not event_data.get("is_active"):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")
        
    reg_count = get_registration_count(event_id)
    creator_name = event_data.get("users", {}).get("full_name") if event_data.get("users") else None
    
    event_dict = {
        **event_data,
        "registration_count": reg_count,
        "creator_name": creator_name
    }
    return EventOut(**event_dict)

@router.post("/", response_model=EventOut, status_code=status.HTTP_201_CREATED)
async def create_new_event(
    event_data: EventCreate,
    current_user: UserOut = Depends(get_admin_user)
):
    """Create a new event (Admin only)."""
    from datetime import datetime, timezone
    if event_data.event_date <= datetime.now(timezone.utc):
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Event date must be in the future")
        
    created_event = create_event(event_data, current_user.id)
    
    event_dict = {
        **created_event,
        "registration_count": 0,
        "creator_name": current_user.full_name
    }
    return EventOut(**event_dict)

@router.patch("/{event_id}", response_model=EventOut)
async def update_existing_event(
    event_id: uuid.UUID,
    event_data: EventUpdate,
    current_user: UserOut = Depends(get_admin_user)
):
    """Update an existing event (Admin only)."""
    # Verify exists
    existing = get_event_by_id(event_id)
    if not existing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")
        
    updated_event = update_event(event_id, event_data)
    if not updated_event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")
        
    reg_count = get_registration_count(event_id)
    # The updated response from update() won't include the users() join unless we fetch again or just reuse existing
    # Best to fetch again to get the joined data cleanly
    fresh_event_data = get_event_by_id(event_id)
    creator_name = fresh_event_data.get("users", {}).get("full_name") if fresh_event_data.get("users") else None
    
    event_dict = {
        **updated_event,
        "registration_count": reg_count,
        "creator_name": creator_name
    }
    return EventOut(**event_dict)

@router.delete("/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_event(
    event_id: uuid.UUID,
    current_user: UserOut = Depends(get_admin_user)
):
    """Soft delete an event (Admin only)."""
    success = soft_delete_event(event_id)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")
