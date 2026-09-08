# 1Fi — SDE1 Assignment

A full-stack product + EMI plan browser: React/Tailwind frontend, Express
backend, PostgreSQL via Prisma. Products, variants, and EMI plans are all
loaded from the database through the API — nothing is hardcoded in the UI.

## Tech stack
- **Frontend:** React 18 + Vite, Tailwind CSS, React Router (unique URLs per product)
- **Backend:** Node.js + Express
- **Database:** PostgreSQL, accessed via Prisma ORM
- **Dev DB:** Docker Compose (Postgres 16) for zero-setup local development

## Project structure
```
1fi-fullstack/
  docker-compose.yml       # local Postgres
  server/                  # Express API + Prisma
    prisma/schema.prisma
    prisma/seed.js
    src/index.js
    src/routes/products.js
  client/                  # React + Tailwind frontend
    src/pages/             # Shop, Marketplace, ProductPage, Confirm...
    src/components/
    public/products/       # real product photos, served as static assets
```

## Setup & run instructions

**Prerequisites:** Node.js 18+, npm, Docker (or any Postgres instance).

### 1. Start Postgres
```bash
docker compose up -d
```

### 2. Backend
```bash
cd server
cp .env.example .env      # edit DATABASE_URL if not using the default docker-compose one
npm install
npx prisma migrate dev --name init
npm run seed               # populates Product / ProductVariant / EMIPlan
npm run dev                # http://localhost:4000
```

### 3. Frontend
```bash
cd client
npm install
npm run dev                 # http://localhost:5173 (proxies /api to :4000)
```

Open `http://localhost:5173`, go to Shop → 1Fi Marketplace, pick a product.

## API endpoints & example responses

### `GET /api/products`
Returns a lightweight list for the Marketplace grid.
```json
[
  {
    "id": "clx...",
    "slug": "iphone-17-pro",
    "name": "Apple iPhone 17 Pro",
    "brand": "Apple",
    "description": "The most advanced iPhone yet...",
    "startingPrice": 134900,
    "image": "/products/iphone-17-pro/blue.jpg"
  }
]
```

### `GET /api/products/:slug`
Full product detail with all variants, each carrying its own EMI plans.
```json
{
  "id": "clx...",
  "slug": "iphone-17-pro",
  "name": "Apple iPhone 17 Pro",
  "brand": "Apple",
  "description": "The most advanced iPhone yet...",
  "variants": [
    {
      "id": "cly...",
      "size": "256GB",
      "color": "Deep Blue",
      "mrp": 139900,
      "price": 134900,
      "imageUrl": "/products/iphone-17-pro/blue.jpg",
      "emiPlans": [
        { "id": "clz...", "tenureMonths": 3, "monthlyAmount": 45314, "interestRate": 0, "cashbackAmount": 1349, "isRecommended": false },
        { "id": "clz...", "tenureMonths": 9, "monthlyAmount": 14989, "interestRate": 0, "cashbackAmount": 0, "isRecommended": true },
        { "id": "clz...", "tenureMonths": 24, "monthlyAmount": 6221, "interestRate": 10.5, "cashbackAmount": 0, "isRecommended": false }
      ]
    }
  ]
}
```

### `GET /api/products/:slug/variants/:variantId/emi-plans`
```json
[
  { "id": "clz...", "tenureMonths": 3, "monthlyAmount": 45314, "interestRate": 0, "cashbackAmount": 1349, "isRecommended": false },
  { "id": "clz...", "tenureMonths": 6, "monthlyAmount": 22483, "interestRate": 0, "cashbackAmount": 0, "isRecommended": false },
  { "id": "clz...", "tenureMonths": 9, "monthlyAmount": 14989, "interestRate": 0, "cashbackAmount": 0, "isRecommended": true },
  { "id": "clz...", "tenureMonths": 24, "monthlyAmount": 6221, "interestRate": 10.5, "cashbackAmount": 0, "isRecommended": false }
]
```

## Schema
```
Product
  id, slug (unique), name, brand, description, createdAt
  -> has many ProductVariant

ProductVariant
  id, productId (FK), size, color, mrp, price, imageUrl
  -> has many EMIPlan

EMIPlan
  id, variantId (FK), tenureMonths, monthlyAmount, interestRate,
  cashbackAmount, isRecommended
```
See `server/prisma/schema.prisma` for the exact Prisma model definitions.

## Products included
5 products, 3 variants each: iPhone 17 Pro, Samsung Galaxy S25 Ultra,
Google Pixel 10 Pro, MacBook Air, Sony Bravia 4K Smart TV. Real product
photos live in `client/public/products/`.

## Deploying
- **Database:** any free hosted Postgres (Neon, Supabase, Render) — set
  its connection string as `DATABASE_URL` on the deploy target.
- **Backend:** Render or Railway (Node web service, start command `npm start`).
- **Frontend:** Vercel or Render Static Site (`npm run build`, publish `dist/`,
  set an env var / rewrite so `/api` proxies to the deployed backend URL).

## Note on this build
This was written and syntax-verified (via `node --check` and the
TypeScript compiler in JSX mode) in a sandboxed environment without
network access, so `npm install` / `prisma migrate` / a live Postgres
connection were not run end-to-end here. Run the setup steps above on
your machine to bring it up and confirm — flag anything that doesn't
behave as expected and it can be fixed directly.
