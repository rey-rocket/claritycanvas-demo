# ClarityCanvas – Implementation Plan (MVP)

This plan assumes a small team (1–3 engineers). Durations are indicative and can
be adjusted.

---

## Phase 1 – Project Setup & Infrastructure (1–2 days)

- [ ] Initialize Next.js App Router + TypeScript project
- [ ] Add TailwindCSS and confirm styling
- [ ] Set up Supabase project and Postgres instance
- [ ] Configure `DATABASE_URL` from Supabase in `.env`
- [ ] Add Prisma and run initial `prisma migrate dev`
- [ ] Confirm DB connection by seeding a test row

**Deliverable:** Running app with DB, blank pages, and working Prisma.

---

## Phase 2 – Core Data Model & Basic Views (3–5 days)

- [ ] Implement Prisma models: User, Team, TeamUser, Project, Task, DesignerCapacity
- [ ] Generate Prisma client and run migrations
- [ ] Seed DB with sample team, projects, and capacities
- [ ] Build basic pages:
  - [ ] `/` (Dashboard) – simple placeholder
  - [ ] `/projects` – list all projects
  - [ ] `/projects/[id]` – show project details
  - [ ] `/capacity` – list capacities

**Deliverable:** Read-only end-to-end flow from DB → UI.

---

## Phase 3 – Domain Logic & Dashboard (3–5 days)

- [ ] Implement domain helpers:
  - [ ] `calculateTeamWorkload`
  - [ ] `calculateRiskFlags`
  - [ ] `selectFocusProjectForDesigner`
- [ ] Wire dashboard to domain helpers:
  - [ ] Team workload summary cards
  - [ ] Designer workload cards
  - [ ] Designer focus section
  - [ ] At-risk & over-budget section
- [ ] Add basic visual differentiation for risk/budget badges

**Deliverable:** Dashboard accurately reflects derived metrics.

---

## Phase 4 – Forms, Mutations & UX Polish (4–6 days)

- [ ] Integrate `react-hook-form` + `zod` for validation
- [ ] Add project create form (server actions or API route)
- [ ] Add basic project edit functionality (status, hours worked, notes)
- [ ] Add capacity edit form on `/capacity`
- [ ] Add filtering in `/projects` (by designer, status)
- [ ] Add loading/error states in key views

**Deliverable:** Managers can create/update projects and capacities via the UI.

---

## Phase 5 – Auth & Team Scoping (3–5 days)

- [ ] Enable Supabase Auth or NextAuth
- [ ] Protect app routes to require login
- [ ] Associate users with teams (TeamUser)
- [ ] Scope all queries in `data/` layer to the current team
- [ ] Add minimal “Current team” switcher (optional)

**Deliverable:** Only authenticated users see data, with team-level isolation.

---

## Phase 6 – Reporting & Export (2–3 days)

- [ ] Define CSV schema for:
  - [ ] Summary (projects, scoped vs worked hours)
  - [ ] Designer breakdown
- [ ] Implement export logic (client-side or API route)
- [ ] Add export UI (time range selector + download button)
- [ ] Validate exported CSV in Excel/Sheets

**Deliverable:** Managers can generate basic capacity and project summary reports.

---

## Phase 7 – AI Summarization (Stretch, 2–4 days)

- [ ] Implement real AI integration in `app/api/notes/summarize/route.ts`
- [ ] Use env-based keys (Gemini/OpenAI)
- [ ] Add "Summarize notes" button on project detail page
- [ ] Display returned summary points and suggested tasks
- [ ] Allow one-click conversion of suggested tasks into project tasks
- [ ] Handle errors/timeouts gracefully

**Deliverable:** Optional AI-assisted note summarization and task creation.

---

## Phase 8 – Hardening & Pilot (3–5 days)

- [ ] Add unit tests for domain logic (`domain/`)
- [ ] Add lightweight integration tests for key flows
- [ ] Review security and env configuration (secrets, auth)
- [ ] Conduct pilot with 1–2 teams
- [ ] Collect feedback, log issues, and prioritize fixes

**Deliverable:** Pilot-ready MVP with basic robustness and observability.
