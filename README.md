# Hap’n! Web App (Client‑Only MVP)

A mobile‑first web marketplace that connects Davao MSMEs with consumers. This MVP runs entirely in the browser (no external database or server) and mirrors the business plan’s core flows and UI.

## Quick Start

1. Install dependencies  
   `npm install`
2. Start dev server  
   `npm run dev` → open the printed localhost URL
3. Build for production  
   `npm run build` then `npm run preview`

## Tech Stack

- React + TypeScript + Vite
- React Router
- IndexedDB (browser built‑in) for all persistence

## Demo Accounts

- Admin + consumer: `admin@hapn.local` / `admin123`
- Consumer: `customer@hapn.local` / `123456`
- Merchant + consumer: `merchant@hapn.local` / `123456`
- Rider + consumer: `rider@hapn.local` / `123456`

You can also register new accounts and select roles during sign‑up.

## Features

- Splash and Welcome with CTA buttons (register, log in, guest)
- Auth (register/login) with single account, multi‑role (consumer/merchant/rider)
- Role switching in Profile with “current mode” indicator
- Home feed:
  - Upcoming Events section
  - Category sections: Food & Beverage, Clothing & Apparel, Stationery
- Cart & Checkout:
  - Add to cart, totals, voucher codes (`HAPN50`, `WELCOME10`)
  - Delivery fee calculator (base + per‑km after 6 km)
  - Simulated checkout creates an order and clears cart
- Orders:
  - Profile shows order history and status progression (placed → preparing → enroute → delivered)
- Merchant console (MVP scaffolds):
  - Business Registration form
  - Statistics page with items and totals
- Rider console (MVP scaffold): tasks placeholder, ready for assignments

## Architecture (No Server)

All data is stored in the browser using IndexedDB:

- `users` (with `roles` and `activeRole`)
- `products`, `events`
- `cart`, `orders`

Seeding runs on first load to populate demo accounts, products, and events.

## Design System

- Colors: `#AF1C1C` (red), `#B10100` (dark crimson), `#880000` (dark red), `#F8F5F6` (light grayish pink)
- Typography: Poppins + Lato (web fonts). Rounded buttons and inputs to match mockups.
- Logo: inline SVG mark + “hap’n!” wordmark in header.

## Scripts

- `npm run dev` – starts Vite dev server
- `npm run build` – typecheck and create production build
- `npm run preview` – serve the built app locally

## Project Structure

```
src/
  components/Logo.tsx
  data/db.ts           # IndexedDB wrapper (users, roles, products, cart, orders, events)
  lib/pricing.ts       # vouchers and delivery fee helpers
  pages/               # Splash, Welcome, Login, Register, Home, Cart, Calendar, Profile,
                       # MerchantRegister, Statistics, Rider
  styles/theme.css
  App.tsx, main.tsx
```

## Roadmap

- Merchant product CRUD (client‑only) with local image uploads
- Rider task assignments and status updates
- Reviews/ratings (post‑delivery only) with abuse controls
- Fair feed rotation (visibility quotas per merchant)

## Notes

- This is a client‑only MVP for demo and validation. Payments, real riders, and server‑side security will be added when the backend is introduced.

