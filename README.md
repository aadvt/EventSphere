# EventSphere — Campus Event Platform

## Project Overview
EventSphere is a comprehensive, full-stack event management platform designed specifically for the students and faculty of Sahyadri College. It provides a centralized hub to discover, manage, and register for campus events. This is a production-deployed application built to demonstrate modern web development, API design, and containerized deployment practices.

## Live Deployment
- **EC2 Public IP:** `3.110.208.37`
- **Frontend:** http://3.110.208.37
- **API Docs:** http://3.110.208.37/api/docs

## Tech Stack
| Component | Technology |
|---|---|
| **Backend** | FastAPI (Python 3.11), SQLAlchemy, Pydantic |
| **Frontend** | Next.js 16 (App Router), React, Tailwind CSS |
| **Database** | Supabase (PostgreSQL) |
| **Containerization** | Docker + Docker Compose |
| **Reverse Proxy** | Nginx |
| **Cloud** | AWS EC2 (t3.micro, Ubuntu 22.04), GitHub Actions |

---

## 🏗️ Architecture

<div align="center">
  <img src="docs/images/application-architecture.png" alt="Application Architecture: User to Supabase" width="800"/>
</div>

```text
Browser
  ↓
EC2 Instance (Port 80)
  ↓
Nginx Container (Reverse Proxy)
  ├── /api/ → FastAPI Backend Container (Port 8000)
  └── /     → Next.js Frontend Container (Port 3000)
                      ↓
              Supabase (Remote PostgreSQL)
```

The entry point for all incoming traffic is an AWS EC2 instance opening port 80. Behind this sits an Nginx container acting as a reverse proxy. Nginx intelligently routes traffic based on the URL path: requests starting with `/api/` are forwarded to the FastAPI backend, while all other requests are directed to the Next.js frontend. The backend connects to a managed PostgreSQL database hosted on Supabase to persist application data.

---

## 🖥️ Frontend (Next.js)

The frontend is built using **Next.js (App Router)** to leverage both Server-Side Rendering (SSR) for fast initial loads/SEO and Client-Side Navigation for a highly interactive user experience.

### Key Features
- **Dynamic Routing:** Utilizes `[id]/page.tsx` schemas to automatically generate detail pages for every event.
- **Server/Client Separation:** Clean distinction between Server Components (fetching initial data directly from the internal Docker network for speed) and Client Components (handling interactive states like the registration modals).
- **Responsive Design:** Completely styled using **Tailwind CSS**, ensuring the UI adapts perfectly from mobile devices to large desktop monitors.
- **Dynamic API Resolution:** The `lib/api.ts` client is designed to automatically switch between `localhost` (for local dev), internal Docker hostnames (during SSR), and relative paths (for client-side browser fetches), eliminating CORS issues.

---

## ⚙️ Backend (FastAPI)

The backend is a high-performance REST API built with Python's **FastAPI** framework.

### Architecture & Security
- **Data Validation:** Utilizes **Pydantic** models to rigorously validate all incoming request workloads (e.g., ensuring emails are valid, capacities are positive integers) before they ever touch the database.
- **ORM Integration:** Uses **SQLAlchemy** to safely interact with the PostgreSQL database, mitigating SQL injection risks.
- **Authentication:** Implements industry-standard **JWT (JSON Web Tokens)** for secure Admin authentication logic, utilizing the `OAuth2PasswordBearer` flow.
- **Auto-Documentation:** FastAPI automatically generates interactive Swagger UI documentation, accessible at `/api/docs`.

### Core Endpoints
- `GET /api/events/` - Fetch all active events (supports search formatting).
- `GET /api/events/{id}` - Fetch details for a specific event.
- `POST /api/registrations/public` - Public endpoint for users to register for an event.
- `POST /api/auth/login` - Admin authentication endpoint returning a JWT.

---

## 🐳 Docker Implementation

### Why Docker
Docker ensures our application runs identically regardless of where it is deployed. By packaging the application code and dependencies together, we avoid "it works on my machine" issues.

<div align="center">
  <img src="docs/images/containerization-flow.png" alt="Containerization Flow and Docker Compose Orchestration" width="800"/>
</div>

### Multi-Stage Frontend Build
The Next.js `Dockerfile` uses a multi-stage approach. The `builder` stage installs all dependencies to compile the application. The final `runner` stage drops the bulky node_modules and only copies the lightweight `.next/standalone` compiled output. This results in a highly secure, minimal production container.

### docker-compose.yml
- **Services:** Orchestrates `backend`, `frontend`, and `nginx`.
- **Internal Networking:** Containers communicate using their service names (e.g. `http://backend:8000`).
- **Security:** Only the `nginx` container exposes a port to the host machine (80). The frontend and backend remain securely isolated in the internal Docker network.
- **CI/CD:** A GitHub Actions workflow (`docker-deploy.yml`) is configured to automatically rebuild and push these Docker images to Docker Hub on every push to the `main` branch.

---

## 🚀 Local Development Guide

Want to run EventSphere on your own machine? Follow these steps:

### 1. Backend Setup
```bash
cd backend
python -m venv venv

# Activate virtual environment
# Windows: .\venv\Scripts\activate
# Mac/Linux: source venv/bin/activate

pip install -r requirements.txt

# Create a .env file locally with DATABASE_URL, SECRET_KEY, ALGORITHM
uvicorn app.main:app --reload
```
*The backend will be live at `http://127.0.0.1:8000`*

### 2. Frontend Setup
Open a new terminal:
```bash
cd frontend
npm install

# Create a .env.local file with NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
npm run dev
```
*The frontend will be live at `http://localhost:3000`*

---

## ☁️ EC2 Production Deployment

### Prerequisites
- AWS EC2 instance (Ubuntu) with port 80 and 22 open.
- Docker & Docker Compose installed on the server.

### Automated Deployment Flow
Thanks to the configured GitHub Action, deploying updates is incredibly simple:
1. Push your code changes to the `main` branch on GitHub.
2. The CI/CD pipeline automatically builds and pushes the new images to Docker Hub.
3. SSH into your EC2 instance.
4. Run the following commands to pull the fresh images and orchestrate a zero-downtime recreation:
```bash
cd eventsphere
docker-compose pull
docker stop $(docker ps -aq)
docker rm -f $(docker ps -aq)
docker-compose up -d
```
