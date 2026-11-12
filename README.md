<div align="center">

# RecyCoin

**Play. Recycle. Earn. Trade.**

A full-stack MERN platform that gamifies e-waste sorting and turns RecyPoints into real marketplace discounts.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)

[![Live Demo](https://img.shields.io/badge/Live%20Demo-recy--coin.vercel.app-000000?style=for-the-badge&logo=vercel)](https://recy-coin.vercel.app)
[![API](https://img.shields.io/badge/API-recycoin--api.onrender.com-46E3B7?style=for-the-badge)](https://recycoin-api.onrender.com/api/health)
[![GitHub](https://img.shields.io/badge/GitHub-Nisarga9896%2FRecyCoin-181717?style=for-the-badge&logo=github)](https://github.com/Nisarga9896/RecyCoin)

</div>

---

## Live Links

| What | Link |
| --- | --- |
| **Live app** | [recy-coin.vercel.app](https://recy-coin.vercel.app) |
| Marketplace | [recy-coin.vercel.app/marketplace](https://recy-coin.vercel.app/marketplace) |
| Sorting game | [recy-coin.vercel.app/game](https://recy-coin.vercel.app/game) |
| API health | [recycoin-api.onrender.com/api/health](https://recycoin-api.onrender.com/api/health) |
| Marketplace API | [recycoin-api.onrender.com/api/items](https://recycoin-api.onrender.com/api/items) |
| Source code | [github.com/Nisarga9896/RecyCoin](https://github.com/Nisarga9896/RecyCoin) |
| Releases | [github.com/Nisarga9896/RecyCoin/releases](https://github.com/Nisarga9896/RecyCoin/releases) |

---

## Why RecyCoin?

Most people do not know what belongs in the recycle bin, the reuse pile, or the hazardous-waste drop-off. RecyCoin makes learning that skill rewarding:

1. **Play** a drag-and-drop e-waste sorting game.
2. **Earn** RecyPoints for correct decisions.
3. **Trade** used electronics and spend points as discounts on purchases.

The same account can buy, sell, track orders, manage a wishlist, and compete on the leaderboard.

---

## Feature Highlights

| Area | What it includes |
| --- | --- |
| **Marketplace** | 18 image-backed demo products, search, category/condition filters, price sorting, item details, age and defect notes |
| **Sorting game** | 10-item rounds, three bins, streaks, timers, instant feedback, saved scores |
| **RecyPoints** | +10 per correct sort, -5 per mistake, 50-point signup bonus, up to 50% checkout discount |
| **Seller tools** | Dashboard stats, create/edit/hide/delete listings, 1–4 product photos, age and defects |
| **Orders** | Checkout, point discounts, tracking timeline, packed/shipped/delivered flow, cancellation and refunds |
| **Accounts** | JWT auth, bcrypt passwords, persistent sessions, buyer dashboard, leaderboard, wishlist |

Product images are **required** for every listing. Demo photos live in `client/public/media/products/`; uploaded photos are compressed in the browser and stored with the item in MongoDB.

---

## Tech Stack

| Layer | Stack |
| --- | --- |
| Frontend | React 18, Vite 5, React Router 6, Tailwind CSS 4, Framer Motion, Lucide |
| Backend | Node.js, Express 4, Mongoose 8, JWT, bcryptjs |
| Database | MongoDB (embedded locally, MongoDB Atlas in production) |

---

## Architecture

```text
React + Vite (Vercel)
        |
        |  /api requests
        v
Express REST API (Render)
        |
        v
MongoDB Atlas
```

The frontend never connects to MongoDB directly. All reads and writes go through the Express API.

---

## Quick Start

### Prerequisites

- Node.js 18+
- npm

### 1. Backend

```powershell
cd server
npm install
Copy-Item .env.example .env
npm run seed
npm run dev
```

The API runs at `http://localhost:5000`. Health check:

```powershell
curl http://localhost:5000/api/health
```

### 2. Frontend

Open a second terminal:

```powershell
cd client
npm install
npm run dev
```

Open `http://localhost:5173`.

> Stop the backend before running `npm run seed` or `npm run reset` because the local embedded MongoDB uses port 27017.

### Useful scripts

| Command | Location | Purpose |
| --- | --- | --- |
| `npm run dev` | `server/` | Start API with auto-restart |
| `npm start` | `server/` | Start API without watching |
| `npm run seed` | `server/` | Seed users and marketplace items |
| `npm run reset` | `server/` | Wipe and reseed the database |
| `npm run add-items` | `server/` | Backfill missing demo items |
| `npm run dev` | `client/` | Start Vite dev server |
| `npm run build` | `client/` | Production build |

---

## Demo Accounts

| Role | Email | Password | Points |
| --- | --- | --- | --- |
| Buyer | `demo@recycoin.com` | `Demo@123` | 250 |
| Seller | `bob@recycoin.com` | `Demo@123` | 120 |

The marketplace is public. Logged-out visitors can browse every item; clicking **Buy now** opens the login/sign-up prompt.

---

## Environment Variables

Copy `server/.env.example` to `server/.env`.

| Variable | Recommended local value | Notes |
| --- | --- | --- |
| `PORT` | `5000` | Render supplies this automatically in production |
| `DB_MODE` | `memory` | Use `uri` for production |
| `DB_PATH` | `./.data/mongodb` | Local embedded database folder |
| `MONGODB_URI` | `mongodb://127.0.0.1:27017/ewaste` | Atlas URI in production |
| `JWT_SECRET` | random long string | Change before deploying |
| `CLIENT_ORIGIN` | `http://localhost:5173` | Frontend URL allowed by CORS; use `https://recy-coin.vercel.app` in production |

Frontend production API URL:

```env
VITE_API_URL=https://recycoin-api.onrender.com/api
```

---

## Deploy: Vercel + Render + MongoDB Atlas

Neither Vercel nor Render provides MongoDB. Use **MongoDB Atlas** for the database, **Render** for the Express API, and **Vercel** for the React frontend.

Current deployment:

- Frontend: [https://recy-coin.vercel.app](https://recy-coin.vercel.app)
- Backend: [https://recycoin-api.onrender.com](https://recycoin-api.onrender.com)
- Health check: [https://recycoin-api.onrender.com/api/health](https://recycoin-api.onrender.com/api/health)
- Database: MongoDB Atlas cluster `ewaste-cluster` (`ewaste` database)

### 1. MongoDB Atlas

1. Create a free Atlas cluster.
2. Create a database user.
3. Allow network access (use `0.0.0.0/0` for the demo).
4. Copy the connection string:
   ```text
   mongodb+srv://<user>:<password>@<cluster>/ewaste
   ```

Seed Atlas from your machine:

```powershell
cd server
$env:DB_MODE="uri"
$env:MONGODB_URI="<your-atlas-uri>"
npm run reset
```

This creates the 18 marketplace items and demo accounts in Atlas. `reset` starts with an empty orders collection, so the sample order is not created.

### 2. Render — backend

- New **Web Service** from the GitHub repo.
- Root directory: `server`
- Build command: `npm install`
- Start command: `npm start`
- Environment variables:

```env
DB_MODE=uri
MONGODB_URI=<your-atlas-uri>
JWT_SECRET=<long-random-secret>
CLIENT_ORIGIN=https://recy-coin.vercel.app
```

Do not set `PORT`; Render provides it.

### 3. Vercel — frontend

- Import the same GitHub repo.
- Root directory: `client`
- Framework preset: **Vite**
- Build command: `npm run build`
- Output directory: `dist`
- Environment variable:

```env
VITE_API_URL=https://<your-render-service>.onrender.com/api
```

After Vercel gives you the live URL, update Render's `CLIENT_ORIGIN` to that URL and redeploy the backend.

---

## API Overview

| Area | Endpoints |
| --- | --- |
| Health | `GET /api/health` |
| Auth | `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me` |
| Wishlist | `GET /api/auth/wishlist`, `POST/DELETE /api/auth/wishlist/:itemId` |
| Items | `GET /api/items`, `GET /api/items/:id`, `POST/PATCH/DELETE /api/items/:id` |
| Orders | `POST /api/orders`, `GET /api/orders`, `PATCH /api/orders/:id/status` |
| Game | `GET /api/game/config`, `GET /api/game/leaderboard`, `POST /api/game/result` |
| Seller | `GET /api/seller/stats`, `GET /api/seller/items`, `GET /api/seller/orders` |

Protected routes use:

```http
Authorization: Bearer <jwt>
```

---

## Project Structure

```text
RecyCoin/
├── client/
│   ├── public/media/products/   # Demo product images
│   └── src/
│       ├── components/          # Shared UI
│       ├── context/             # Auth state
│       ├── pages/               # Marketplace, game, seller, orders
│       └── utils/               # Image helpers
└── server/
    ├── data/                    # Demo items and game data
    ├── middleware/              # JWT protection
    ├── models/                  # User, Item, Order
    ├── routes/                  # REST API
    ├── seed.js                  # Database seeding
    └── server.js                # Express entry point
```

---

## Production Notes

- Use MongoDB Atlas instead of the embedded local database.
- Set a strong, unique `JWT_SECRET`.
- Keep `CLIENT_ORIGIN` in sync with the deployed frontend URL.
- Product images must contain at least one entry; the API rejects empty image lists.
- Render free services sleep after inactivity, so the first request may be slow.
- No payment gateway is integrated; checkout records an order and applies RecyPoints discounts only.

---

## License

No license file is included. Add one before redistributing or reusing the project publicly.
