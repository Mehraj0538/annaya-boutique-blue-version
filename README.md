# Annaya Boutique — Next.js

A full-stack ecommerce boutique converted from Vite + Express.js to **Next.js 15 App Router**.  
Frontend and backend live together in one project — no separate server needed.

---

## Tech Stack

- **Next.js 15** (App Router, TypeScript)
- **Tailwind CSS v4**
- **MongoDB + Mongoose**
- **Auth0** (authentication)
- **Cloudinary** (image uploads)
- **Razorpay** (payments)
- **Zustand** (cart, wishlist, user state)
- **Framer Motion** (animations)
- **Sonner** (toast notifications)

---

## Project Structure

```
annaya-boutique-nextjs/
├── app/
│   ├── api/                  # All backend API routes
│   │   ├── products/         # Product CRUD + filters
│   │   ├── users/            # Auth0 sync, profile, addresses, orders
│   │   ├── admin/            # Admin stats, orders, users
│   │   ├── payment/          # Razorpay create + verify
│   │   └── upload/           # Cloudinary image upload
│   ├── (pages)/              # All frontend pages
│   ├── globals.css           # Tailwind v4 + custom theme
│   └── layout.tsx            # Root layout with providers
├── components/
│   ├── layout/               # Navbar, Footer
│   ├── products/             # ProductCard
│   ├── admin/                # ImageUpload
│   ├── AuthSyncManager.tsx   # Auth0 → MongoDB sync
│   ├── Providers.tsx         # Auth0Provider + Toaster
│   └── ShellLayout.tsx       # Page wrapper (nav/footer)
├── lib/
│   ├── mongodb.ts            # Cached Mongoose connection
│   ├── api.ts                # Axios client (same-origin)
│   ├── cloudinary.ts         # Cloudinary config
│   ├── adminAuth.ts          # Admin middleware helper
│   └── utils.ts              # cn, formatCurrency, getWhatsAppLink
├── models/                   # Mongoose models (User, Product, Order)
└── store/                    # Zustand stores (cart, wishlist, user)
```

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

```bash
cp .env.local.example .env.local
```

Fill in all values in `.env.local`:
- `MONGODB_URI` — your MongoDB connection string
- `NEXT_PUBLIC_AUTH0_DOMAIN` + `NEXT_PUBLIC_AUTH0_CLIENT_ID` — from Auth0 dashboard
- `CLOUDINARY_*` — from Cloudinary dashboard
- `RAZORPAY_KEY_ID` + `RAZORPAY_KEY_SECRET` — from Razorpay dashboard
- `ADMIN_EMAILS` — comma-separated emails that get admin role

### 3. Auth0 Configuration

In your Auth0 dashboard, set the following URLs for your application:

- **Allowed Callback URLs**: `http://localhost:3000`
- **Allowed Logout URLs**: `http://localhost:3000`
- **Allowed Web Origins**: `http://localhost:3000`

For production, replace `localhost:3000` with your actual domain.

### 4. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Key Differences from the Original Vite + Express Version

| Feature | Old (Vite + Express) | New (Next.js) |
|---|---|---|
| Routing | react-router-dom | next/navigation (useRouter, usePathname) |
| API server | Express.js (server.ts) | Next.js API Routes (app/api/*/route.ts) |
| Links | `<Link to="...">` | `<Link href="...">` |
| Navigation | useNavigate() | useRouter().push() |
| Env vars | `import.meta.env.VITE_*` | `process.env.NEXT_PUBLIC_*` |
| Server start | tsx server.ts | next dev |
| DB connection | connectDB() in server.ts | Cached singleton in lib/mongodb.ts |
| Image uploads | multer middleware | Native FormData in route handler |
| Static assets | /public in Vite | /public in Next.js (same) |

---

## Deployment (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Add all environment variables in the Vercel dashboard under Project Settings → Environment Variables.
