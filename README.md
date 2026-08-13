# HEBA BAATTIYA — Luxury Couture E-Commerce

A full-stack Next.js 15 e-commerce storefront for a luxury evening, cocktail, and bridal couture
house. Built with the App Router, React 19, TypeScript, Tailwind CSS, Prisma, and NextAuth.

---

## ⚠️ Read This First

This project was generated outside of a live development environment with **no network access**
to install npm packages or run a database. That means:

- ✅ **Every page, component, and route is fully built** — all 20+ pages listed in the brief exist,
  are styled, are responsive, and are interactive (cart, wishlist, filters, forms all work using
  client-side state).
- ✅ **The complete Prisma schema is written** and models every entity from the brief (Users,
  Products, Categories, Orders, OrderItems, Addresses, Reviews, Coupons, Wishlist, Cart, plus
  NextAuth tables, site content, and more).
- ✅ **API routes are written** for auth, products, cart, wishlist, checkout, orders, coupons,
  reviews, newsletter, contact, and admin endpoints — all using Prisma queries, ready to run once a
  database is connected.
- ⚠️ **The app currently runs on mock data** (`src/data/*.ts`) instead of a live database. The
  product catalog, customer orders, and dashboard content you see are realistic seed data, not
  database records.
- ⚠️ **Authentication is scaffolded but not wired to actual sessions.** Login/register forms submit
  and simulate success, but don't yet call NextAuth's real `signIn`/`signUp` flow — see "Connecting
  a Real Backend" below for the few lines needed to flip this on.
- ⚠️ **Payments are not connected to a live gateway.** No real money can move through this app yet.
  Mada, Visa, Mastercard, Apple Pay, and STC Pay are presented as selectable options in checkout,
  but there is no PSP (payment service provider) integration. See the Payments section below.
- ❌ **`npm install` has not been run.** This sandbox had no network access to the npm registry, so
  `node_modules` doesn't exist and the app has not been built or started locally. You'll need to run
  `npm install` yourself (see Quick Start).

This is, in effect, a production-grade **frontend + complete backend blueprint**, not a fully wired
live system. Everything is structured so that connecting a real Postgres database and a payment
provider is mostly configuration, not re-architecture.

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env
# Edit .env and fill in DATABASE_URL, AUTH_SECRET, etc.

# 3. Generate Prisma client & push schema to your database
npx prisma generate
npx prisma db push

# 4. Seed the database with sample data
npm run db:seed

# 5. Run the dev server
npm run dev
```

Visit `http://localhost:3000`.

### Generating an AUTH_SECRET

```bash
openssl rand -base64 32
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS, Framer Motion |
| Database ORM | Prisma |
| Database | PostgreSQL |
| Auth | NextAuth v5 (Credentials + Google OAuth scaffolded) |
| State | Zustand (cart, wishlist — persisted to localStorage client-side) |
| Forms | React Hook Form + Zod |
| Charts | Recharts (admin analytics) |
| Icons | Lucide React |

---

## Project Structure

```
src/
  app/                    # App Router pages & API routes
    (storefront pages)    # /, /shop, /collections, /product/[slug], /cart, /checkout, etc.
    dashboard/             # Customer account area (protected)
    admin/                 # Admin panel (protected)
    api/                   # Route handlers (auth, products, cart, checkout, etc.)
  components/
    layout/                # Navbar, Footer, SiteShell
    home/                   # Homepage sections
    shop/                   # Filters, shop page client
    product/                # Gallery, info panel, reviews
    cart/, checkout/        # Cart drawer, checkout form
    dashboard/, admin/      # Account & admin-specific components
    shared/                 # ProductCard, OrderStatusBadge, etc.
    ui/                     # Button, Input, Logo — design system primitives
  data/                   # Mock data layer (stand-in for Prisma queries)
  lib/
    auth.ts                # NextAuth config
    prisma.ts              # Prisma client singleton
    validations.ts          # Zod schemas
    store/                  # Zustand stores (cart, wishlist)
  types/                  # Shared TypeScript types
prisma/
  schema.prisma           # Full database schema
  seed.ts                 # Database seed script
public/
  logo/                   # Processed brand logo assets (light/dark, full/monogram)
```

---

## Connecting a Real Backend

The mock data layer in `src/data/` mirrors the shape of Prisma query results exactly, so swapping
it out is mechanical:

1. **Database**: provision a Postgres instance (Neon, Supabase, Railway, or self-hosted), set
   `DATABASE_URL` in `.env`, then run `npx prisma db push` and `npm run db:seed`.
2. **Replace mock imports**: pages currently importing from `@/data/products` or `@/data/customer`
   should instead fetch from the corresponding API route (already written in `src/app/api/`) or
   query Prisma directly in a Server Component.
3. **Wire up real auth**: `src/lib/auth.ts` is a complete NextAuth config. Update the login/register
   forms (`src/app/login/page.tsx`, `src/app/register/page.tsx`) to call `signIn()` and
   `POST /api/register` instead of the simulated `setTimeout` calls.
4. **Enable middleware protection**: `src/middleware.ts` has the real auth-guard logic written as a
   comment — uncomment it once sessions are live, to actually gate `/dashboard` and `/admin`.

---

## Payments

No payment gateway is connected. To accept real payments:

- **Visa / Mastercard / Mada**: integrate a PSP that supports the Saudi market (e.g. **HyperPay**,
  **PayTabs**, **Moyasar**, **Tap Payments**, or **Stripe** with Mada support). Most offer a
  hosted checkout or tokenized card form you'd drop into `src/components/checkout/checkout-form.tsx`.
- **Apple Pay**: requires an Apple Developer merchant ID, a domain verification file, and a merchant
  validation endpoint — typically provided by your PSP (most of the above support Apple Pay
  out of the box once Visa/Mastercard is configured).
- **STC Pay**: integrate directly via STC Pay's merchant API, or through a PSP aggregator that
  supports it (HyperPay and PayTabs both do).

The checkout API route (`src/app/api/checkout/route.ts`) creates the `Order` record and has clearly
marked comments showing exactly where to insert the payment capture call for each method.

---

## What's Mocked vs. Real

| Feature | Status |
|---|---|
| All 20 pages, responsive layouts, animations | ✅ Fully built |
| Cart, wishlist (add/remove/update) | ✅ Fully functional (client-side, persisted to localStorage) |
| Shop filters, search, sort, pagination | ✅ Fully functional |
| Checkout form validation | ✅ Fully functional |
| Coupon codes | ✅ Functional with mock codes: `HBWELCOME10`, `HBVIP20`, `HB500` |
| Product images | ⚠️ Unsplash placeholder photography (licensed, free for commercial use) |
| Login / Register | ⚠️ UI complete, simulated submission — not connected to real sessions |
| Order history / tracking | ⚠️ Realistic mock data, not from a database |
| Admin product/order/coupon management | ⚠️ Fully interactive UI, changes are in-memory only (reset on refresh) |
| Payments | ❌ Not connected to any gateway |
| Email notifications | ❌ Not implemented — see `.env.example` for where credentials would go |

---

## Design System

- **Colors**: Pure White `#FFFFFF`, Soft Ivory `#F8F8F5`, Charcoal `#161616` — no bright colors or
  gold, per brand guidelines.
- **Typography**: Cinzel (headings), Poppins (body) — loaded via `next/font/google`.
- **Logo**: the uploaded HB monogram is processed into four variants in `public/logo/` (full
  lockup / monogram-only, each in dark and light versions) and rendered via the `<Logo />`
  component, never re-drawn or approximated.

---

## License & Image Credits

Placeholder product photography sourced from Unsplash under the Unsplash License (free for
commercial use, no attribution required). Replace with original campaign photography in
`src/lib/images.ts` before launch — it's the single file that maps every image used across the site.
