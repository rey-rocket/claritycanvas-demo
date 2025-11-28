# ClarityCanvas – Product Requirements Document (MVP)

**Product:** ClarityCanvas  
**Version:** v1.0 – MVP  
**Owner:** Founder / Product  
**Last updated:** YYYY-MM-DD  

---

## 1. Overview

### 1.1 Summary

ClarityCanvas is a **capacity and risk dashboard for instructional design (ID) teams**. It replaces scattered spreadsheets and manual status reports with a single, live view of:

- Active projects
- Who is over / under capacity
- Which projects are over budget or at risk
- Which project each designer should prioritize

The MVP is a **web app** built as a **full-stack TypeScript monolith** using Next.js and PostgreSQL.

### 1.2 Vision

To become the **source of truth for instructional design workload**, enabling managers and designers to make better weekly decisions with:

- Clear visibility of work-in-progress
- Early warning on risk
- Simple, opinionated tools instead of complex PM suites

### 1.3 MVP Objective

Enable a small ID team (3–15 designers) and their manager to:

- Track core project information
- Set weekly capacity per designer
- See team & individual workload at a glance
- Quickly spot risky and over-budget projects
- Decide what each designer should focus on this week

---

## 2. Problem & Goals

### 2.1 Problems Today

- Work scattered across **spreadsheets, email, chat, and project tools**.
- No single view of who is **overloaded vs under-utilized**.
- Risky projects (e.g., over budget, close to due date) are **discovered late**.
- Managers spend hours compiling updates into reports/presentations.
- Designers lack a clear, consistent **weekly focus**.

### 2.2 Goals (MVP)

1. **Visibility:**  
   Provide a single dashboard that shows projects, designer workload, and risk.

2. **Risk Detection:**  
   Automatically flag projects that are over-budget or at-risk based on simple rules.

3. **Focus:**  
   Surface **one primary focus project per designer** based on risk and urgency.

4. **Low Friction:**  
   Minimal setup (no complex configuration). A team should be productive **within a day** of adoption.

### 2.3 Non-goals (MVP)

- Detailed time-tracking or full timesheet replacement.
- Complex role-based access control (RBAC) or multi-org hierarchies.
- Advanced analytics (historical trends, forecasting, multi-team rollups).
- Deep integrations (Jira, Asana, LMS, Slack, etc.).
- Native mobile apps.

---

## 3. Users & Personas

### 3.1 Primary Personas

#### Instructional Design Manager

- Oversees a team of IDs, often 3–15 people.
- Responsible for delivery, quality, and on-time completion.
- Needs to balance workloads and mitigate risk.
- Uses dashboard multiple times per week (especially at start of week).

**Key needs:**

- Who is over/under capacity this week?
- Which projects are at risk or over budget?
- Where do I need to intervene or re-balance work?

#### Instructional Designer

- Works across multiple projects.
- Needs clarity on what to prioritize this week.
- Occasionally updates project status, hours, and notes.

**Key needs:**

- Which project should I focus on first?
- What’s expected this week?
- Simple, non-bureaucratic updating of info.

### 3.2 Secondary (Future)

- Ops / PMO / leadership for cross-team dashboards and longer-term analytics.

---

## 4. Key User Flows

### 4.1 Manager – Weekly Planning

1. Manager opens dashboard (`/`).
2. Sees:
   - Team capacity vs planned hours vs remaining.
   - Per-designer workload cards.
   - At-risk and over-budget project cards.
3. Adjusts designer capacity (e.g., PTO / part-time weeks).
4. Decides how to re-balance work (manual for MVP).

### 4.2 Manager – Project Risk Review

1. Manager navigates to `/projects`.
2. Scans the list with risk and budget flags.
3. Clicks into risky project (`/projects/[id]`) to read notes & tasks.
4. Takes follow-up action offline (chat, meeting, etc.).

### 4.3 Designer – Daily / Weekly Focus

1. Designer opens dashboard or designer-focused view.
2. Sees their **focus project** (selected by rules).
3. Optionally views other assigned projects and their status.
4. Uses project detail view to see tasks and notes.

### 4.4 Manager – Update Projects

1. Manager creates a new project (MVP: simple form).
2. Sets:
   - Title, client, designer, status, due date, scoped hours.
3. As work progresses, manager or designer updates:
   - Status, hours worked, notes.

### 4.5 Manager – Manage Capacity

1. Manager goes to `/capacity`.
2. Views list of designers and weekly available hours.
3. Updates a designer’s capacity for the upcoming period (MVP: inline edit or basic form).

---

## 5. Scope (MVP)

### 5.1 In Scope (Must / Should)

**Must-have:**

- Project model & basic CRUD:
  - Create and view from UI (update can be a second step).
- Designer capacity model & listing.
- Team workload calculation:
  - Per-designer capacity, planned hours, remaining hours.
- Risk flags:
  - Over-budget and at-risk project detection.
- Focus project selection per designer.
- Dashboard:
  - Team summary, designer workload, focus, risk.
- Persistent storage with managed Postgres.
- Basic authentication (even if simple to start in later iteration).

**Should-have:**

- Capacity editing via UI.
- Project status/hours/notes editing via UI.
- Filtering or simple search on `/projects` (by designer and status).
- Simple “friendly” styling and layout.

### 5.2 Could-have (Stretch)

- AI-powered notes summarization → suggested tasks.
- CSV export (summary + designer breakdown).
- Search by project title/client.

### 5.3 Out of Scope (Later Versions)

- SSO / enterprise auth.
- Multi-tenant enterprise setup with complex sharing models.
- Integration with third-party PM or HR tools.
- Real-time multi-user collaboration.

---

## 6. Functional Requirements

### 6.1 Projects

**FR-P1 – Project Creation**

- A user can create a project with:
  - `title` (string, required)
  - `client` (string, required)
  - `instructionalDesigner` (string, required)
  - `status` (enum: PLANNING, IN_PROGRESS, REVIEW, HANDOVER; required)
  - `dueDate` (date, required)
  - `estimatedScopedHours` (float, required)
  - `hoursWorked` (float, default 0)
  - `notes` (text, optional)
- Project is associated with a `Team`.

**FR-P2 – Project Listing**

- `/projects` displays:
  - Title
  - Client
  - Instructional designer
  - Status
  - Due date
  - Risk/budget flags (over-budget, at-risk)
- Rows link to project detail.

**FR-P3 – Project Detail View**

- `/projects/[id]` displays:
  - All fields from FR-P1.
  - Derived risk/budget flags + human-readable reason.
  - Associated tasks (if any).
  - Notes in readable format.

**FR-P4 – Tasks (Simple)**

- Each task has:
  - `name` (string, required)
  - `completed` (boolean, default `false`)
  - `estimatedHours` (optional float – can be unused in MVP logic)
- Tasks are displayed in project detail.

**FR-P5 – Project Update (Should-have)**

- A user can update:
  - Status
  - Hours worked
  - Notes
- Changes are immediately reflected on dashboard and list pages.

---

### 6.2 Designer Capacity & Workload

**FR-C1 – Capacity Storage**

- Store per-designer capacity:
  - `designerName` (string)
  - `weeklyAvailableHours` (float)
  - `teamId` (foreign key)
- Each designer-team pair is unique.

**FR-C2 – Capacity Listing**

- `/capacity` shows a table with:
  - Designer name
  - Weekly available hours

**FR-C3 – Capacity Editing (Should-have)**

- User can update `weeklyAvailableHours` for a designer.

**FR-C4 – Workload Calculation**

For each designer:

- `capacity` = `weeklyAvailableHours` from table, or default (40) if none.
- `estimatedHours` = sum of `estimatedScopedHours` for **active** projects:
  - `status != HANDOVER`
- `hoursRemaining = capacity - estimatedHours`

For the team:

- `totalCapacity` = sum of designer capacities.
- `totalEstimatedHours` = sum of all designers’ `estimatedHours`.
- `totalHoursRemaining` = `totalCapacity - totalEstimatedHours`.

**FR-C5 – Workload Display**

- Dashboard shows:
  - Team summary (cards for total capacity, planned, remaining).
  - Per-designer cards:
    - Name
    - Capacity
    - Planned hours
    - Remaining hours
    - Active project count
    - Over/under capacity highlight (e.g., color).

---

### 6.3 Risk & Budget Logic

**FR-R1 – Over-budget Definition**

- A project is over budget if:
  - `hoursWorked > estimatedScopedHours`.

**FR-R2 – At-risk Definition**

- A project is at risk if **all** of the following are true:
  - Due date exists.
  - Due date is within `N` days (default 7).
  - `remainingHours = estimatedScopedHours - hoursWorked > M` (default 8).
  - Status is not HANDOVER.

**FR-R3 – Risk Reason**

- For over-budget:
  - Show a message like:  
    `Hours worked (X) exceed scoped hours (Y).`
- For at-risk:
  - Show a message like:  
    `Due in D day(s) with R hours remaining.`

**FR-R4 – Risk Display**

- `/` and `/projects` display badges:
  - “Over budget” (red)
  - “At risk” (amber)
- `/projects/[id]` display badges + reason text.

---

### 6.4 Focus Project Selection

**FR-F1 – Focus Algorithm**

For each designer:

1. Consider all non-HANDOVER projects for that designer.
2. Compute a score per project:
   - +100 if at-risk
   - +50 if over-budget
   - +`max(0, 30 - daysToDue)` (projects due sooner score higher)
3. Pick the project with the highest score as **focus project**.
4. If no active projects, focus project is `null`.

**FR-F2 – Focus Display**

- Dashboard shows a section “Designer Focus”:
  - Card per designer:
    - Designer name
    - Focus project title and due date (if any)
    - If none, message: “No active projects assigned.”

---

### 6.5 AI Summarization (Stretch)

**FR-AI1 – Notes Summarization Endpoint**

- POST `/api/notes/summarize`:
  - Input: `{ notes: string }`
  - Output: `{ summaryPoints: string[]; suggestedTasks: string[] }`
- Initial MVP can be stubbed; later wired to Gemini/OpenAI.

**FR-AI2 – UI Integration (Stretch)**

- On project detail:
  - “Summarize notes” button triggers backend call.
  - Show summary and suggested tasks.
  - Optionally allow one-click “Add as tasks”.

---

## 7. Technical Requirements

### 7.1 Stack & Architecture

- **Framework:** Next.js 14 (App Router, React 18, TypeScript)
- **Language:** TypeScript (strict mode)
- **Database:** PostgreSQL (hosted, e.g. Supabase)
- **ORM:** Prisma
- **Frontend styling:** TailwindCSS
- **State/data fetching:**
  - Prefer **Server Components** + direct Prisma access via data layer.
  - Client-side data management (React Query) only if needed later.
- **Auth:** Supabase Auth or NextAuth (MVP may start with simple or environment-scoped usage).
- **AI integration:** Simple Next.js route handler calling external AI API (key from environment).

### 7.2 Code Organization

- `app/` – Next.js routes and pages (App Router)
- `domain/` – pure business logic (workload, risk, focus)
- `data/` – Prisma-based repository functions
- `lib/` – shared utilities (e.g., Prisma client)
- `prisma/` – schema and migrations
- `docs/` – PRD, technical design, project plan

**Requirement:**  
All business rules must live in `domain/` so they can be tested and reused (e.g., exports, reports) without coupling to UI or DB.

### 7.3 Database Schema (High-level)

- `User`
- `Team`
- `TeamUser` (many-to-many)
- `Project`
- `Task`
- `DesignerCapacity`
- `ProjectStatus` enum

Indexes required:

- `Project.teamId`
- `Project.status`
- `Project.dueDate`
- `DesignerCapacity.teamId`
- `DesignerCapacity.teamId + designerName` (unique)

### 7.4 Non-Functional Requirements

**Performance**

- Dashboard load (for up to ~100 projects & ~20 designers):
  - Target: < 3 seconds time-to-interactive on typical broadband.
- Risk and workload calculations are run in-memory on server per request and must complete in < 200ms for dataset sizes expected in MVP.

**Availability**

- Target ~99% monthly uptime for MVP (service may be down occasionally for updates).
- Database backups configured (via Supabase or hosting provider defaults).

**Security**

- All secrets stored in environment variables.
- All non-public pages protected by authentication (post-MVP wiring).
- No direct SQL execution from user input; all access via Prisma.

**Maintainability**

- Strict TypeScript.
- Domain functions unit-tested.
- Clear separation between:
  - `domain/` (logic),
  - `data/` (DB),
  - `app/` (UI).

**Observability (Minimum)**

- Application logs for:
  - Unhandled errors.
  - AI summarization failures (when implemented).
- Basic error boundaries in UI.

---

## 8. Milestones & Measurable Steps to Success

### 8.1 Delivery Milestones

1. **M1 – Skeleton & Infrastructure (Setup Done)**
   - ✅ Next.js app running locally.
   - ✅ Tailwind integrated.
   - ✅ Prisma connected to Postgres (Supabase).
   - ✅ Initial schema migrated.

2. **M2 – Data Model & Read-only Views**
   - Projects, Tasks, DesignerCapacity models defined and migrated.
   - Seed script or manual data for:
     - 1 team, 5–10 projects, 3–5 designers.
   - `/projects` and `/projects/[id]` show data from DB.
   - `/capacity` lists designer capacities.

3. **M3 – Domain Logic & Dashboard**
   - `calculateTeamWorkload`, `calculateRiskFlags`, `selectFocusProjectForDesigner` implemented and unit-tested.
   - Dashboard:
     - Team summary cards.
     - Per-designer workload.
     - Focus projects.
     - At-risk & over-budget section.

4. **M4 – Basic Editing & UX**
   - Project create form (server action or API).
   - Ability to update project status, hours worked, notes.
   - Capacity editing for designers.
   - Basic empty/loading/error states.

5. **M5 – Auth & Scoping (Simple)**
   - Authentication wired (Supabase Auth or NextAuth).
   - Only authenticated users access app.
   - Queries scoped by team (for now, “current team” could be fixed or simple).

6. **M6 – Stretch**
   - AI summarization wired to real provider.
   - CSV export for a basic report (optional).
   - Ready for pilot with 1–2 real teams.

---

### 8.2 Product Success Metrics (MVP)

Within 4–8 weeks of onboarding first pilot teams:

1. **Activation & Adoption**
   - At least **2 pilot teams** actively using ClarityCanvas.
   - ≥ 70% of their active projects are represented in the system.

2. **Usage**
   - Managers:
     - Visit dashboard at least **2x per week**.
   - Designers:
     - At least **60% of designers** have at least 1 active project and capacity configured.
   - Projects:
     - ≥ 50% of projects have hours worked and status updated at least once per week.

3. **Data Health**
   - For piloting teams:
     - < 20% of projects have obviously stale data (e.g., overdue >14 days with 0 hours update).

4. **Qualitative Satisfaction**
   - Managers report:
     - **30%+ reduction** in time spent preparing status and capacity reports.
     - Clearer understanding of who is over/under capacity.

5. **Retention Signal**
   - After 6–8 weeks, at least **1 team** requests continued access and/or additional features (indication of real value and stickiness).

---

## 9. Open Questions & Risks

- **Data discipline:**  
  Will managers/designers reliably update hours and statuses? If not, we may need gentle nudges or simpler update patterns.

- **Effort granularity:**  
  Is project-level scoped hours enough, or will teams need task-level effort soon?

- **Auth & multi-tenancy scalability:**  
  How quickly do we need robust multi-team support beyond “one team per workspace”?

- **AI value:**  
  Does AI summarization of notes materially improve workflows, or is it a distraction for MVP?

---

## 10. Glossary

- **Scoped hours:** Planned/estimated hours allocated to a project.
- **Hours worked:** Actual hours spent so far (high-level, not a timesheet).
- **At-risk project:** Project that is still in progress, with a near due date and significant remaining hours.
- **Focus project:** The single top-priority project for a designer, auto-selected via defined rules.

---

_End of document._
