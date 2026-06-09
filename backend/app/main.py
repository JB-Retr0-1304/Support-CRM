"""
Support CRM — FastAPI Application Entry Point

A lightweight customer support ticket management system.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import engine, Base
from .routes.tickets import router as tickets_router

# Create all database tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Support CRM API",
    description="Customer Support Ticket Management System",
    version="1.0.0",
)

# CORS — allow frontend origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict to your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(tickets_router)


@app.get("/")
def root():
    """Health check endpoint."""
    return {"status": "ok", "message": "Support CRM API is running"}
