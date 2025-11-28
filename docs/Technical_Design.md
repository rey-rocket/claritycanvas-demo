# ClarityCanvas – Technical Design (MVP)

This document describes the technical design for the ClarityCanvas MVP in the
TypeScript/React stack.

---

## 1. Architecture Overview

- **Framework:** Next.js 14 (App Router, React 18, TypeScript)
- **Runtime:** Node.js (e.g., Vercel, Render)
- **Database:** Supabase-hosted PostgreSQL
- **ORM:** Prisma
- **Domain Logic:** Pure TypeScript modules in `domain/`
- **Data Access:** Repository modules in `data/` wrapping Prisma
- **Styling:** TailwindCSS
- **Auth:** To be added later (Supabase Auth or NextAuth)
- **AI Integration:** Next.js route handler under `app/api/notes/summarize`

The app is a monolith: one codebase, one deployable unit.

---

## 2. Data Model

Defined in `prisma/schema.prisma`:

- `User` – basic app user
- `Team` / `TeamUser` – team membership
- `Project` – instructional design project
- `Task` – project task
- `DesignerCapacity` – weekly hours per designer per team
- `ProjectStatus` enum – project status

Indexes support common queries (by team, status, due date, project).

---

## 3. Domain Layer (`domain/`)

Domain logic is fully decoupled from React, Next.js, and Prisma client. It
encodes all business rules:

- `domain/workload.ts`:
  - Calculates per-designer and team-level workload.
- `domain/risk.ts`:
  - Flags projects as over-budget or at-risk.
- `domain/focus.ts`:
  - Picks a single focus project per designer.

Keeping these functions pure makes them easy to test and reuse in exports,
reports, and APIs.

---

## 4. Data Layer (`data/`)

The data layer wraps Prisma queries and presents a small API to the rest of the
app:

- `data/projects.ts`:
  - `getAllProjects`
  - `getProjectsForTeam`
  - `getProjectById`
  - `createProject`
- `data/capacities.ts`:
  - `getAllDesignerCapacities`
  - `getDesignerCapacitiesForTeam`

Auth and team scoping will be enforced here later.

---

## 5. Next.js Layout & Pages

- `app/layout.tsx`:
  - HTML shell with sidebar navigation.
- `app/page.tsx` (Dashboard):
  - Fetches projects & capacities via data layer.
  - Uses domain helpers to calculate workload and risk.
  - Renders:
    - Team workload summary
    - Designer workload
    - Designer focus cards
    - At-risk and over-budget projects
- `app/projects/page.tsx`:
  - Lists projects in a table with risk flags.
- `app/projects/[id]/page.tsx`:
  - Shows project details, tasks, notes, and risk info.
- `app/capacity/page.tsx`:
  - Lists designer capacity records.

All of these are Server Components, which fetch data on the server.

---

## 6. AI Summarization Endpoint

- `app/api/notes/summarize/route.ts`:
  - Accepts POST with `{ notes: string }`.
  - Returns a stubbed JSON structure:
    - `summaryPoints: string[]`
    - `suggestedTasks: string[]`
  - Intended to be replaced with a real AI provider integration using
    env-based API keys.

---

## 7. Auth & Security (Planned)

Authentication is not wired yet in the starter, but the design anticipates:

- Supabase Auth or NextAuth for user authentication.
- Session access via server helpers (e.g. `getServerSession`).
- Data layer functions scoping queries by `teamId` derived from session.

Environmental variables (`.env`) hold:

- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- AI provider keys

---

## 8. Performance & Scaling

- Server Components avoid an extra API hop for data fetching.
- Prisma and Supabase Postgres provide robust persistence.
- Indexes on `teamId`, `status`, `dueDate` support core queries.

Future enhancements:

- Add caching (`revalidate` or `revalidatePath`) for read-heavy data.
- Extract heavy exports or background tasks if needed.
- Implement row-level security on the DB as auth/team logic matures.

---

## 9. Extensibility

The current design allows:

- Adding forms via Server Actions without re-architecting.
- Plugging in auth and team scoping by updating data layer and adding guards.
- Extending domain logic with more nuanced rules (e.g. multi-week planning).
- Integrating external systems via additional APIs or data modules.

This MVP starter is deliberately small but aligned with a clean, easily extended
architecture.
