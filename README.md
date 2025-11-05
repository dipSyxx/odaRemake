# odaRemake

> A remake of Oda's public grocery delivery experience with a fully featured API built on Next.js 16 and Prisma.

## Overview

`odaRemake` is a learning-focused full-stack app that recreates Oda’s marketing site, authentication screens, and backend for managing the product catalog, carts, and users. The project showcases how Next.js App Router, Prisma ORM, and NextAuth work together via Server Actions and API Routes.

## Highlights

- Animated home page featuring banners, recipes, benefits, and calls-to-action powered by shared `framer-motion` presets.
- Responsive header with search, dark/light theme toggle, and a live cart preview managed through a Zustand store.
- Login and registration pages with `react-hook-form` + `zod` validation and a NextAuth credentials provider (bcrypt password hashing).
- REST API for products, users, and carts with rich validation schemas, Prisma Decimal serialization, and consistent error handling.
- PostgreSQL schema with products, discounts, promotions, and demo seed data mirroring the Oda catalog.
- Token-based Tailwind CSS 4 theme with `localStorage` persistence and Vercel Analytics integration out of the box.

## Tech Stack

- Next.js 16 (App Router) + React 19
- TypeScript 5, ESLint
- Tailwind CSS 4, `tw-animate-css`, custom design tokens
- Prisma ORM + PostgreSQL
- NextAuth.js 4 (JWT session strategy)
- Zustand, React Hook Form, Zod
- Radix UI / shadcn components, Framer Motion, Lucide Icons
- Vercel Analytics

## Getting Started

### Prerequisites

- Node.js ≥ 20.0.0 (20.18 LTS recommended)
- `pnpm` ≥ 9 (`pnpm-lock.yaml` is committed)
- Running PostgreSQL instance

### Local Development

1. Install dependencies: `pnpm install`.
2. Create a `.env` file, copy the variables listed below, and fill in your PostgreSQL connection and NextAuth secrets.
3. Sync the schema: `pnpm prisma db push`.
4. Seed demo data: `pnpm prisma db seed` (creates sample users, products, discounts, and carts).
5. Start the dev server: `pnpm dev` and open `http://localhost:3000`.

> **Tip:** After changing the Prisma schema, rerun `pnpm prisma db push` and, if needed, `pnpm prisma db seed`.

## Environment Variables

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Primary Prisma connection string for PostgreSQL (pooled). |
| `POSTGRES_URL_NON_POOLING` | Direct (non-pooling) URL for migrations and `prisma db push`. |
| `NEXTAUTH_URL` | Base application URL used by NextAuth for callback generation. |
| `NEXTAUTH_SECRET` | Secret for signing NextAuth JWT sessions. |
| `AUTH_SECRET` | Mirror of the NextAuth secret for middleware compatibility. |

Optional `PG*` and `POSTGRES_*` values can stay for Vercel or Prisma Accelerate setups, but for local work the keys above are sufficient.

## Database & Prisma

- The schema in `prisma/schema.prisma` covers `User`, `Cart`, `CartItem`, `Product`, `ProductImage`, `ProductClassifier`, `Discount`, and `Promotion`, plus enums describing cart and promotion states.
- `prisma/seed.ts` ingests realistic products, discounts, and carts, transforming raw data into Prisma structures and rebuilding related collections (images, classifiers, promotions).
- `prisma/prisma-client.ts` implements a singleton client to prevent connection churn during development.
- `prisma.config.ts` hooks into the classic migration engine and loads `DATABASE_URL` via `dotenv`.

## API

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/api/products` | Lists products with pagination and search (`search`, `skip`, `take`). |
| `POST` | `/api/products` | Creates a product with related images and promotions (validated by `productCreateSchema`). |
| `GET` | `/api/products/:id` | Returns detailed product info. |
| `PUT` | `/api/products/:id` | Partially updates a product and its relations (rebuilds nested collections). |
| `DELETE` | `/api/products/:id` | Removes a product. |
| `GET` | `/api/carts` | Lists carts with optional `userId`, `status`, and pagination parameters. |
| `POST` | `/api/carts` | Creates a cart with optional user link or initial items. |
| `GET / PUT / DELETE` | `/api/carts/:id` | Fetches, updates, or deletes a cart and recomputes totals as needed. |
| `POST` | `/api/carts/:id/items` | Upserts a cart item (adds or replaces quantities/prices). |
| `PATCH / DELETE` | `/api/carts/:id/items/:itemId` | Updates or removes a cart item and syncs totals. |
| `GET` | `/api/users` | Lists users with search and pagination. |
| `POST` | `/api/users` | Creates a user, hashing the password with bcrypt. |
| `GET / PUT / DELETE` | `/api/users/:id` | Manages an individual user. |
| `GET` | `/api/me` | Returns the current user profile and active cart based on the JWT session. |
| `GET / POST` | `/api/auth/[...nextauth]` | NextAuth credential routes. |

Validation is handled with Zod, and responses are serialized via `lib/serializers.ts` to convert Prisma `Decimal` values to numbers and format dates as ISO strings.

## Project Structure

- `app/` – App Router pages, global layout, and providers (`layout.tsx`, `providers.tsx`, `app/(auth)`).
- `components/shared/` – composite UI blocks (header, footer, landing sections).
- `components/ui/` – Radix/shadcn-inspired UI primitives tailored to Tailwind 4.
- `hooks/` – custom hooks, most notably `use-user-store.ts` (Zustand) for user and cart state.
- `lib/` – helper utilities: NextAuth options (`auth.ts`), theme provider (`theme-provider.tsx`), motion presets, API serializers.
- `prisma/` – schema, client wrapper, and database seeders.
- `public/` – static assets and illustrations, including authentication artwork.
- `styles/` – global styles and Tailwind tokens.
- `types/next-auth.d.ts` – NextAuth type augmentation exposing `user.id` on the session.

## UI & Frontend

- The header (`components/shared/header.tsx`) combines search, theme toggle, mini-cart drawer, and adaptive navigation.
- Landing sections (`components/shared/home`) share animation presets (`lib/motion-presets.ts`) and Tailwind tokens.
- Auth screens rely on `react-hook-form` + `zodResolver`, display themed illustrations (`public/images/login-image-*.svg`), and call NextAuth `signIn`.
- The global provider (`app/providers.tsx`) wires `SessionProvider`, `ThemeProvider`, and hydrates the Zustand store via `fetch /api/me`.

## Scripts

- `pnpm dev` – start the Next.js dev server.
- `pnpm build` – production build (`next build`).
- `pnpm start` – run the compiled app.
- `pnpm lint` – execute ESLint.
- `pnpm prisma db push` or `pnpm prisma migrate deploy` – sync schema changes with the database.
- `pnpm prisma db seed` – apply seed data (also triggered by `pnpm postinstall`).

## Quality Checks

- `tsconfig.json` targets Next 16 and React 19. Because `next.config.mjs` currently ignores build-time TS errors, rely on IDE diagnostics or run `tsc --noEmit` manually.
- ESLint covers the entire project; run `pnpm lint` before committing.

## Next Steps (Ideas)

- Add e2e tests for key cart flows (e.g., with Playwright).
- Wire the product search UI to the `/api/products` endpoint for real filtering.
- Expand NextAuth with social providers and protect API routes via middleware.
