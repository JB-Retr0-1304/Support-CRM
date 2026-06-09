"""
Pydantic schemas for request/response validation.
"""

from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional, List
from datetime import datetime


# ─── Note Schemas ───────────────────────────────────────────

class NoteCreate(BaseModel):
    note_text: str = Field(..., min_length=1, max_length=5000, description="Note content")


class NoteResponse(BaseModel):
    id: int
    ticket_id: str
    note_text: str
    created_at: datetime

    class Config:
        from_attributes = True


# ─── Ticket Schemas ─────────────────────────────────────────

class TicketCreate(BaseModel):
    customer_name: str = Field(..., min_length=1, max_length=255, description="Customer full name")
    customer_email: EmailStr = Field(..., description="Valid customer email")
    subject: str = Field(..., min_length=1, max_length=500, description="Ticket subject")
    description: str = Field(..., min_length=1, max_length=10000, description="Detailed description")
    priority: int = Field(default=3, ge=1, le=5, description="Priority: 1 (Very Low) to 5 (Critical)")

    @field_validator("customer_name", "subject", "description")
    @classmethod
    def strip_whitespace(cls, v: str) -> str:
        stripped = v.strip()
        if not stripped:
            raise ValueError("Field cannot be empty or whitespace only")
        return stripped


class TicketUpdate(BaseModel):
    status: Optional[str] = Field(None, description="Ticket status")
    priority: Optional[int] = Field(None, ge=1, le=5, description="Priority: 1–5")
    note_text: Optional[str] = Field(None, min_length=1, max_length=5000, description="Add a note")

    @field_validator("status")
    @classmethod
    def validate_status(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            allowed = {"Open", "In Progress", "Closed"}
            if v not in allowed:
                raise ValueError(f"Status must be one of: {', '.join(allowed)}")
        return v


class TicketResponse(BaseModel):
    id: int
    ticket_id: str
    customer_name: str
    customer_email: str
    subject: str
    description: str
    priority: int
    status: str
    created_at: datetime
    updated_at: datetime
    notes: List[NoteResponse] = []

    class Config:
        from_attributes = True


class TicketListResponse(BaseModel):
    """Lightweight response for list view (no notes)."""
    id: int
    ticket_id: str
    customer_name: str
    customer_email: str
    subject: str
    priority: int
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
