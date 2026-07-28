# 📦 Dispatch — Parcel & Courier Delivery Platform

A full-stack MERN application for booking, assigning, tracking, and paying for parcel deliveries across Bangladesh. Built with three role-based dashboards (user, rider, admin), a real payment gateway (SSLCommerz), document uploads, and a complete delivery lifecycle.

**🔗 Live demo:** [dispatch-iota-six.vercel.app](https://dispatch-iota-six.vercel.app)
**🔗 API:** [dispatch-mjif.onrender.com](https://dispatch-mjif.onrender.com)

> ⏱️ The API is on a free tier and sleeps when idle — the first request may take ~30–60s to wake up.

---

## ✨ Features

**Authentication & access**
- Email/password **and** Google sign-in (Firebase)
- Role-based access control — **user / rider / admin** — enforced on the server
- JWT verified on every protected request via the Firebase Admin SDK

**For users**
- Book a parcel with pickup/delivery details — **price computed server-side** from weight + distance
- Track any parcel publicly by tracking ID, with a full status timeline
- Search, filter, sort, and paginate your parcels
- Pay online via **SSLCommerz** (cards, bKash, Nagad, Rocket) with payment history

**For riders**
- Apply to become a rider with a **driving-license PDF upload** (Cloudinary)
- View assigned deliveries and update delivery status

**For admins**
- Manage users and promote/demote roles
- Review rider applications (with license documents) and approve/reject
- View all parcels and assign them to approved riders

---

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | React 19, Vite, Tailwind CSS v4, daisyUI, React Router, TanStack Query, Axios, SweetAlert2 |
| **Backend** | Node.js, Express (CommonJS), MongoDB (native driver) |
| **Auth** | Firebase Authentication (client) + Firebase Admin SDK (server) |
| **Payments** | SSLCommerz |
| **File storage** | Cloudinary (direct unsigned upload) |
| **Database** | MongoDB Atlas |
| **Deployment** | Vercel (client), Render (server), MongoDB Atlas (database) |

---

## 🏛️ Architecture Decisions

The choices below reflect *why* the app is built the way it is, not just *what* it does.

- **Authentication vs. authorization are separate.** Firebase owns authentication (identity + JWT). The server owns authorization — the user's `role` lives in MongoDB and is checked by `verifyToken` → `verifyAdmin`/`verifyRider` middleware. The client is never trusted to declare its role.

- **Trust boundaries on the server.** Anything with business or security impact — parcel `cost`, user `role`, payment `amount` — is computed or validated server-side, never accepted from the request body.

- **Server state via TanStack Query.** Data that is asynchronous, cached, and shared (parcels, user lists, roles) is managed with TanStack Query rather than hand-rolled `useEffect` + `useState`, giving caching, deduplication, and declarative refetch-on-mutation (`invalidateQueries`).

- **Embed vs. reference.** A parcel's `trackingHistory` is **embedded** (bounded, parcel-owned, always read together — one atomic `$push` per status change). Payments are **referenced** (`parcelId`), since they're queried independently.

- **Idempotent user save.** `POST /users` checks the email before inserting, so both email registration and repeated Google logins are safe and never create duplicates.

- **Fail-safe multi-writes.** Cross-collection operations (e.g. approving a rider updates the application *and* the user's role) are ordered so a partial failure leaves the system in the safest recoverable state.

- **Payment integrity.** SSLCommerz uses a redirect flow; the server never trusts the browser redirect — it calls SSLCommerz's validation API server-to-server before marking a payment complete, and the finalize step is idempotent (handles both the success redirect and the IPN webhook).

- **Axios interceptors.** A request interceptor attaches the Firebase token to every authenticated call in one place; a response interceptor handles 401/403 globally.

- **Layered backend.** `server.js` (start) → `app.js` (build) → `routes/` → `middleware/` → `controllers/` → `config/db.js`, with a central `asyncHandler` + error middleware so no route repeats try/catch.

---

## 📁 Project Structure

```
dispatch/
├── dispatch-client/     # React + Vite frontend
│   └── src/
│       ├── components/   # Navbar, Footer, Logo
│       ├── pages/        # public + dashboard pages
│       ├── layouts/      # RootLayout, DashboardLayout
│       ├── routes/       # router + route guards
│       ├── hooks/        # useAuth, useAxiosSecure, useRole, useDebounce
│       └── providers/    # AuthProvider
└── dispatch-server/     # Express API
    ├── config/           # db, firebase, sslcommerz, env
    ├── controllers/      # user, parcel, rider, payment
    ├── routes/           # express routers
    ├── middleware/       # verifyToken, verifyAdmin, verifyRider, errorHandler
    └── utils/            # asyncHandler, calculateCost, generateTrackingId
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A MongoDB Atlas cluster
- A Firebase project (Authentication enabled: Email/Password + Google)
- A Cloudinary account (with an unsigned upload preset, PDF delivery enabled)
- An SSLCommerz sandbox account

### 1. Server

```bash
cd dispatch-server
npm install
# create a .env file (see below), and place your Firebase
# service-account key at dispatch-server/firebase-admin-key.json
npm run dev
```

**`dispatch-server/.env`**
```env
PORT=5000
CLIENT_URL=http://localhost:5173
MONGO_URI=your_mongodb_atlas_uri
STRIPE_SECRET_KEY=your_stripe_test_key   # legacy — still read at boot
SSLCZ_STORE_ID=your_sslcommerz_sandbox_store_id
SSLCZ_STORE_PASSWD=your_sslcommerz_sandbox_password
SSLCZ_IS_LIVE=false
SERVER_URL=http://localhost:5000
# Production only (instead of the JSON file):
# FIREBASE_SERVICE_ACCOUNT_B64=base64_of_your_service_account_json
```

### 2. Client

```bash
cd dispatch-client
npm install
# create a .env.local file (see below)
npm run dev
```

**`dispatch-client/.env.local`**
```env
VITE_API_URL=http://localhost:5000/api
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset
```

> Config/env files load only at startup — restart the dev server after editing them.

---

## 🔌 API Overview

Base URL: `/api`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/users` | Public | Create/sync a user on register |
| `GET` | `/users` | Admin | List all users |
| `PATCH` | `/users/:id/role` | Admin | Change a user's role |
| `POST` | `/parcels` | Auth | Book a parcel (server-priced) |
| `GET` | `/parcels` | Auth | List with search/sort/pagination |
| `GET` | `/parcels/track/:trackingId` | Public | Public tracking + timeline |
| `PATCH` | `/parcels/:id/status` | Rider | Update delivery status |
| `PATCH` | `/parcels/:id/assign` | Admin | Assign a rider |
| `POST` | `/riders` | Auth | Apply to be a rider |
| `PATCH` | `/riders/:id/approve` | Admin | Approve → grant rider role |
| `POST` | `/payments/init` | Auth | Start an SSLCommerz payment |
| `POST` | `/payments/success/:tranId` | Public | Gateway callback (validated) |

---

## 🗺️ Roadmap / Possible Improvements

- Automated tests (Jest + Supertest, React Testing Library)
- Migrate to TypeScript with Zod for shared validation
- Real-time tracking updates via WebSockets
- Signed Cloudinary uploads and rate limiting
- CI/CD pipeline (GitHub Actions)

---

## 👤 Author

**Mohtasim Fahim**
GitHub: [@mohtasim22](https://github.com/mohtasim22)

---

<sub>Built as a portfolio project to demonstrate full-stack MERN development — authentication, role-based access, third-party integrations, and deployment.</sub>
