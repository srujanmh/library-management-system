# Library Management System

A full-stack Library Management System with AI-powered chatbot, real-time seat booking, and Instagram-style user profiles.

## Tech Stack
- **Frontend:** React 19 + Vite + TailwindCSS
- **Backend:** Node.js + Express 5
- **Database:** MongoDB Atlas
- **AI:** Google Gemini API

## Features
- 📚 Book management (CRUD, search, borrow/return)
- 👤 User profiles with photo upload
- 💬 AI-powered chatbot (Gemini)
- 💺 Seat booking system
- 📊 Admin dashboard with analytics
- 🔐 JWT authentication & role-based access

## Local Development

### Backend
```bash
cd backend
npm install
# Create .env with: MONGO_URI, JWT_SECRET, GEMINI_API_KEY
node server.js
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Deployment (Render)

### Backend (Web Service)
- **Root Directory:** `backend`
- **Build:** `npm install`
- **Start:** `npm start`
- **Env vars:** `MONGO_URI`, `JWT_SECRET`, `GEMINI_API_KEY`

### Frontend (Static Site)
- **Root Directory:** `frontend`
- **Build:** `npm install && npm run build`
- **Publish Directory:** `dist`
- **Env var:** `VITE_API_URL=https://your-backend.onrender.com/api`
- **Rewrite Rule:** `/* → /index.html`

## Default Login
- **Admin:** admin@library.com / admin123
- **Student:** john@example.com / student123
