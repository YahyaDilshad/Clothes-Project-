# POS / E-commerce Admin Backend

A complete Node.js + Express + MongoDB backend for a POS / e-commerce admin frontend.
Plain JavaScript (no TypeScript), Mongoose ODM, Cloudinary image storage, JWT auth with
role-based access control (RBAC), and CSV exports.

Base URL: `http://localhost:5000/api`

## Tech Stack

- **Runtime:** Node.js + Express.js
- **Database:** MongoDB + Mongoose
- **Auth:** JWT (jsonwebtoken) + bcryptjs
- **Images:** Cloudinary (via multer memory storage, streamed directly — no local disk writes)
- **Security:** Helmet, CORS, express-rate-limit, express-mongo-sanitize
- **Validation:** express-validator
- **CSV export:** json2csv

## Folder Structure

```text
src/
├── config/          # db.js, cloudinary.js, roles.js
├── controllers/      # request handlers — one file per resource
├── models/           # Mongoose schemas
├── routes/           # Express routers — one file per resource + index.js
├── middleware/        # auth, upload (multer), validate, errorHandler, rateLimiter
├── services/          # business logic: cloudinary.service, order.service, token.service
├── utils/             # ApiError, ApiResponse, catchAsync, paginate, csv, generateCode, seed.js
├── app.js             # express app setup
└── server.js          # entry point
```

## Setup

```bash
cd backend
cp .env.example .env    # fill in your MongoDB URI, JWT secret, Cloudinary keys
npm install
npm run dev              # nodemon, or `npm start` for plain node
```

Optionally seed an initial Admin account and default role permissions:

```bash
npm run seed
# creates admin@example.com / Admin@123 (override with SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD env vars)
```

## Environment Variables (`.env`)

| Variable | Description |
|---|---|
| `PORT` | Server port (default 5000) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign JWTs |
| `JWT_EXPIRES_IN` | Token lifetime, e.g. `7d` |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Cloudinary credentials |
| `CLIENT_URL` | Allowed CORS origin, e.g. `http://localhost:5173` |
| `RATE_LIMIT_WINDOW_MS` / `RATE_LIMIT_MAX` | Rate limiting config |

## Auth & RBAC

Roles: `Admin`, `Manager`, `Staff`, `Cashier` (see `src/config/roles.js` for default permission sets).

All protected routes require:
```
Authorization: Bearer <token>
```

- `POST /api/auth/register` — public self-registration always creates a `Cashier`. An
  authenticated `Admin` can pass `role` in the body to set a different role (used for
  onboarding staff directly, in addition to `POST /api/staff`).
- `POST /api/auth/login`
- `GET /api/auth/me`

Route-level `authorize(...)` middleware restricts write/delete actions on sensitive
resources (staff, permissions, product/category management, revenue) to `Admin`/`Manager`.

## Response Shape

All responses follow a consistent envelope:

```json
{ "success": true, "message": "...", "data": { }, "meta": { } }
```

Errors:

```json
{ "success": false, "message": "...", "errors": [] }
```

List endpoints support pagination via `?page=&limit=` and return `meta` with
`page, limit, total, totalPages, hasNextPage, hasPrevPage`.

## API Reference

### Auth
```
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Products (Cloudinary images, multipart/form-data field `images`)
```
GET    /api/products              ?page&limit&search&category&collection&status&minPrice&maxPrice&inStock&sort
POST   /api/products              (Admin, Manager)
PUT    /api/products/:id          (Admin, Manager) — supports removeImageIds[] + new `images` files
DELETE /api/products/:id          (Admin, Manager) — also deletes Cloudinary assets
POST   /api/products/:id/duplicate (Admin, Manager) — clones product + re-uploads images as new Cloudinary assets
```

### Categories (multipart field `image`)
```
GET    /api/categories            ?page&limit&search&isActive
POST   /api/categories            (Admin, Manager)
PUT    /api/categories/:id        (Admin, Manager)
DELETE /api/categories/:id        (Admin, Manager) — blocked if products still reference it
```

### Collections (multipart field `image`)
```
GET  /api/collections             ?page&limit&search&isActive
POST /api/collections             (Admin, Manager)
```

### Orders / POS
```
GET   /api/orders                 ?page&limit&status&paymentStatus&customer&search&from&to
POST  /api/orders                 — server validates products/stock & computes totals; decrements inventory
PATCH /api/orders/:id/status      — cancelling restocks inventory
PATCH /api/orders/:id/payment
POST  /api/orders/:id/notes
```

### Customers
```
GET  /api/customers               ?page&limit&search&isActive
POST /api/customers
GET  /api/customers/:id           — includes recent order history
```

### Inventory
```
GET   /api/inventory              ?page&limit&search&lowStock&location
PATCH /api/inventory/:id          { adjustment } or { quantity }, mirrors change back to Product
POST  /api/inventory/sync         (Admin, Manager) — reconciles Inventory records against Product catalog
GET   /api/inventory/export       (Admin, Manager) — CSV download
```

### Staff / RBAC
```
GET    /api/staff                 (Admin, Manager)
POST   /api/staff                 (Admin)
PUT    /api/staff/:id             (Admin)
DELETE /api/staff/:id             (Admin) — cannot delete your own account

GET  /api/permissions/:roleName   (Admin, Manager)
POST /api/permissions/:roleName   (Admin) — body: { permissions: string[] }
```

### Expenses
```
GET    /api/expenses              ?page&limit&category&from&to&search — meta includes totalAmount
POST   /api/expenses              (Admin, Manager)
DELETE /api/expenses/:id          (Admin, Manager)
```

### Returns
```
GET  /api/returns                 ?page&limit&status&order
POST /api/returns                 (Admin, Manager, Staff) — extra endpoint (see note below)
PUT  /api/returns/:id/status      (Admin, Manager) — approving/completing restocks inventory
```
> Note: the original spec listed only `GET` and `PUT` for returns. A `POST /api/returns`
> was added so return requests have a real creation path — without it the `GET` list would
> always be empty. Remove/gate this route if your frontend creates returns another way.

### Exchanges
```
GET    /api/exchanges             ?page&limit&status&order
POST   /api/exchanges             (Admin, Manager, Staff)
PATCH  /api/exchanges/:id         (Admin, Manager, Staff) — completing moves stock (restock old, deduct new)
DELETE /api/exchanges/:id         (Admin, Manager) — blocked once completed
```

### Dashboard / Revenue
```
GET /api/dashboard/charts         (Admin, Manager) ?days=30 — sales by day, top products, status breakdown
GET /api/revenue/analytics        (Admin, Manager) ?from&to — gross/net revenue, tax, discounts, payment breakdown
GET /api/revenue/transactions     (Admin, Manager) ?page&limit&from&to&paymentMethod&status
GET /api/revenue/export           (Admin, Manager) ?from&to — CSV download
```

## Business Logic Notes

- **Order totals are always computed server-side** from live product prices — the client
  cannot submit arbitrary prices. Stock is checked and decremented atomically inside a
  MongoDB transaction (`mongoose.startSession()` / `withTransaction`).
- **Inventory** stays in sync with `Product.stock` in both directions: adjusting inventory
  updates the product, and updating a product's `stock` field updates its inventory record.
  `POST /inventory/sync` reconciles any drift and creates missing inventory records.
- **Cloudinary images** are stored as `{ url, publicId }` only. Replacing or deleting a
  product/category/collection image deletes the old Cloudinary asset. Duplicating a product
  re-uploads its images as brand-new Cloudinary assets (different `publicId`) so deleting
  the original product never breaks the duplicate.
- **Returns/Exchanges** restock or move inventory only when their status transitions to
  `approved`/`completed`, guarded against double-processing.

## Requirements Checklist

- [x] Real MongoDB CRUD/business logic for every endpoint (no stubs)
- [x] Mongoose models with relationships (refs + populate)
- [x] Cloudinary images stored as `{ url, publicId }`, old assets deleted on replace/delete
- [x] Server-side order total calculation + inventory updates on order creation
- [x] Inventory stock adjustment + synchronization
- [x] JWT auth + RBAC (`Admin`, `Manager`, `Staff`, `Cashier`) via middleware
- [x] Pagination, search, filtering on all list endpoints
- [x] Validation (express-validator on auth; explicit checks + Mongoose schema validation elsewhere)
- [x] Centralized error handling, consistent `{ success, message, data }` responses
- [x] CSV exports (`/inventory/export`, `/revenue/export`)
- [x] Helmet, CORS, rate limiting, dotenv
