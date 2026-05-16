# TaskFlow - Team Task Manager

A full-stack team task management app with a Kanban board, role-based access, and a clean dark UI.

**Stack**: React + Vite + Tailwind (frontend) · Node + Express (backend) · MongoDB (database)

---

## ✨ Features

- **Auth** — Sign up / log in with JWT. Sessions persist across refreshes.
- **Roles** — Admins have full control. Members can only update task status.
- **Projects** — Create projects, add/remove team members.
- **Kanban Board** — Drag-free columns: To Do → In Progress → Completed. Priority badges, due dates, assignees, overdue detection.
- **Dashboard** — Stats cards (total, completed, pending, overdue) + project overview.

---

## 🚀 Quick Start (Local)

### Prerequisites
- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/try/download/community) running locally (or Docker: `docker run -d -p 27017:27017 mongo`)

### 1. Clone and install
```bash
git clone <your-repo-url>
cd team-task-manager
cd backend && npm install && cd ../frontend && npm install && cd ..
```

### 2. Configure backend
Edit `backend/.env` — by default it connects to local MongoDB. Make sure MongoDB is running.

### 3. Start the app
Open **two terminals**:

```bash
# Terminal 1 — Backend API (http://localhost:5000)
cd backend && npm run dev

# Terminal 2 — Frontend dev server (http://localhost:3000)
cd frontend && npm run dev
```

Visit **http://localhost:3000**. The Vite proxy forwards `/api` requests to the backend automatically.

### 4. Make yourself admin
By default, new users get the `member` role. To make yourself admin:
1. Sign up through the app
2. Open MongoDB Compass or `mongosh`
3. Run: `db.users.updateOne({ email: "your@email.com" }, { $set: { role: "admin" } })`

---

## 🚆 Deploy to Railway (One Service)

This is the simplest deployment — one Railway service serves both the API and the frontend.

### Step 1: MongoDB Atlas
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas) and create a free account
2. Create a **free shared cluster** (takes ~3 minutes)
3. Go to **Security → Database Access** → **Add New Database User**
   - Username: anything (e.g., `taskflow`)
   - Password: save this somewhere
   - Built-in Role: **Atlas Admin**
4. Go to **Security → Network Access** → **Add IP Address**
   - Enter `0.0.0.0/0` (Allow All)
   - Click **Confirm**
5. Go to **Databases** → click **Connect** on your cluster
   - Choose **Drivers**
   - Copy the connection string (starts with `mongodb+srv://`)
   - Replace `<username>` and `<password>` with your database user's credentials

### Step 2: Push to GitHub
```bash
cd team-task-manager
git init
git add .
git commit -m "Initial commit"
# Create a repository on GitHub.com, then:
git remote add origin https://github.com/YOUR_USERNAME/team-task-manager.git
git push -u origin main
```

### Step 3: Deploy on Railway
1. Go to [Railway](https://railway.app) and sign up (free — $5 credit, no credit card)
2. Click **New Project** → **Deploy from GitHub repo**
3. Select your `team-task-manager` repo
4. Go to your service's **Variables** tab and add:

   | Variable | Value |
   |---|---|
   | `MONGO_URI` | Your MongoDB Atlas connection string |
   | `JWT_SECRET` | A random string (64+ chars) |
   | `JWT_EXPIRES_IN` | `7d` |
   | `NODE_ENV` | `production` |

5. Go to **Settings** → make sure **Root Directory** is `/` (the repo root)
6. Railway auto-deploys. Watch the logs for any errors.
7. Once deployed, click **Generate Domain** to get your public URL.

**Done!** Your app is live at `https://your-app.up.railway.app`.

### Verify it works
- Visit `https://your-app.up.railway.app/api/health` — you should see `{"status":"ok"}`
- Visit `https://your-app.up.railway.app` — you should see the login page

---

## 📁 Project Structure

```
team-task-manager/
├── backend/
│   ├── controllers/     # Route handlers (auth, projects, tasks)
│   ├── middleware/       # JWT auth + role guards
│   ├── models/          # Mongoose schemas (User, Project, Task)
│   ├── routes/          # Express route definitions
│   ├── server.js        # Entry point
│   ├── railway.json     # Railway build/deploy config
│   └── .env             # Environment variables
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI (Navbar, Modal, TaskCard, ProtectedRoute)
│   │   ├── context/     # AuthContext (JWT login/signup/logout)
│   │   ├── pages/       # Login, Signup, Dashboard, Projects, ProjectDetail
│   │   └── services/    # Axios API client
│   ├── index.html
│   ├── vite.config.js
│   └── tailwind.config.js
├── package.json         # Root scripts for Railway deployment
└── README.md
```

---

## 📡 API Reference

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/api/auth/signup` | — | — | Create account |
| POST | `/api/auth/login` | — | — | Sign in |
| GET | `/api/auth/me` | JWT | — | Current user info |
| GET | `/api/auth/users` | JWT | Admin | List all users |
| POST | `/api/projects` | JWT | Admin | Create project |
| GET | `/api/projects` | JWT | — | List projects |
| GET | `/api/projects/:id` | JWT | Member | Get project details |
| DELETE | `/api/projects/:id` | JWT | Admin | Delete project |
| POST | `/api/projects/:id/members` | JWT | Admin | Add member |
| DELETE | `/api/projects/:id/members` | JWT | Admin | Remove member |
| POST | `/api/tasks/project/:projectId` | JWT | Admin | Create task |
| GET | `/api/tasks/project/:projectId` | JWT | Member | Get project tasks |
| PUT | `/api/tasks/:id` | JWT | — | Update task |
| DELETE | `/api/tasks/:id` | JWT | Admin | Delete task |
| GET | `/api/tasks/dashboard/stats` | JWT | — | Dashboard stats |
| GET | `/api/health` | — | — | Health check |

---

## 🧪 Environment Variables

### Backend (`backend/.env`)
| Variable | Required | Default | Description |
|---|---|---|---|
| `PORT` | No | `5000` | Server port |
| `MONGO_URI` | **Yes** | — | MongoDB connection string |
| `JWT_SECRET` | **Yes** | — | Secret key for signing tokens |
| `JWT_EXPIRES_IN` | No | `7d` | Token expiration |

### Frontend (`frontend/.env`)
| Variable | Required | Default | Description |
|---|---|---|---|
| `VITE_API_URL` | No | `/api` | Backend URL (only needed if deploying separately) |

---

## ❓ Troubleshooting

**MongoDB connection fails**
- Make sure MongoDB is running: `mongosh` or check Docker
- For Atlas: check Network Access allows `0.0.0.0/0`
- For Atlas: verify username/password in connection string

**Login returns "Invalid credentials"**
- First sign up, then sign in
- Make sure MongoDB is connected (check server logs)

**Frontend shows blank page after deployment**
- Check Railway build logs for errors
- The backend serves the frontend automatically in production mode
