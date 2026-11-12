# RecyCoin

RecyCoin is a full-stack MERN application that gamifies electronic-waste (e-waste) sorting and connects it to a second-hand electronics marketplace. Users learn how to dispose of e-waste correctly by playing a drag-and-drop sorting game, earn RecyPoints for correct decisions, and spend those points as discounts when buying or selling used electronics.

The project is split into two independent applications:

- `server/` - Express REST API with MongoDB, JWT authentication, and game/marketplace logic
- `client/` - React single-page application built with Vite and Tailwind CSS

---

## Table of Contents

1. [Overview](#overview)
2. [Key Features](#key-features)
3. [Tech Stack](#tech-stack)
4. [Architecture](#architecture)
5. [Project Structure](#project-structure)
6. [Getting Started](#getting-started)
7. [Environment Variables](#environment-variables)
8. [How the Platform Works](#how-the-platform-works)
9. [Demo Accounts](#demo-accounts)
10. [API Reference](#api-reference)
11. [Data Models](#data-models)
12. [Frontend Routes](#frontend-routes)
13. [Available Scripts](#available-scripts)
14. [Database Notes](#database-notes)
15. [Building and Deployment](#building-and-deployment)
16. [Troubleshooting](#troubleshooting)
17. [Known Limitations](#known-limitations)
18. [Contributing](#contributing)
19. [License](#license)

---

## Overview

Improper e-waste disposal is a major environmental problem. RecyCoin addresses it with a simple loop:

1. **Learn** - Play a sorting game that teaches the difference between Recycle, Reuse, and Hazardous e-waste.
2. **Earn** - Correct sorts award RecyPoints. Wrong sorts provide feedback and cost points.
3. **Trade** - Use RecyPoints as up to 50% of a marketplace purchase, or list used electronics as a seller and earn a 5% points bonus when they sell.

The application includes buyer and seller experiences in one account, a leaderboard, wishlists, order tracking, and a seller dashboard.

---

## Key Features

### Gamified sorting game

- 10-item rounds drawn randomly from a catalogue of 24 e-waste items.
- Three bins: **Recycle**, **Reuse**, **Hazardous**.
- Drag-and-drop or click/tap to sort.
- Instant visual and audio feedback for every answer.
- Streak counter, round timer, score HUD, and accuracy summary.
- Points are saved to the logged-in user's account after each round.

### Marketplace

- Browse available second-hand electronics.
- Search by name, description, or category.
- Filter by category and condition.
- Sort by newest, price ascending, price descending, or name.
- View item photos, description, age, defects, seller information, and condition badges.
- Add items to a personal wishlist.
- Buy items with optional RecyPoints discounts.

### RecyPoints economy

- New accounts start with 50 free RecyPoints.
- Correct sort: +10 points.
- Wrong sort: -5 points (the round score cannot drop below zero).
- Seller bonus: 5% of an item's listed price in points when an order is placed.
- Discount cap: up to 50% of the item price, limited by the buyer's available balance.
- Points are refunded if an order is cancelled before delivery.

### Seller tools

- Every account is created as a seller by default (`isSeller: true`).
- Seller dashboard with listed, available, sold, revenue, pending-order, and order-count statistics.
- Create, edit, hide, and delete product listings, including 1–4 uploaded photos, age, and defect notes.
- View incoming orders and advance them through the delivery flow.

### Orders and tracking

- Order lifecycle: `placed` -> `packed` -> `shipped` -> `delivered`.
- Orders can be cancelled by the seller before delivery; the item becomes available again and the buyer's discount points are refunded.
- Activity timeline with timestamps for every status change.
- Buyers and sellers can both view an order they are part of.

### Accounts and personalisation

- JWT-based authentication with bcrypt password hashing.
- Persistent login via `localStorage`.
- Buyer dashboard with level progression based on lifetime points earned.
- Global leaderboard of top recyclers.
- Wishlist management.

### User experience

- Responsive layout for desktop and mobile.
- Framer Motion page transitions and micro-interactions.
- Animated particle and canvas backgrounds.
- Toast notifications and confirmation modals.
- Custom audio effects generated with the Web Audio API (no audio files required).

---

## Tech Stack

### Frontend

| Technology | Purpose |
| --- | --- |
| React 18 | UI component library |
| Vite 5 | Development server and build tool |
| Tailwind CSS 4 | Utility-first styling via `@tailwindcss/vite` |
| React Router 6 | Client-side routing |
| Framer Motion 11 | Animations and transitions |
| Lucide React | Icon set |
| Web Audio API | Game sound effects |

### Backend

| Technology | Purpose |
| --- | --- |
| Node.js | JavaScript runtime |
| Express 4 | HTTP server and routing |
| Mongoose 8 | MongoDB object modelling |
| MongoDB | Primary data store |
| mongodb-memory-server | Zero-config embedded MongoDB for development |
| JSON Web Token | Authentication tokens (7-day expiry) |
| bcryptjs | Password hashing |
| CORS | Cross-origin configuration |
| dotenv | Environment variable loading |

### Tooling

| Tool | Purpose |
| --- | --- |
| Vite proxy | Forwards `/api` requests from port 5173 to port 5000 |
| Node `--watch` | Backend auto-restart during development |

There is no TypeScript, test runner, or ESLint configuration in this repository.

---

## Architecture

```text
+------------------------------+
|        React Client          |
|  Vite dev server :5173       |
|                              |
|  React Router + AuthContext  |
|  Marketplace + Game + Orders |
+--------------+---------------+
               |
               | /api (Vite proxy in development)
               v
+------------------------------+
|       Express API :5000      |
|                              |
|  /api/auth     /api/items    |
|  /api/orders   /api/game     |
|  /api/seller                 |
|                              |
|  JWT middleware + Mongoose   |
+--------------+---------------+
               |
               v
+------------------------------+
|           MongoDB            |
|  embedded (default) or URI   |
+------------------------------+
```

The client never talks to MongoDB directly. All reads and writes go through the Express API. In development, Vite proxies `/api` to `http://localhost:5000`, so the browser only needs to reach port 5173.

---

## Project Structure

```text
RecyCoin/
|
|-- client/
|   |-- index.html
|   |-- package.json
|   |-- vite.config.js
|   |-- public/
|   |   `-- recycoin-icon.svg
|   `-- src/
|       |-- api.js                  # fetch wrapper and API helpers
|       |-- App.jsx                 # router and page layout
|       |-- index.css               # Tailwind import and global styles
|       |-- main.jsx                # React entry point
|       |-- sounds.js               # Web Audio sound effects
|       |-- components/
|       |   |-- AuthShell.jsx
|       |   |-- Footer.jsx
|       |   |-- HeroCanvas.jsx
|       |   |-- ItemCard.jsx
|       |   |-- Leaderboard.jsx
|       |   |-- MiniSort.jsx
|       |   |-- Navbar.jsx
|       |   |-- PageWrapper.jsx
|       |   |-- Particles.jsx
|       |   |-- ProtectedRoute.jsx
|       |   |-- Toast.jsx
|       |   `-- Ui.jsx              # shared UI primitives
|       |-- context/
|       |   `-- AuthContext.jsx
|       `-- pages/
|           |-- About.jsx
|           |-- Dashboard.jsx
|           |-- Game.jsx
|           |-- Home.jsx
|           |-- ItemDetail.jsx
|           |-- Login.jsx
|           |-- ManageProducts.jsx
|           |-- Marketplace.jsx
|           |-- OrderTracking.jsx
|           |-- Orders.jsx
|           |-- Register.jsx
|           |-- Sales.jsx
|           |-- SellerDashboard.jsx
|           `-- Wishlist.jsx
|
`-- server/
    |-- .env.example
    |-- db.js                       # MongoDB connection (embedded or URI)
    |-- package.json
    |-- seed.js                     # demo data seeder
    |-- server.js                   # Express app entry point
    |-- data/
    |   `-- gameData.js             # bins, game items, categories
    |-- middleware/
    |   `-- auth.js                 # JWT protect middleware
    |-- models/
    |   |-- Item.js
    |   |-- Order.js
    |   `-- User.js
    `-- routes/
        |-- auth.js
        |-- game.js
        |-- items.js
        |-- orders.js
        `-- seller.js
```

Generated or local-only directories such as `node_modules/`, `client/dist/`, and `server/.data/` are not part of the source code.

---

## Getting Started

### Prerequisites

- **Node.js 18 or newer** (Node 20 LTS recommended)
- **npm** (bundled with Node.js)
- No local MongoDB installation is required for the default development setup because the server can run an embedded MongoDB instance.

### 1. Install backend dependencies

```bash
cd server
npm install
```

### 2. Create the environment file

Copy the example file and adjust values if needed:

```bash
# Windows PowerShell
Copy-Item .env.example .env

# macOS / Linux
cp .env.example .env
```

The default `.env.example` already works for local development:

```env
PORT=5000
DB_MODE=memory
DB_PATH=./.data/mongodb
MONGODB_URI=mongodb://127.0.0.1:27017/ewaste
JWT_SECRET=recycoin_super_secret_change_me
CLIENT_ORIGIN=http://localhost:5173
```

Change `JWT_SECRET` to a strong random value for anything beyond local development.

### 3. Seed demo data (optional but recommended)

Stop the backend before seeding if it is already running, because the embedded database uses port 27017.

```bash
cd server
npm run seed
```

This creates:

- 18 marketplace items across multiple categories
- Buyer account: `demo@recycoin.com` / `Demo@123`
- Seller account: `bob@recycoin.com` / `Demo@123`
- A sample delivered order

To wipe users, items, and orders and reseed from scratch:

```bash
npm run reset
```

Warning: `npm run reset` deletes all existing data in the configured database.

The first embedded MongoDB startup may download a MongoDB binary into `server/.data/mongodb-bin/`. This can take a few minutes depending on your network.

### 4. Start the backend

```bash
cd server
npm run dev
```

The API runs at `http://localhost:5000`. You can verify it with:

```bash
curl http://localhost:5000/api/health
```

Expected response:

```json
{ "status": "ok", "service": "recycoin-api" }
```

For a non-watching production-style start:

```bash
npm start
```

### 5. Install and start the frontend

Open a second terminal:

```bash
cd client
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

The Vite development server proxies any request starting with `/api` to `http://localhost:5000`, so both services must be running.

### Quick start summary

```bash
# Terminal 1
cd server
npm install
copy .env.example .env
npm run seed
npm run dev

# Terminal 2
cd client
npm install
npm run dev
```

---

## Environment Variables

All backend variables are read from `server/.env`.

| Variable | Default | Description |
| --- | --- | --- |
| `PORT` | `5000` | Port the Express API listens on |
| `DB_MODE` | `memory` | `memory` starts an embedded MongoDB; `uri` connects to `MONGODB_URI` |
| `DB_PATH` | `./.data/mongodb` | Directory used to persist the embedded database |
| `MONGODB_URI` | `mongodb://127.0.0.1:27017/ewaste` | Connection string used when `DB_MODE=uri` |
| `JWT_SECRET` | `recycoin_super_secret_change_me` | Secret used to sign and verify JWTs |
| `CLIENT_ORIGIN` | `http://localhost:5173` | Allowed CORS origin for the frontend |

The frontend has no `.env` file. It always calls the relative `/api` path, which is proxied by Vite in development and must be reverse-proxied in production.

---

## How the Platform Works

### The sorting game

Each round:

1. The client requests game configuration from `GET /api/game/config`.
2. Ten items are randomly selected from the item pool.
3. The player sorts each item into Recycle, Reuse, or Hazardous.
4. Correct answers award `+10`; wrong answers subtract `5`.
5. A wrong answer also shows the correct bin and an educational hint.
6. At the end of the round, a logged-in player can save the result.

Official game items live in `server/data/gameData.js`. The client also contains fallback data so the game can render if the API is unavailable.

Saving a round:

- `POST /api/game/result` accepts `{ score }`.
- The server adds the score to `points`, adds positive scores to `totalEarned`, increments `roundsPlayed`, and updates `bestScore`.
- Negative round scores reduce points but do not reduce lifetime `totalEarned`.

### Points economy

| Action | Effect |
| --- | --- |
| Create an account | +50 RecyPoints |
| Correct sort | +10 to round score |
| Wrong sort | -5 to round score (minimum 0 per round score) |
| Seller completes a listing sale | +5% of the listed price in points |
| Buyer redeems points | Points deducted and applied as a discount |
| Buyer redeems points | Maximum discount is 50% of item price |
| Seller cancels an order | Buyer's redeemed points are refunded |

### Buyer dashboard levels

Levels are based on `totalEarned`:

| Level | Points earned | Emoji indicator |
| --- | --- | --- |
| Eco Seedling | 0 - 249 | seedling |
| Green Sprout | 250 - 699 | sprout |
| Waste Warrior | 700 - 1399 | recycling symbol |
| Circular Champion | 1400+ | star |

The global leaderboard ranks users by `totalEarned`, then by current `points`, and returns the top 10.

### Marketplace and checkout

1. A seller creates an item with name, description, category, condition, price, at least one photo, age, and defects.
2. The item appears in the marketplace with `status: "available"`.
3. A buyer opens the item and optionally enters a point discount.
4. On checkout, the server validates that:
   - the item exists;
   - the item is still available;
   - the buyer is not the seller;
   - the discount does not exceed the buyer's points or 50% of the price.
5. The item becomes `sold`, the buyer's points are reduced, the seller receives a 5% points bonus, and an order is created.

### Order lifecycle

```text
placed -> packed -> shipped -> delivered
   |
   `-> cancelled (before delivery)
```

- Only the seller can change an order's status.
- Cancelling relists the item and refunds any redeemed points.
- Delivered orders cannot be cancelled.
- Every status change appends an entry to the order's `tracking` timeline.

### Seller workflow

1. Open the seller dashboard at `/seller`.
2. Add or edit products at `/seller/products`.
3. When a buyer purchases an item, it appears at `/seller/sales`.
4. Advance the order through packed, shipped, and delivered.
5. Revenue shown in the dashboard is the sum of `finalPrice` for all non-cancelled orders.

---

## Demo Accounts

After running `npm run seed`, the following accounts are available:

| Role | Email | Password | Starting points |
| --- | --- | --- | --- |
| Buyer | `demo@recycoin.com` | `Demo@123` | 250 |
| Seller | `bob@recycoin.com` | `Demo@123` | 120 |

Both accounts have `isSeller: true`, which is the default for all new users. The login page redirects sellers to `/seller` and non-sellers to `/dashboard`, but every new account currently defaults to the seller route.

---

## API Reference

Base URL: `http://localhost:5000/api`

Authentication uses a bearer token:

```http
Authorization: Bearer <jwt>
```

Tokens are issued by register/login and expire after 7 days.

### Health

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| GET | `/health` | No | Service health check |

### Authentication and wishlist

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| POST | `/auth/register` | No | Create an account. Body: `name`, `email`, `password` |
| POST | `/auth/login` | No | Log in. Body: `email`, `password` |
| GET | `/auth/me` | Yes | Get the current user with populated wishlist |
| GET | `/auth/wishlist` | Yes | Get the current user's wishlist items |
| POST | `/auth/wishlist/:itemId` | Yes | Toggle an item in the wishlist |
| DELETE | `/auth/wishlist/:itemId` | Yes | Remove an item from the wishlist |

Register returns:

```json
{
  "token": "<jwt>",
  "user": { "id": "...", "name": "...", "points": 50, "...": "..." }
}
```

### Marketplace items

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| GET | `/items` | No | List items with optional query filters |
| GET | `/items/:id` | No | Get a single item with seller details |
| POST | `/items` | Yes | Create a listing |
| PATCH | `/items/:id` | Yes | Update a listing (owner only) |
| DELETE | `/items/:id` | Yes | Delete a listing (owner only) |

`GET /items` query parameters:

| Parameter | Description |
| --- | --- |
| `q` | Case-insensitive search across name, description, and category |
| `category` | Filter by category, or `all` |
| `condition` | Filter by condition, or `all` |
| `sort` | `newest`, `priceLow`, `priceHigh`, or `name` |
| `minPrice` | Minimum price |
| `maxPrice` | Maximum price |
| `status` | Defaults to `available`; use `all` to include sold items |
| `includeHidden` | Set to `true` to include hidden items when `status=all` |

Create/update body fields:

```json
{
  "name": "iPhone 11 - 64GB",
  "description": "Battery health 86%, Face ID works.",
  "category": "Mobile Phones",
  "condition": "Good",
  "price": 14999,
  "images": ["data:image/jpeg;base64,..."],
  "age": "2 years",
  "defects": "Minor scratch on the frame"
}
```

`images` is required and must contain at least one string, up to four. Entries can be data URLs, absolute URLs, or client-served paths. Uploaded photos are compressed in the browser before being stored with the item in MongoDB.

Allowed update fields: `name`, `description`, `category`, `condition`, `price`, `images`, `age`, `defects`, and `status`. Updating `images` to an empty list is rejected.

### Orders

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| POST | `/orders` | Yes | Place an order. Body: `itemId`, optional `discountPoints` |
| GET | `/orders` | Yes | List the current user's purchases |
| GET | `/orders/:id` | Yes | Get an order (buyer or seller only) |
| PATCH | `/orders/:id/status` | Yes | Update status (seller only) |

Valid statuses: `placed`, `packed`, `shipped`, `delivered`, `cancelled`.

### Game and leaderboard

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| GET | `/game/config` | No | Get bins and game item catalogue |
| GET | `/game/leaderboard` | No | Top 10 users by lifetime earnings |
| POST | `/game/result` | Yes | Save a finished round. Body: `{ "score": 70 }` |

### Seller

All seller endpoints require authentication.

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/seller/stats` | Listing, availability, sales, revenue, and pending-order counts |
| GET | `/seller/items` | All items owned by the current user |
| GET | `/seller/orders` | All orders where the current user is the seller |

---

## Data Models

### User

| Field | Type | Notes |
| --- | --- | --- |
| `name` | String | Required |
| `email` | String | Required, unique, lowercase |
| `password` | String | bcrypt hash; minimum 6 characters |
| `points` | Number | Current RecyPoints balance, minimum 0 |
| `totalEarned` | Number | Lifetime points earned |
| `totalSpent` | Number | Lifetime discount points spent |
| `roundsPlayed` | Number | Number of saved game rounds |
| `bestScore` | Number | Best absolute round score |
| `avatarColor` | String | Hex colour used by the avatar component |
| `isSeller` | Boolean | Defaults to `true` |
| `wishlist` | ObjectId[] | References to `Item` documents |
| `createdAt`, `updatedAt` | Date | Automatic timestamps |

Passwords are never returned by the API. The `toSafe()` instance method strips them.

### Item

| Field | Type | Notes |
| --- | --- | --- |
| `name` | String | Required |
| `description` | String | Required |
| `category` | String | Required |
| `condition` | String | `Refurbished`, `Good`, `Fair`, or `Spare Parts` |
| `price` | Number | Required, minimum 0 |
| `emoji` | String | Visual identifier for the listing |
| `images` | String[] | Required, 1–4 product photos (data URLs, URLs, or paths) |
| `age` | String | Approximate age / usage history of the item |
| `defects` | String | Known defects or cosmetic issues |
| `seller` | ObjectId | Reference to `User` |
| `status` | String | `available`, `sold`, or `hidden` |
| `createdAt`, `updatedAt` | Date | Automatic timestamps |

A text index exists on `name`, `description`, and `category`.

### Order

| Field | Type | Notes |
| --- | --- | --- |
| `buyer` | ObjectId | Reference to `User` |
| `seller` | ObjectId | Reference to `User` |
| `item` | ObjectId | Reference to `Item` |
| `itemName`, `itemEmoji`, `itemImage`, `itemCategory` | String | Snapshots of item data at purchase time |
| `price` | Number | Original listed price |
| `discountPoints` | Number | Points redeemed |
| `finalPrice` | Number | Price after discount |
| `tracking` | Array | `{ label, detail, at }` timeline entries |
| `status` | String | `placed`, `packed`, `shipped`, `delivered`, or `cancelled` |
| `createdAt`, `updatedAt` | Date | Automatic timestamps |

---

## Frontend Routes

| Route | Component | Protected | Description |
| --- | --- | --- | --- |
| `/` | `Home` | No | Landing page, playable game preview, impact stats |
| `/login` | `Login` | No | Login form and demo credentials |
| `/register` | `Register` | No | Account registration with 50-point bonus |
| `/game` | `Game` | No | Full sorting game and leaderboard; saving requires login |
| `/marketplace` | `Marketplace` | No | Searchable, filterable item grid |
| `/items/:id` | `ItemDetail` | No | Item detail, wishlist toggle, and checkout |
| `/about` | `About` | No | Mission, values, and technology overview |
| `/dashboard` | `Dashboard` | Yes | Buyer stats, level progress, recent orders |
| `/orders` | `Orders` | Yes | Purchase history |
| `/orders/:id` | `OrderTracking` | Yes | Tracking timeline for a specific order |
| `/wishlist` | `Wishlist` | Yes | Saved items |
| `/seller` | `SellerDashboard` | Yes | Seller statistics and recent sales |
| `/seller/products` | `ManageProducts` | Yes | Create, edit, hide, and delete listings |
| `/seller/sales` | `Sales` | Yes | Manage incoming orders |

Unknown routes fall back to the home page.

`ProtectedRoute` redirects unauthenticated users to `/login` and preserves the intended destination.

---

## Available Scripts

### Backend (`server/`)

| Command | Description |
| --- | --- |
| `npm start` | Start the API with Node |
| `npm run dev` | Start the API with `node --watch` for auto-restart |
| `npm run seed` | Seed demo users, items, and a sample order |
| `npm run reset` | Delete all users, items, and orders, then reseed |

### Frontend (`client/`)

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server on port 5173 |
| `npm run build` | Build the production bundle into `client/dist/` |
| `npm run preview` | Preview the production build locally |

There is no root-level `package.json`, so commands must be run from the `client/` or `server/` directory.

---

## Database Notes

### Embedded MongoDB (default)

With `DB_MODE=memory`, `server/db.js` starts a `mongodb-memory-server` instance on port 27017 with:

- Database name: `ewaste`
- Storage engine: `wiredTiger`
- Persistent data path: `server/.data/mongodb/`
- Binary download path: `server/.data/mongodb-bin/`

Despite the name, data is configured to persist between restarts because a fixed `dbPath` is supplied. Deleting `server/.data/mongodb/` resets the embedded database.

This mode is intended for local development and demos. It is not recommended for production.

### External MongoDB

To use a local MongoDB installation or MongoDB Atlas:

```env
DB_MODE=uri
MONGODB_URI=mongodb://127.0.0.1:27017/ewaste
```

or, for Atlas:

```env
DB_MODE=uri
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>/ewaste
```

Then run the seed command once if you want demo data.

---

## Building and Deployment

### Frontend build

```bash
cd client
npm run build
```

The static production files are written to `client/dist/`. Serve this directory with any static host or web server.

### Production backend

1. Set `NODE_ENV=production`.
2. Set `DB_MODE=uri` and provide a real `MONGODB_URI`.
3. Set a strong, unique `JWT_SECRET`.
4. Set `CLIENT_ORIGIN` to the deployed frontend origin.
5. Start with `npm start` behind a process manager such as PM2 or a container.

### Reverse proxy

The React app calls `/api/...` directly. In production, configure your web server or hosting platform to proxy `/api` to the Express server. For example, with Nginx:

```nginx
location /api/ {
    proxy_pass http://127.0.0.1:5000/api/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

### Deployment checklist

- Use a real MongoDB instance instead of the embedded server.
- Replace the default JWT secret.
- Restrict CORS to the actual frontend origin.
- Serve the frontend over HTTPS.
- Do not commit `.env` or the `server/.data/` directory.

---

## Troubleshooting

### `EADDRINUSE` on port 5000

Another process is using the API port. Stop the other process or change `PORT` in `server/.env`.

```powershell
# Find the process using port 5000 on Windows
Get-NetTCPConnection -LocalPort 5000 | Select-Object OwningProcess
```

### Embedded MongoDB fails to start or download

- Check your internet connection on first run.
- Verify that port 27017 is free.
- Ensure `server/.data/mongodb-bin/` is writable.
- If seed and server are both running, stop the server before seeding.

### `Network error - is the RecyCoin server running?`

The frontend cannot reach the API. Confirm that:

- the backend is running on port 5000;
- the Vite dev server is running on port 5173;
- the `/api` proxy in `client/vite.config.js` is unchanged.

### Login fails with a seeded account

Run the seed script after connecting to the correct database. If you previously used an external database, make sure `DB_MODE` and `MONGODB_URI` still point to where the data was seeded.

### Marketplace is empty

Run `npm run seed` with the backend stopped, or create a listing after logging in at `/seller/products`.

### `401 Not authorized`

The JWT may be missing, expired, or signed with a different secret. Log out and log in again. If you changed `JWT_SECRET`, all existing tokens become invalid.

### Data disappeared after switching database modes

Embedded data and external MongoDB data are separate stores. Switching `DB_MODE` from `memory` to `uri` does not migrate data.

### Build succeeds but production routes return 404

The client uses `BrowserRouter`, so the static host must rewrite unknown paths to `index.html` (SPA fallback).

---

## Known Limitations

- **Client-trusted game scores.** The server accepts the score sent by the client. A production version should validate answers server-side.
- **No admin role.** Any authenticated user can act as a seller, and moderation features are not implemented.
- **Single CORS origin.** `CLIENT_ORIGIN` accepts one origin only.
- **No payment integration.** Checkout records an order but does not process real money; prices are display values in Indian Rupees (INR).
- **No email verification or password reset.** Authentication is limited to register, login, and session hydration.
- **No automated tests.** There is no test suite, linter, or type checker configured.
- **Development-oriented database.** The embedded MongoDB mode is convenient but not intended for production workloads.
- **Local storage tokens.** JWTs are stored in `localStorage`, which is common for demos but has XSS trade-offs compared with secure HTTP-only cookies.

---

## Contributing

1. Fork the repository.
2. Create a feature branch.
3. Make focused changes that follow the existing structure and style.
4. Test both the client and server locally.
5. Open a pull request describing the change and how it was verified.

Before submitting, run:

```bash
cd client
npm run build

cd ../server
npm start
```

---

## License

No license file is included in this repository. Add a license before distributing or reusing the project publicly.
