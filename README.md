## Project Overview

**MyIndustry** is a full-stack manufacturing/industrial product management system. It manages products and raw materials, with a production suggestion engine that calculates optimal manufacturing based on available inventory.

## Architecture

Monorepo with two sub-projects:

- `frontend/` — React 19 SPA (TypeScript + Vite)
- `backend/` — Spring Boot REST API (Java 25)
- `docker-compose.yml` — Orchestrates PostgreSQL, pgAdmin, backend, and frontend

### Backend (Spring Boot, port 3000)

Layered architecture: Controller → Service → Repository (JPA) → PostgreSQL

- **Controllers**: `ProductController`, `RawMaterialController`, `ProductRawMaterialController`, `ProductionController`
- **Services**: Business logic including the production suggestion algorithm
- **Entities**: `Product`, `RawMaterial`, `ProductRawMaterial` (join table)
- **Migrations**: Flyway in `src/main/resources/db/migration/`
- Prices are stored as **integers (cents)** to avoid floating-point errors

**Production Suggestion Algorithm** (`ProductRawMaterialService.suggestProduction()`): Iterates products ordered by price descending, calculates max producible units per product based on available stock (stock is NOT shared/deducted between products), and returns the list sorted by unit price descending

### Frontend (React 19 + Vite, port 5173)

- **Router**: TanStack Router — routes defined in `frontend/src/router.tsx`
  - `/` — Main tabbed page (Products tab + Raw Materials tab)
  - `/products/$productId` — Product detail page
- **State**: React `useState` + Context API (`ProductActionsContext`);
- **API calls**: Native `fetch` — base URL from `VITE_API_URL` env var, defined in `frontend/src/lib/api.ts`
- **UI**: shadcn/ui (Radix primitives) + Tailwind CSS 4
- **Forms**: React Hook Form + Zod validation
- **Tables**: TanStack Table with pagination and name filtering (300ms debounce)
- **Notifications**: Sonner toasts

**Key component structure:**

```
src/
├── App.tsx                   # Root with tab layout
├── router.tsx                # Route definitions
├── lib/api.ts                # API_URL constant
├── types/                    # TypeScript types (Product, RawMaterial, Page, etc.)
├── components/ui/            # shadcn primitives (do not edit these directly)
├── components/product/       # Product tab, detail page, table, CRUD dialogs
└── components/rawmaterial-table/  # Raw material tab, table, CRUD dialogs
```

### Database Schema

| Table                  | Key Columns                                                        |
| ---------------------- | ------------------------------------------------------------------ |
| `product`              | `id` (UUID PK), `name` VARCHAR(200), `price` INTEGER (cents)       |
| `raw_material`         | `id` (UUID PK), `name` VARCHAR(200), `stock_quantity` INTEGER      |
| `product_raw_material` | `product_id` FK, `raw_material_id` FK, `required_quantity` INTEGER |

## Development Commands

### Frontend

```bash
cd frontend
bun install          # Install dependencies (project uses Bun, not npm)
bun run dev          # Start dev server (http://localhost:5173)
bun run build        # TypeScript check + Vite production build
bun run lint         # ESLint
bun run preview      # Preview production build locally
```

E2E tests (Cypress):

```bash
cd frontend
bunx cypress open    # Interactive test runner
bunx cypress run     # Headless run
```

### Backend

```bash
cd backend
./mvnw spring-boot-run          # Run locally (requires PostgreSQL)
./mvnw test                     # Run all tests (uses H2 in-memory DB)
./mvnw test -Dtest=ClassName    # Run a single test class
./mvnw package                  # Build JAR
```

### Full Stack (Docker)

```bash
docker compose up --build       # Build and start all services
docker compose up -d            # Start in background
docker compose down             # Stop all services
```

## Environment Variables

| Variable       | Location                                | Purpose              |
| -------------- | --------------------------------------- | -------------------- |
| `VITE_API_URL` | `frontend/.env.development` / build arg | Backend API base URL |

- Development default: `http://localhost:3000`
- Production: passed as Docker build argument `VITE_API_URL` to the frontend image

## REST API Endpoints

- `GET /products?page=0&size=10&name=` — Paginated product list
- `POST /products` — Create product
- `PUT /products/{id}` — Update product
- `DELETE /products/{id}` — Delete product
- `GET /raw-materials` — Raw material list (similar CRUD pattern)
- `GET /production/suggestion` — Production suggestion engine result
- `GET/POST/DELETE /products/{id}/raw-materials` — Manage product-material associations
