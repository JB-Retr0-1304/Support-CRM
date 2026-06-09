# Support CRM — Customer Support Ticket Management System

A full-stack customer support ticket management system built with **FastAPI** and **React**.

## Architecture

```
React + TailwindCSS + Axios   (Frontend — Vite)
          ↓
     FastAPI + Pydantic        (Backend — REST API)
          ↓
   SQLAlchemy + SQLite         (Database)
```

## Features

### Core
- ✅ Create support tickets
- ✅ View all tickets in a sortable, filterable table
- ✅ Search tickets by ID, name, email, or subject
- ✅ Filter tickets by status (Open, In Progress, Closed)
- ✅ View individual ticket details
- ✅ Update ticket status and priority
- ✅ Add notes to tickets

### Enhancements
- ✅ Priority levels with color-coded badges (P1–P5)
- ✅ Sorting: Newest, Oldest, Priority High→Low, Priority Low→High
- ✅ Frontend + Backend validation (required fields, email format)

## Setup Instructions

### Prerequisites
- Python 3.10+
- Node.js 18+

Live Demo:
https://support-crm-seven.vercel.app/

API Docs:
https://supportcrmapi.up.railway.app/docs

## API Endpoints

| Method | Endpoint                 | Description                              |
|--------|--------------------------|------------------------------------------|
| GET    | `/`                      | Health check                             |
| POST   | `/api/tickets/`          | Create a new ticket                      |
| GET    | `/api/tickets/`          | List all tickets (supports search, filter, sort) |
| GET    | `/api/tickets/{ticket_id}` | Get a single ticket with notes         |
| PUT    | `/api/tickets/{ticket_id}` | Update status, priority, or add a note |

### Query Parameters (GET /api/tickets/)

| Parameter  | Type   | Description                                        |
|------------|--------|----------------------------------------------------|
| `search`   | string | Search across ticket_id, name, email, subject      |
| `status`   | string | Filter: `Open`, `In Progress`, `Closed`            |
| `sort_by`  | string | Sort: `newest`, `oldest`, `priority_high`, `priority_low` |

## Project Structure

```
support-crm/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py          # FastAPI app entry point
│   │   ├── database.py      # SQLAlchemy engine & session
│   │   ├── models.py        # ORM models (Ticket, Note)
│   │   ├── schemas.py       # Pydantic validation schemas
│   │   ├── crud.py          # Database operations
│   │   └── routes/
│   │       ├── __init__.py
│   │       └── tickets.py   # API route handlers
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── CreateTicketPage.jsx
│   │   │   └── TicketDetailPage.jsx
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── PriorityBadge.jsx
│   │   │   └── StatusBadge.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
├── .gitignore
├── .env.example
└── README.md
```
