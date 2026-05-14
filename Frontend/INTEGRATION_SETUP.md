# Frontend-Backend Integration Setup

## Overview
The frontend and backend are now fully connected with the following features:
- User authentication (signup/login) via MongoDB and JWT tokens
- Expense tracking with real-time synchronization to the database
- Automatic user session persistence

## How to Run

### 1. Start the Backend Server
Open a terminal in the `backend` directory and run:
```bash
npm run dev
```
Expected output:
```
MongoDB Connected
Server running on port 5000
```

### 2. Start the Frontend Development Server
Open a terminal in the root directory and run:
```bash
npm run dev
```
The frontend will typically run on http://localhost:5173

### 3. Open in Browser
Visit http://localhost:5173 and you should see:
- Login/Signup page if not authenticated
- Dashboard with expenses if authenticated

## Architecture

### Frontend (React + TanStack Router)
- **API Client** (`src/lib/api-client.ts`): Handles all HTTP requests to backend
- **Auth Context** (`src/lib/auth-context.tsx`): Manages user authentication and session
- **useExpenses Hook** (`src/hooks/useExpenses.ts`): Manages expense data and API calls

### Backend (Express + MongoDB)
- **Server** (`backend/server.js`): Express app with CORS enabled
- **Routes**:
  - `/api/auth/signup` - User registration
  - `/api/auth/login` - User login
  - `/api/expenses` - Get all expenses for authenticated user
  - `/api/expenses` - Add new expense
  - `/api/expenses/:id` - Delete expense
- **Authentication**: JWT tokens with 7-day expiration
- **Database**: MongoDB with User and Expense collections

## Environment Variables

### Backend (already configured)
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- Port: 5000

### Frontend (if needed to change)
- `VITE_API_BASE_URL`: Backend API base URL (default: http://localhost:5000/api)

## Key Features

✅ User registration and login
✅ JWT-based authentication
✅ Expense CRUD operations
✅ User-specific expense tracking
✅ Automatic session persistence
✅ Error handling and validation
✅ CORS enabled for cross-origin requests
✅ MongoDB for persistent storage

## Testing Workflow

1. **Sign up**: Create a new account with name, email, and password
2. **Add expenses**: Add expenses with title, amount, and category
3. **View expenses**: See all your expenses in the dashboard
4. **Delete expenses**: Remove expenses from your dashboard
5. **Session persistence**: Reload page - you'll stay logged in
6. **Logout**: Clear your session (if logout button is available)

## Troubleshooting

### "Connection refused" error
- Ensure backend server is running on port 5000
- Check that MongoDB connection string is valid

### "Invalid token" error
- Clear browser localStorage (auth data)
- Log out and log in again

### CORS errors
- Backend has CORS enabled
- Ensure frontend is accessing http://localhost:5000/api

### Expenses not loading
- Verify you're logged in
- Check browser console for detailed error messages
- Ensure backend server is running
