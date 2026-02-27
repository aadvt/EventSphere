import uuid
from datetime import datetime
from pydantic import BaseModel, ConfigDict

class RegistrationBase(BaseModel):
    event_id: uuid.UUID

class RegistrationCreate(RegistrationBase):
    pass

class RegistrationOut(RegistrationBase):
    id: uuid.UUID
    user_id: uuid.UUID
    registered_at: datetime
    event_title: str | None = None
    user_full_name: str | None = None

    model_config = ConfigDict(from_attributes=True)
