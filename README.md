# Expense Tracker

A full-stack personal expense tracker with JWT-based authentication, per-user data isolation, category analytics, and a clean dashboard.

**Live Demo**

- Frontend: https://your-app.vercel.app
- Backend API: https://your-backend.onrender.com

---

## Tech Stack

| Layer      | Tech                                 |
| ---------- | ------------------------------------ |
| Frontend   | React + Vite, Tailwind CSS, Recharts |
| Backend    | Node.js, Express                     |
| Database   | MongoDB Atlas + Mongoose             |
| Auth       | JWT stored in httpOnly cookies       |
| Deployment | Vercel (frontend) · Render (backend) |

---

## Features

- Secure registration and login with JWT in httpOnly cookies
- Real-time password strength meter with requirement checklist
- Username suggestions as you type
- Add, edit, delete personal expenses
- Category-wise spending breakdown with pie chart
- Monthly filtering, pagination, and summary cards
- Full error handling — network errors, wrong credentials, server down
- Ownership check on every expense mutation

---

## Local Setup

**Prerequisites:** Node.js 18+, MongoDB Atlas account (free tier works)

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/expense-tracker.git
cd expense-tracker
```

### 2. Backend

```bash
cd backend
cp .env.example .env
```

Fill in `.env`:

```
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key_min_32_chars
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

```bash
npm install
node server.js
```

Backend runs on `http://localhost:5000`

### 3. Frontend

Open a new terminal:

```bash
cd frontend
cp .env.example .env
```

Fill in `.env`:

```
VITE_API_URL=http://localhost:5000
```

```bash
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

---

## API Reference

All responses follow: `{ success: true, data: {...} }` or `{ success: false, error: "message" }`

| Method | Route                 | Auth | Description                             |
| ------ | --------------------- | ---- | --------------------------------------- |
| POST   | /api/auth/register    | —    | Register new user                       |
| POST   | /api/auth/login       | —    | Login, sets httpOnly cookie             |
| POST   | /api/auth/logout      | —    | Clears cookie                           |
| GET    | /api/auth/me          | ✓    | Get current session user                |
| POST   | /api/expenses         | ✓    | Create expense                          |
| GET    | /api/expenses         | ✓    | List expenses (paginated, filterable)   |
| GET    | /api/expenses/summary | ✓    | Totals, by-category breakdown, recent 5 |
| PUT    | /api/expenses/:id     | ✓    | Update expense (ownership verified)     |
| DELETE | /api/expenses/:id     | ✓    | Delete expense (ownership verified)     |

### Error Responses

| Scenario               | Status | Message                                   |
| ---------------------- | ------ | ----------------------------------------- |
| Duplicate email        | 409    | An account with this email already exists |
| Duplicate username     | 409    | This username is already taken            |
| Wrong email            | 401    | No account found with this email          |
| Wrong password         | 401    | Incorrect password                        |
| Expired/missing token  | 401    | Session expired, please log in again      |
| Wrong owner on expense | 403    | You don't have permission to do that      |

---

## Postman Testing

Import `ExpenseTracker.postman_collection.json` into Postman.

Set collection variable: `base_url = http://localhost:5000`

**Important:** Postman → Collection Settings → enable **"Send cookies"** so the httpOnly JWT cookie works across requests.

Run all 17 test cases in order:

| #   | Request                                          | Expected                     |
| --- | ------------------------------------------------ | ---------------------------- |
| 1   | Register — success                               | 201, user object, cookie set |
| 2   | Register — duplicate email                       | 409                          |
| 3   | Register — weak password                         | 400                          |
| 4   | Login — wrong email                              | 401                          |
| 5   | Login — wrong password                           | 401                          |
| 6   | Login — success                                  | 200, cookie refreshed        |
| 7   | GET /auth/me                                     | 200, current user            |
| 8   | Add expense (Food)                               | 201                          |
| 9   | Add expense (Transport + Shopping)               | 201                          |
| 10  | GET /expenses                                    | 200, paginated               |
| 11  | GET /expenses/summary                            | 200, totals + byCategory     |
| 12  | GET /expenses?category=Food                      | 200, filtered                |
| 13  | PUT /expenses/:id                                | 200, updated                 |
| 14  | DELETE /expenses/:id                             | 200                          |
| 15  | Second user tries to delete first user's expense | 403                          |
| 16  | Logout                                           | 200, cookie cleared          |
| 17  | GET /auth/me after logout                        | 401                          |

---

## Deployment

### Step 1 — MongoDB Atlas

1. Go to [atlas.mongodb.com](https://atlas.mongodb.com) → create free account
2. Create a cluster — free **M0** tier
3. **Database Access** → Add database user (set username + password)
4. **Network Access** → Add IP → **Allow from anywhere** (`0.0.0.0/0`)
5. **Connect** → Drivers → copy the connection string
   - Replace `<password>` with your DB user's password
   - Add `/expensetracker` before the `?`

```
mongodb+srv://user:password@cluster.mongodb.net/expensetracker?retryWrites=true&w=majority
```

---

### Step 2 — Push to GitHub

```bash
# Run from project root: expense-tracker/
git init
git add .
git commit -m "initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/expense-tracker.git
git push -u origin main
```

If you already initialized git, skip `git init` and just do `git add . && git commit && git push`.

---

### Step 3 — Deploy Backend on Render

1. [render.com](https://render.com) → **New** → **Web Service**
2. Connect GitHub → select `expense-tracker` repo
3. Settings:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
4. Environment variables:

| Key            | Value                                   |
| -------------- | --------------------------------------- |
| `MONGO_URI`    | your Atlas connection string            |
| `JWT_SECRET`   | generate with `openssl rand -base64 32` |
| `FRONTEND_URL` | leave blank for now                     |
| `NODE_ENV`     | `production`                            |

5. Click **Deploy** → wait for green checkmark
6. Copy your Render URL: `https://expense-tracker-xxx.onrender.com`

---

### Step 4 — Deploy Frontend on Vercel

1. [vercel.com](https://vercel.com) → **New Project** → Import your GitHub repo
2. Settings:
   - **Root Directory:** `frontend`
   - **Framework Preset:** Vite (auto-detected)
3. Environment variable:

| Key            | Value                                      |
| -------------- | ------------------------------------------ |
| `VITE_API_URL` | `https://expense-tracker-xxx.onrender.com` |

4. Click **Deploy**
5. Copy your Vercel URL: `https://expense-tracker-xxx.vercel.app`

---

### Step 5 — Connect Frontend URL to Backend

1. Render dashboard → your backend service → **Environment**
2. Set `FRONTEND_URL` = `https://expense-tracker-xxx.vercel.app` (exact, no trailing slash)
3. **Manual Deploy** → **Deploy latest commit**

This step is critical — without it, CORS will block all requests from your frontend.

---

### Step 6 — Verify

1. Open Vercel URL → register a new account
2. Add 3–4 expenses across different categories
3. Confirm summary cards and pie chart populate correctly
4. In Postman, update `base_url` to your Render URL and re-run all 17 tests

---

## Design Decisions

**JWT in httpOnly cookies** — Tokens are never accessible to JavaScript, which prevents XSS attacks from stealing credentials. `SameSite=None + Secure` is required for cross-domain cookie flow between Vercel and Render — without both flags, the browser blocks the cookie entirely.

**Dual validation** — Input is validated on both frontend and backend independently. The frontend check improves UX (instant feedback); the backend check is the actual security boundary and cannot be bypassed.

**Ownership checks** — Every PUT and DELETE verifies `expense.userId === req.user.id`. A valid token from user A cannot modify user B's data, even if user A knows user B's expense ID.

**Bcrypt salt rounds: 12** — More resistant to brute-force than the default 10. Slightly slower on register/login, no impact on normal usage.

**Centralized error handler** — All async errors bubble to `errorHandler.js` middleware via `next(err)`. No scattered `res.status(500)` calls across controllers.
