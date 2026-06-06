# 🍽️ Foddo — Immersive 3D Restaurant Experience

A full-stack, fully responsive restaurant web app with **3D visuals (React Three Fiber)**,
**parallax scrolling**, an **interactive 3D menu gallery**, smooth motion transitions and
haptic feedback — plus a complete **ordering + reservations** flow with **Stripe** payments
and a **real-time admin panel** for managing the menu, tracking orders and viewing analytics.

Built with **Next.js 14 (App Router) · TypeScript · Prisma · SQLite · Tailwind · Framer Motion · Stripe**.

> **Design:** Foddo uses a warm, **light** premium aesthetic (cream + butter-yellow accents, white cards, a dark hero photo and a dark footer for contrast) — deliberately distinct from a dark "futuristic" look.

## ✨ What this build adds (feature parity++ for client demos)
- **QR code menu** — `/qr-menu` prints table cards (4-up); admin dashboard widget with PNG/SVG download (`/api/qr`)
- **5 payment methods** — Stripe (card), **PayPal** Smart Buttons, **Wise** bank transfer (with reference code), and **pay-on-delivery** (cash / card to courier). Online options auto-hide when unconfigured
- **WhatsApp** — site-wide floating chat button + a "Book via WhatsApp" tab on reservations (pre-filled message)
- **Calendly** — embedded booking tab on reservations
- **Contact page** — form (saved to DB), Google Maps embed, FAQ accordion, "Find us" / "Leave a review" links + an **admin Messages inbox**
- **About page** — story, stats, chef team and gallery
- **Local SEO** — `sitemap.xml`, `robots.txt`, JSON-LD `Restaurant` schema, Open Graph + Twitter cards, canonical URLs
- **Admin Settings** — change the admin password
- **English / French** language switch — a header toggle (EN/FR) translates the **entire app**: the customer-facing site (landing, menu, cart, checkout, reservations, contact, about, QR) **and the admin panel** (its own EN/FR switcher in the sidebar + on the login screen). The choice persists in a cookie, sets `<html lang>`, and re-renders both client and server components. Dictionaries live in `src/i18n/{en,fr}.ts` (FR is typed against EN, so a missing key fails the build). Add a locale by adding a file + entry in `src/i18n/config.ts`.
- **Per-dish French** — menu items carry optional `nameFr` / `descriptionFr` (seeded for all 18 dishes, editable in Admin → Menu). The menu, cart and search use the French text when the language is French and fall back to English otherwise.

## ✨ Premium design layer
- **Branded intro preloader** (wordmark assembles over a % counter, then a curtain reveal) — once per session
- **Cinematic 3D** — bloom, depth-of-field, vignette and film grain on the hero scene (`@react-three/postprocessing`)
- **Custom blended cursor** with contextual labels ("Drag" on the 3D gallery, "View" on dishes) — native cursor on touch devices
- **Route-transition wipe** between pages, **animated stat counters**, **word-by-word headline reveals**
- **Pinned "Our Promise" scroll-telling** (source → fire → plate, with a camera-push crossfade) and a global **paper-grain texture**

---

## ✨ Features

### Guest experience
- **Cinematic hero** with a live WebGL scene (morphing glossy centerpiece, orbiting orbs, sparkles) layered over a parallax dining photo
- **Parallax scrolling** throughout (Lenis smooth-scroll + Framer Motion scroll transforms)
- **Interactive 3D menu gallery** — a draggable / scrollable coverflow carousel of dishes (drag, wheel, dot-nav)
- **3D tilt dish cards** that lift toward the pointer
- **Cart system** with a slide-in drawer, quantity controls, order-type switch (Delivery / Pickup / Dine-in) and `localStorage` persistence
- **Secure checkout** via Stripe Checkout (test mode) — with a graceful **simulated fallback** when no Stripe keys are set, so the full flow works out of the box
- **Reservations** with date/time/party-size/occasion and instant confirmation
- **Haptic feedback** (Web Vibration API) on key interactions, paired with visual micro-feedback
- Confetti celebration on order success, animated toasts, magnetic buttons
- Fully **responsive** + respects `prefers-reduced-motion`

### Admin console (`/admin`)
- **JWT cookie auth** (httpOnly), bcrypt-hashed passwords
- **Real-time dashboard** — revenue, orders, avg order value, active orders, reservations + live charts (Recharts): 14-day revenue area chart, status pie, top-dishes bar. Auto-refreshes every 5s
- **Live order board** — filter by status, advance orders through the kitchen pipeline (Paid → Preparing → Ready → Completed), cancel. Auto-refreshes every 4s
- **Menu manager** — full CRUD with an image-preview editor modal, quick-toggle featured/availability
- **Reservations manager** — confirm / seat / cancel

---

## 🚀 Getting started

```bash
# 1. Install dependencies
npm install

# 2. Create your env file
cp .env.example .env        # (Windows PowerShell: Copy-Item .env.example .env)

# 3. Set up the database (creates SQLite db, runs migrations, seeds data)
npm run setup

# 4. Start the dev server
npm run dev
```

Open **http://localhost:3000**.

### Admin login
Visit **http://localhost:3000/admin** and sign in with the seeded credentials
(also pre-filled on the login form):

```
email:    admin@foddo.dev
password: foddo-admin
```

> Change `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `AUTH_SECRET` in `.env` and re-run
> `npm run db:reset` before deploying anywhere.

---

## 💳 Stripe (optional)

The app runs in **simulated payment mode** with no configuration — orders are created and
marked paid instantly so you can test the entire flow.

To enable **real Stripe test payments**:

1. Get your test keys from https://dashboard.stripe.com/test/apikeys
2. Add them to `.env`:
   ```env
   STRIPE_SECRET_KEY="sk_test_..."
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
   ```
3. (For order confirmation webhooks) run the Stripe CLI:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```
   Copy the printed `whsec_...` into `STRIPE_WEBHOOK_SECRET` in `.env`.
4. Use Stripe's test card `4242 4242 4242 4242`, any future expiry, any CVC.

---

## 🗂️ Project structure

```
prisma/
  schema.prisma          # Category, MenuItem, Order, OrderItem, Reservation, AdminUser
  seed.ts                # 6 categories, 18 dishes, admin user, sample orders/reservations
src/
  app/
    page.tsx             # Landing (hero, parallax sections)
    menu/                # Full menu + 3D feature carousel
    reservations/        # Booking form
    checkout/            # Checkout + /success
    admin/
      login/             # Public admin login
      (protected)/       # Guarded: dashboard, orders, menu, reservations
    api/                 # checkout, stripe/webhook, reservations, admin/*
  components/
    three/               # HeroScene, MenuGallery3D (R3F) + dynamic wrappers
    sections/            # Hero, About, SignatureDishes, Delivery, Testimonials, CTA…
    cart/                # CartDrawer, ClearCartOnMount
    admin/               # AdminShell, Dashboard, OrdersBoard, MenuManager, ReservationsManager
    ui/                  # DishCard, AddToCartButton, Reveal, Magnetic, Confetti
  lib/
    prisma.ts stripe.ts auth.ts guard.ts data.ts utils.ts haptics.ts types.ts
    usePolling.ts        # client polling hook for "real-time" admin
    store/cart.ts        # Zustand cart store (persisted)
```

---

## 🛠️ Useful scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build (also runs `prisma generate`) |
| `npm run setup` | `db push` + seed |
| `npm run db:reset` | Wipe + re-seed the database |
| `npm run db:studio` | Open Prisma Studio (visual DB browser) |
| `npm run db:seed` | Re-seed only |

---

## 🎨 Images

Dishes use curated **Unsplash** photography out of the box. To use your own AI-generated or
custom images, see **[IMAGE-PROMPTS.md](./IMAGE-PROMPTS.md)** — it includes ready-to-paste
prompts and a list of free image-generation services. Swap URLs in the seed file or live in
the **Admin → Menu** editor.

---

## 🐘 Switching to PostgreSQL (production)

1. In `prisma/schema.prisma` change `provider = "sqlite"` → `provider = "postgresql"`.
2. Set `DATABASE_URL` to your Postgres connection string.
3. Run `npm run db:push && npm run db:seed`.

---

## 📦 Tech notes
- 3D scenes load **client-only** via `next/dynamic({ ssr: false })` so SSR stays fast.
- All money math is **recomputed server-side** at checkout from DB prices — client prices are never trusted.
- SQLite has no enums; status/type fields are strings validated against the unions in `src/lib/types.ts`.
- The admin "real-time" feel uses lightweight interval polling (`usePolling`) — swap for websockets/SSE later if desired.

Enjoy — and bon appétit. 🍷
