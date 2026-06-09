"""
API route handlers for ticket operations.
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional, List

from ..database import get_db
from .. import schemas, crud

router = APIRouter(prefix="/api/tickets", tags=["Tickets"])


@router.post("/", response_model=schemas.TicketResponse, status_code=201)
def create_ticket(
    ticket_data: schemas.TicketCreate,
    db: Session = Depends(get_db),
):
    """Create a new support ticket."""
    ticket = crud.create_ticket(db, ticket_data)
    return ticket


@router.get("/", response_model=List[schemas.TicketListResponse])
def get_all_tickets(
    search: Optional[str] = Query(None, description="Search by ticket ID, name, email, or subject"),
    status: Optional[str] = Query(None, description="Filter by status: Open, In Progress, Closed"),
    sort_by: Optional[str] = Query("newest", description="Sort: newest, oldest, priority_high, priority_low"),
    db: Session = Depends(get_db),
):
    """
    Get all tickets with optional search, filter, and sorting.

    - **search**: partial match on ticket_id, customer_name, customer_email, subject
    - **status**: exact match on status (Open, In Progress, Closed)
    - **sort_by**: newest, oldest, priority_high, priority_low
    """
    tickets = crud.get_tickets(db, search=search, status=status, sort_by=sort_by)
    return tickets


@router.get("/{ticket_id}", response_model=schemas.TicketResponse)
def get_single_ticket(
    ticket_id: str,
    db: Session = Depends(get_db),
):
    """Get a single ticket by ticket ID, including all notes."""
    ticket = crud.get_ticket_by_id(db, ticket_id)
    if not ticket:
        raise HTTPException(status_code=404, detail=f"Ticket '{ticket_id}' not found")
    return ticket


@router.put("/{ticket_id}", response_model=schemas.TicketResponse)
def update_ticket(
    ticket_id: str,
    update_data: schemas.TicketUpdate,
    db: Session = Depends(get_db),
):
    """
    Update a ticket's status, priority, and/or add a note.

    At least one field must be provided.
    """
    ticket = crud.get_ticket_by_id(db, ticket_id)
    if not ticket:
        raise HTTPException(status_code=404, detail=f"Ticket '{ticket_id}' not found")

    # Ensure at least one field is being updated
    if update_data.status is None and update_data.priority is None and update_data.note_text is None:
        raise HTTPException(
            status_code=400,
            detail="At least one of 'status', 'priority', or 'note_text' must be provided"
        )

    updated_ticket = crud.update_ticket(db, ticket, update_data)
    return updated_ticket
