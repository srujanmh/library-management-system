# Full Stack Library Management System

A production-ready full-stack Library Management System built with the MERN stack (MongoDB, Express, React, Node.js) and TailwindCSS.

## Features

**Admin Role**:
- Dashboard with Analytics (Charts via `react-chartjs-2`)
- Manage Books (Create, Read, Update, Delete)
- Manage Issues (Issue books to users, Process Returns)

**Student Role**:
- Gamified Dashboard tracking Reading Points and Badges
- Voice-enabled Book Search (Web Speech API)
- Seat Booking system (prevents double bookings)
- Reading Progress and Borrowing History track

**Globally Available**:
- AI Chatbot Librarian answering queries

## Prerequisites
- Node.js (v18+)
- MongoDB (Running locally on the default port or adjust `/backend/.env` MONGO_URI)

## Setup Instructions

### 1. Database & Backend Setup

Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```

Seed the database with example users, books, and issue records:
```bash
# Ensure MongoDB is running first
node seed.js
```

Start the backend server on `http://localhost:5000`:
```bash
npm start
```

### 2. Frontend Setup

In a new terminal, navigate to the frontend directory:
```bash
cd frontend
npm install
```

Start the React application using Vite:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Example Logins Generated via Seed
- **Admin**: `admin@library.com` / `admin123`
- **Student 1**: `john@example.com` / `student123`
- **Student 2**: `jane@example.com` / `student123`
