import uuid
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict

class EventBase(BaseModel):
    title: str
    description: str | None = None
    location: str | None = None
    event_date: datetime
    capacity: int = Field(ge=1)

class EventCreate(EventBase):
    pass

class EventUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    location: str | None = None
    event_date: datetime | None = None
    capacity: int | None = Field(default=None, ge=1)

class EventOut(EventBase):
    id: uuid.UUID
    is_active: bool
    created_by: uuid.UUID | None
    created_at: datetime
    updated_at: datetime | None
    registration_count: int = 0
    creator_name: str | None = None

    model_config = ConfigDict(from_attributes=True)

class EventList(BaseModel):
    items: list[EventOut]
    total: int
    page: int
    size: int
