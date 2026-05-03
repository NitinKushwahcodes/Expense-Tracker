# Expense Tracker
 
A personal finance app where users can register, log in, and track their daily expenses across categories like Food, Transport, Shopping, and more. Each user sees only their own data — ownership is enforced on every API call. The dashboard gives a real-time view of total spending, this month's expenses, and a category-wise breakdown chart. Built with a focus on auth security: JWT is stored in an httpOnly cookie (not localStorage), and passwords are validated on both frontend and backend independently.
 
**Live Demo:** https://expense-tracker-gules-zeta-58.vercel.app

## Tech Stack

- **Frontend** — React, Vite, Tailwind CSS, Recharts
- **Backend** — Node.js, Express
- **Database** — MongoDB Atlas
- **Auth** — JWT in httpOnly cookies
- **Deployed on** — Vercel (frontend), Render (backend)

## Features

- JWT authentication stored in httpOnly cookies (XSS-safe)
- Per-user data isolation with ownership checks on every mutation
- Add, edit, delete expenses with category tagging
- Dashboard with summary cards and category-wise pie chart
- Monthly filtering and pagination
- Real-time password strength meter on registration
- Full error handling for network failures and invalid credentials

## Local Setup

**Requirements:** Node.js 18+, MongoDB Atlas account

```bash
git clone https://github.com/YOUR_USERNAME/expense-tracker.git
cd expense-tracker
```

**Backend**

```bash
cd backend
cp .env.example .env
# fill in MONGO_URI, JWT_SECRET, FRONTEND_URL, PORT
npm install
node server.js
# runs on http://localhost:5000
```

**Frontend**

```bash
cd frontend
cp .env.example .env
# set VITE_API_URL=http://localhost:5000
npm install
npm run dev
# runs on http://localhost:5173
```

## Environment Variables

**backend/.env**

| Variable | Description |
|---|---|
| `PORT` | Server port (default 5000) |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for signing JWT (min 32 chars) |
| `FRONTEND_URL` | Frontend origin for CORS (no trailing slash) |
| `NODE_ENV` | `development` or `production` |

**frontend/.env**

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend base URL (no path, no trailing slash) |

## API Reference

All responses: `{ success: true, data: {} }` or `{ success: false, error: "message" }`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /api/auth/register | — | Create account |
| POST | /api/auth/login | — | Login, sets cookie |
| POST | /api/auth/logout | — | Clear cookie |
| GET | /api/auth/me | ✓ | Get current user |
| POST | /api/expenses | ✓ | Create expense |
| GET | /api/expenses | ✓ | List expenses — `?category=Food&month=2025-05&page=1` |
| GET | /api/expenses/summary | ✓ | Totals, by-category, recent 5 |
| PUT | /api/expenses/:id | ✓ | Update expense |
| DELETE | /api/expenses/:id | ✓ | Delete expense |

## Postman Testing

Import `ExpenseTracker.postman_collection.json`. Set `base_url = http://localhost:5000`.

Enable **Send cookies** in Postman collection settings before running tests.

17 test cases covering registration, login, auth errors, CRUD operations, ownership enforcement, and session expiry — run them in order.

## Security

- Passwords hashed with bcrypt (salt rounds: 12)
- JWT stored in httpOnly, Secure, SameSite=None cookie — never in localStorage
- All expense routes verify `expense.userId === req.user.id`
- Auth routes rate-limited to 10 requests per 15 minutes
- CORS restricted to frontend origin only
