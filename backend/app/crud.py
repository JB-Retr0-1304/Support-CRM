"""
CRUD operations for tickets and notes.
"""

from sqlalchemy.orm import Session
from sqlalchemy import or_, desc, asc
from typing import Optional
from datetime import datetime, timezone

from . import models, schemas


def create_ticket(db: Session, ticket_data: schemas.TicketCreate) -> models.Ticket:
    """Create a new support ticket."""
    db_ticket = models.Ticket(
        customer_name=ticket_data.customer_name,
        customer_email=ticket_data.customer_email,
        subject=ticket_data.subject,
        description=ticket_data.description,
        priority=ticket_data.priority,
    )
    db.add(db_ticket)
    db.commit()
    db.refresh(db_ticket)
    return db_ticket


def get_tickets(
    db: Session,
    search: Optional[str] = None,
    status: Optional[str] = None,
    sort_by: Optional[str] = "newest",
) -> list[models.Ticket]:
    """Get all tickets with optional search, filter, and sort."""
    query = db.query(models.Ticket)

    # Search across multiple fields
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            or_(
                models.Ticket.ticket_id.ilike(search_term),
                models.Ticket.customer_name.ilike(search_term),
                models.Ticket.customer_email.ilike(search_term),
                models.Ticket.subject.ilike(search_term),
            )
        )

    # Filter by status
    if status:
        query = query.filter(models.Ticket.status == status)

    # Sorting
    sort_map = {
        "newest": desc(models.Ticket.created_at),
        "oldest": asc(models.Ticket.created_at),
        "priority_high": desc(models.Ticket.priority),
        "priority_low": asc(models.Ticket.priority),
    }
    order = sort_map.get(sort_by, desc(models.Ticket.created_at))
    query = query.order_by(order)

    return query.all()


def get_ticket_by_id(db: Session, ticket_id: str) -> Optional[models.Ticket]:
    """Get a single ticket by its ticket_id."""
    return db.query(models.Ticket).filter(
        models.Ticket.ticket_id == ticket_id
    ).first()


def update_ticket(
    db: Session,
    ticket: models.Ticket,
    update_data: schemas.TicketUpdate,
) -> models.Ticket:
    """Update a ticket's status, priority, and/or add a note."""
    if update_data.status is not None:
        ticket.status = update_data.status

    if update_data.priority is not None:
        ticket.priority = update_data.priority

    # Add note if provided
    if update_data.note_text is not None:
        note = models.Note(
            ticket_id=ticket.ticket_id,
            note_text=update_data.note_text,
        )
        db.add(note)

    ticket.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(ticket)
    return ticket
