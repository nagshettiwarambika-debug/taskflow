# ⚡ TaskFlow — Full-Stack MERN Task Manager

A production-ready task management application built with the MERN stack (MongoDB, Express, React, Node.js).

![Stack](https://img.shields.io/badge/React-18-61DAFB?logo=react) ![Stack](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js) ![Stack](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb) ![Stack](https://img.shields.io/badge/JWT-Auth-000000?logo=jsonwebtokens)

---

## 📁 Project Structure

```
taskflow/
├── backend/                  # Node.js + Express REST API
│   ├── config/
│   │   └── db.js             # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js # Signup, login, profile
│   │   └── taskController.js # Full CRUD + stats
│   ├── middleware/
│   │   ├── authMiddleware.js  # JWT protection
│   │   └── errorMiddleware.js # Global error handler
│   ├── models/
│   │   ├── User.js           # User schema (bcrypt hashing)
│   │   └── Task.js           # Task schema with indexes
│   ├── routes/
│   │   ├── authRoutes.js     # /api/auth/*
│   │   └── taskRoutes.js     # /api/tasks/*
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── server.js             # Express app entry point
│
└── frontend/                 # React + Vite SPA
    ├── public/
    │   └── favicon.svg
    ├── src/
    │   ├── api/
    │   │   ├── axiosInstance.js  # Axios + interceptors
    │   │   ├── authAPI.js        # Auth API calls
    │   │   └── tasksAPI.js       # Tasks API calls
    │   ├── components/
    │   │   ├── common/
    │   │   │   └── ProtectedRoute.jsx
    │   │   └── layout/
    │   │       ├── AppLayout.jsx
    │   │       ├── Navbar.jsx
    │   │       └── Navbar.css
    │   ├── context/
    │   │   └── AuthContext.jsx   # Global auth state
    │   ├── hooks/
    │   │   └── useTasks.js       # Tasks data hook
    │   ├── pages/
    │   │   ├── auth/
    │   │   │   ├── Login.jsx
    │   │   │   ├── Signup.jsx
    │   │   │   └── Auth.css
    │   │   ├── dashboard/
    │   │   │   ├── Dashboard.jsx
    │   │   │   ├── Dashboard.css
    │   │   │   ├── Profile.jsx
    │   │   │   └── Profile.css
    │   │   ├── tasks/
    │   │   │   ├── Tasks.jsx     # Task list + filters
    │   │   │   ├── TaskCard.jsx  # Individual task card
    │   │   │   ├── TaskForm.jsx  # Create/edit modal
    │   │   │   └── Tasks.css
    │   │   └── NotFound.jsx
    │   ├── styles/
    │   │   └── globals.css       # Design system + utilities
    │   ├── App.jsx               # Router setup
    │   └── main.jsx              # React entry point
    ├── .env.example
    ├── .gitignore
    ├── index.html
    ├── package.json
    └── vite.config.js
```

---

## 🚀 Local Development Setup

### Prerequisites
- Node.js ≥ 18.0
- npm ≥ 9.0
- MongoDB Atlas account (free tier works fine) **or** local MongoDB

---

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/taskflow.git
cd taskflow
```

---

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` with your values:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/taskflow?retryWrites=true&w=majority
JWT_SECRET=change_this_to_a_random_32plus_char_string
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

Start the backend:

```bash
npm run dev      # Development (nodemon auto-reload)
# or
npm start        # Production
```

Backend runs at: **http://localhost:5000**

---

### 3. Frontend Setup

```bash
cd ../frontend
npm install
cp .env.example .env
```

Edit `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Frontend runs at: **http://localhost:5173**

---

## 🌐 API Documentation

### Base URL
- Local: `http://localhost:5000/api`
- Production: `https://your-app.onrender.com/api`

### Authentication Headers
All protected routes require:
```
Authorization: Bearer <jwt_token>
```

---

### Auth Routes — `/api/auth`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/signup` | ❌ | Register new user |
| POST | `/auth/login` | ❌ | Login, receive JWT |
| GET | `/auth/me` | ✅ | Get current user profile |
| PUT | `/auth/me` | ✅ | Update user name |

#### POST `/auth/signup`
```json
// Request body
{ "name": "Jane Doe", "email": "jane@example.com", "password": "secret123" }

// Response 201
{ "message": "Account created successfully.", "token": "<jwt>", "user": { "_id": "...", "name": "Jane Doe", "email": "jane@example.com" } }
```

#### POST `/auth/login`
```json
// Request body
{ "email": "jane@example.com", "password": "secret123" }

// Response 200
{ "message": "Logged in successfully.", "token": "<jwt>", "user": { ... } }
```

---

### Task Routes — `/api/tasks` (all protected 🔒)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tasks` | Get all tasks (supports filters) |
| GET | `/tasks/stats` | Get task statistics |
| GET | `/tasks/:id` | Get single task |
| POST | `/tasks` | Create new task |
| PUT | `/tasks/:id` | Update task |
| DELETE | `/tasks/:id` | Delete task |

#### GET `/tasks` — Query Parameters

| Param | Type | Values | Default |
|-------|------|--------|---------|
| `status` | string | `todo`, `in-progress`, `done` | — |
| `priority` | string | `low`, `medium`, `high` | — |
| `search` | string | any text | — |
| `sort` | string | `-createdAt`, `createdAt`, `dueDate`, `-priority` | `-createdAt` |
| `page` | number | any integer | `1` |
| `limit` | number | any integer | `50` |

#### POST/PUT `/tasks` — Request Body
```json
{
  "title": "Design the landing page",    // required, max 120 chars
  "description": "Figma mockup first",   // optional, max 1000 chars
  "status": "in-progress",               // todo | in-progress | done
  "priority": "high",                    // low | medium | high
  "dueDate": "2025-12-31",              // ISO date string or null
  "tags": ["design", "frontend"]         // array of strings
}
```

#### GET `/tasks/stats` — Response
```json
{
  "total": 12,
  "byStatus": { "todo": 4, "in-progress": 5, "done": 3 },
  "byPriority": { "low": 2, "medium": 7, "high": 3 }
}
```

---

## ☁️ Deployment Guide

### Backend → Render

1. Push your code to GitHub
2. Go to [render.com](https://render.com) → **New Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Node Version:** `18`
5. Add Environment Variables in the Render dashboard:
   ```
   PORT=5000
   NODE_ENV=production
   MONGO_URI=<your_atlas_uri>
   JWT_SECRET=<your_secret>
   JWT_EXPIRE=7d
   CLIENT_URL=https://your-frontend.vercel.app
   ```
6. Click **Deploy**

> 💡 Render free tier spins down after inactivity — upgrade to Starter ($7/mo) for always-on.

---

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import your GitHub repository
3. Configure:
   - **Root Directory:** `frontend`
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Add Environment Variables:
   ```
   VITE_API_URL=https://your-backend.onrender.com/api
   ```
5. Click **Deploy**

---

### MongoDB Atlas Setup

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a free M0 cluster
3. **Database Access** → Add user with password
4. **Network Access** → Allow `0.0.0.0/0` (or specific IPs)
5. **Connect** → Copy the connection string
6. Replace `<password>` and set database name to `taskflow`

---

## 📝 Suggested Git Commit Flow

```bash
# Initial setup
git init && git add . && git commit -m "Initial project structure"

# Backend
git commit -m "feat: add MongoDB connection and User model"
git commit -m "feat: implement JWT authentication (signup/login)"
git commit -m "feat: add Task model with Mongoose schema and indexes"
git commit -m "feat: implement full CRUD for tasks API"
git commit -m "feat: add task stats aggregation endpoint"
git commit -m "feat: add input validation with express-validator"

# Frontend
git commit -m "feat: setup Vite + React with routing"
git commit -m "feat: implement AuthContext with JWT storage"
git commit -m "feat: add Login and Signup pages"
git commit -m "feat: build Dashboard with stats cards"
git commit -m "feat: implement Tasks page with full CRUD UI"
git commit -m "feat: add task filtering, search, and sorting"
git commit -m "feat: add Profile page with name update"
git commit -m "style: implement dark design system with CSS variables"

# Deploy
git commit -m "chore: add deployment config and environment examples"
```

---

## 🔒 Security Highlights

- Passwords hashed with **bcrypt** (12 salt rounds)
- **JWT** tokens expire in 7 days
- All task routes scoped to `req.user._id` — users can only access their own data
- Input validated on both **frontend** and **backend**
- CORS restricted to `CLIENT_URL` env variable
- Request body size limited to **10kb**
- MongoDB injection protected by Mongoose schema types

---

## 🛠 Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, Vite |
| Styling | Vanilla CSS with custom design system |
| HTTP Client | Axios with interceptors |
| Backend | Node.js 18+, Express 4 |
| Database | MongoDB Atlas + Mongoose 8 |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| Validation | express-validator |
| Dev Tools | nodemon, morgan |

---

## 📄 License

MIT — use freely for personal or commercial projects.
