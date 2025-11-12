# odaRemake

> A remake of Oda's public grocery delivery experience with a fully featured API built on Next.js 16 and Prisma.

## Overview

`odaRemake` is a learning-focused full‑stack app that recreates Oda's marketing site, authentication flow, and backend for managing the product catalog, categories, carts, orders, and users. The project demonstrates how the Next.js App Router, Prisma ORM, and NextAuth integrate via Server Actions and API Routes to deliver a cohesive grocery shopping journey.

## Highlights

- Animated landing page sections (hero, benefits, recipes, delivery) powered by shared `framer-motion` presets.
- Responsive header with search, dark/light theme toggle, improved mini-cart drawer (quantity controls, remove buttons, thumbnails), and category popover/sheet fed by lazy API calls.
- Dynamic category browsing (`/kategorier/[slug]`) with pagination, sorting, search, child-category chips, and inline “Legg i handlekurv” actions.
- Complete cart → checkout → order-success flow implemented with a reusable `useCartActions` hook that persists cart IDs and talks to the REST API.
- Authentication screens built with `react-hook-form` + `zodResolver` and a NextAuth credentials provider (bcrypt hashing).
- REST API for products, categories, carts, orders, and users with Zod validation, Prisma Decimal serialization, and consistent error responses.
- PostgreSQL schema with realistic seed data for products, promotions, discounts, carts, and banners.
- Tailwind CSS 4 design tokens, theme persistence, and Vercel Analytics baked in.

## Tech Stack

- Next.js 16 (App Router) + React 19
- TypeScript 5, ESLint
- Tailwind CSS 4, `tw-animate-css`, custom token system
- Prisma ORM + PostgreSQL
- NextAuth.js 4 (JWT strategy)
- Zustand, React Hook Form, Zod
- Radix UI / shadcn components, Framer Motion, Lucide Icons
- Vercel Analytics

## Getting Started

### Prerequisites

- Node.js ≥ 20.0.0 (20.18 LTS recommended)
- `pnpm` 9 (lockfile committed)
- Running PostgreSQL instance

### Local Development

1. Install dependencies: `pnpm install`.
2. Copy `.env.example` to `.env` (or create one) and fill in the variables listed below.
3. Sync the schema: `pnpm prisma db push`.
4. Seed demo data: `pnpm prisma db seed`.
5. Start the dev server: `pnpm dev` and open `http://localhost:3000`.

> After changing the Prisma schema, rerun `pnpm prisma db push` (and optionally `pnpm prisma db seed`) to refresh the local database.

## Environment Variables

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Primary Prisma connection string for PostgreSQL (pooled). |
| `POSTGRES_URL_NON_POOLING` | Direct (non-pooling) URL for Prisma CLI operations. |
| `NEXTAUTH_URL` | Base application URL used by NextAuth for callbacks. |
| `NEXTAUTH_SECRET` / `AUTH_SECRET` | Secret for signing JWT sessions. |

Optional `PG*` / `POSTGRES_*` keys can remain for hosting providers, but the variables above are sufficient for local work.

## Database & Prisma

- `prisma/schema.prisma` defines users, products, images, classifiers, discounts, promotions, categories, carts, cart items, orders, and enums describing statuses.
- `prisma/seed.ts` rebuilds all relations (images, promotions, categories, banners) to deliver a realistic grocery catalog.
- `prisma/prisma-client.ts` exposes a singleton Prisma client to avoid connection churn in development.
- `prisma.config.ts` wires Prisma CLI to load the `.env` file automatically.

## API Surface

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/api/products` | List products with pagination, search, and category filtering. |
| `POST` | `/api/products` | Create a product plus nested images/promotions (`productCreateSchema`). |
| `GET / PUT / DELETE` | `/api/products/:id` | Retrieve or mutate a single product (rebuilds nested relations). |
| `GET` | `/api/categories` | List categories with optional parent filters, search, and product eager-loading. |
| `POST` | `/api/categories` | Create a category (supports parent assignment). |
| `GET / PUT / DELETE` | `/api/categories/:id` | Manage categories by ID. |
| `GET` | `/api/categories/slug/:slug` | Fetch a category via slug, optionally returning children and first N products. |
| `GET` | `/api/carts` | List carts with optional `userId`, `status`, and pagination. |
| `POST` | `/api/carts` | Create a cart (guest or linked to a user). |
| `GET / PUT / DELETE` | `/api/carts/:id` | Fetch, update, or delete a cart; totals are kept in sync. |
| `POST` | `/api/carts/:id/items` | Upsert cart items (quantity merges). |
| `PUT / DELETE` | `/api/carts/:id/items/:itemId` | Update or remove a specific cart item. |
| `GET` | `/api/orders` | List orders with `userId`, `status`, and `paymentStatus` filters. |
| `POST` | `/api/orders` | Create an order, optionally hydrating from an existing cart. |
| `GET / PUT` | `/api/orders/:id` | Retrieve or update an order's status/payment info. |
| `GET` | `/api/users` | List users with search + pagination. |
| `POST` | `/api/users` | Create a user (bcrypt password hashing). |
| `GET / PUT / DELETE` | `/api/users/:id` | Manage a single user. |
| `GET` | `/api/me` | Return the current session user and their active cart. |
| `GET / POST` | `/api/auth/[...nextauth]` | NextAuth credential/provider routes. |

Validation is handled with Zod. Responses are serialized through `lib/serializers.ts` to convert Prisma `Decimal` values to numbers and emit ISO dates.

## Project Structure

- `app/` – App Router pages, layouts, and route groups (auth, admin, produkter, kategorier, kasse, etc.).
- `components/shared/` – Composite UI (header, footer, home sections, categories popover).
- `components/ui/` – Radix/shadcn-inspired primitives tailored for Tailwind 4.
- `hooks/` – Custom hooks such as `use-user-store` (Zustand) and `use-cart-actions` (cart persistence + API helpers).
- `lib/` – Auth config, theme provider, motion presets, utilities, API serializers, validators.
- `prisma/` – Schema, client wrapper, seed script, Prisma config.
- `public/` – Static images/illustrations.
- `styles/` – Global CSS / token definitions.
- `types/` – NextAuth session augmentation (`user.id`, `isAdmin`).

## UI & Frontend Notes

- The header combines navigation, search, theme toggle, lazy categories popover (desktop + mobile sheet), and the enhanced cart drawer.
- Category detail pages pull products via the `/api/products` endpoint, show child-category quick links, and allow adding items to the cart from the listing grid.
- Checkout (`app/kasse/page.tsx`) collects shipping/billing details, calls the orders API, and redirects to `app/kasse/suksess/page.tsx`, which fetches the created order.
- Global providers (`app/providers.tsx`) wire `SessionProvider`, `ThemeProvider`, and hydrate the Zustand store by calling `/api/me` on mount.

## Scripts

- `pnpm dev` – Start Next.js in development mode.
- `pnpm build` – Production build (`next build`).
- `pnpm start` – Run the compiled app.
- `pnpm lint` – ESLint.
- `pnpm prisma db push` – Sync schema to the database.
- `pnpm prisma migrate deploy` – Run generated migrations.
- `pnpm prisma db seed` – Seed demo data (also runs on `postinstall`).

## Quality Checks & Tips

- `tsconfig.json` targets Next 16/React 19. `next.config.mjs` currently ignores build-time TS errors, so rely on IDE diagnostics or run `tsc --noEmit` manually if needed.
- ESLint covers the repo; run `pnpm lint` before committing (install `eslint` locally if your environment doesn't provide it).
- Cart/order flows are fully testable via the exposed REST API—feel free to script e2e tests (e.g., Playwright) around `/kategorier/[slug]`, `/kasse`, and `/kasse/suksess`.
