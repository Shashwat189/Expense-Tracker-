# 💸 Expense Tracker

A modern full-stack Expense Tracker application that allows users to securely manage expenses, track spending habits, and organize financial records through a responsive dashboard interface.

---

## ✨ Features

- 🔐 User Authentication (Signup / Login)
- 🛡️ Secure JWT-based Authentication
- ➕ Add, Delete, and Manage Expenses
- 🏷️ Expense Categories
- 💱 Currency Support
- 📱 Responsive Modern UI
- 🔒 Protected Routes
- 💾 Persistent Login State
- 🚀 Full-stack Deployment

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React + TypeScript | UI Framework |
| Vite | Build Tool |
| Tailwind CSS | Styling |
| TanStack Router | Client-side Routing |
| React Query | Server State Management |
| Lucide React | Icons |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express.js | Server Framework |
| MongoDB + Mongoose | Database & ODM |
| JWT | Authentication |
| bcrypt.js | Password Hashing |

### Deployment
| Layer | Platform |
|---|---|
| Frontend | Vercel |
| Backend | Render |
| Database | MongoDB Atlas |

---

## 📁 Project Structure

```
Expense-Tracker/
│
├── Frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
│
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── middleware/
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- npm
- MongoDB (local or Atlas)

### 1. Clone the Repository

```bash
git clone https://github.com/Shashwat189/Expense-Tracker-.git
cd Expense-Tracker-
```

### 2. Frontend Setup

```bash
cd Frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

### 3. Backend Setup

```bash
cd backend
npm install
npm run dev
```

Backend runs at: `http://localhost:5000`

---

## ⚙️ Environment Variables

### Frontend — `Frontend/.env`

```env
VITE_API_BASE_URL=https://your-backend-url.onrender.com/api
```

### Backend — `backend/.env`

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

---

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/signup` | Register a new user |
| `POST` | `/api/auth/login` | Login an existing user |

### Expenses

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/expenses` | Get all expenses |
| `POST` | `/api/expenses` | Add a new expense |
| `DELETE` | `/api/expenses/:id` | Delete an expense by ID |

---

## ☁️ Deployment

### Frontend — Vercel

1. Push frontend code to GitHub
2. Import the repository into [Vercel](https://vercel.com)
3. Set **Root Directory** to `Frontend`
4. Add the environment variable:
   ```
   VITE_API_BASE_URL=https://your-render-backend-url.onrender.com/api
   ```
5. Click **Deploy**

### Backend — Render

1. Create a **Web Service** on [Render](https://render.com)
2. Connect your GitHub repository
3. Set **Root Directory** to `backend`
4. Set the following:
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
5. Add environment variables:
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=10000
   ```
6. Click **Deploy**

---

## 🧱 Challenges Faced

- Configuring TanStack Router protected routes
- Deployment issues between Vercel and Render
- Managing authentication persistence across sessions
- Handling API base URLs across environments
- Debugging React hydration and route redirect loops

---

## 🔮 Future Improvements

- [ ] Expense Charts and Analytics
- [ ] Dark Mode
- [ ] Recurring Expenses
- [ ] Budget Tracking
- [ ] CSV Export
- [ ] OAuth Authentication
- [ ] Unit and Integration Testing
- [ ] Mobile App Version

---

## 👨‍💻 Author

**Shashwat Kaul**

- GitHub: [@Shashwat189](https://github.com/Shashwat189)
- Repository: [Expense Tracker](https://github.com/Shashwat189/Expense-Tracker-)

---

> Built with ❤️ using React, Node.js, and MongoDB
