# ClarityCanvas – Product Requirements Document (MVP)

**Owner:** Product / Founder  
**Version:** v1.0 (MVP)  

---

## 1. Product Overview

### 1.1 Summary

**ClarityCanvas** is a capacity and risk dashboard for instructional design (ID) teams. It gives managers and designers a single place to see:

- Active projects
- Who is over / under capacity
- Which projects are over budget or at risk
- Which project each designer should focus on this week

The MVP is a web app built as a full-stack TypeScript monolith using Next.js and PostgreSQL (via Supabase).

### 1.2 Vision

Become the “source of truth” for instructional design workload, replacing spreadsheets and manual status reports with a clear, always-current view of work and risk.

### 1.3 MVP Objective

Enable a small ID team (3–15 designers) and their manager to:

- Track core project details
- Manage weekly capacity for each designer
- View workload and risk at a glance
- Make better weekly planning decisions with minimal setup

---

## 2. Problem & Goals

### 2.1 Problem

Current state for many ID teams:

- Work tracked across spreadsheets, task tools, emails, and calls
- No real-time visibility into who is overloaded vs under-utilized
- Risky projects discovered late (over budget or close to deadlines)
- Managers burn time compiling updates into reports
- Designers don’t have a clear weekly focus

### 2.2 Goals (MVP)

1. **Visibility** – Live overview of projects and designer workload.
2. **Risk detection** – Early flags for over-budget and at-risk projects.
3. **Focus** – Clear primary focus project per designer each week.
4. **Low friction** – Setup and usage simple enough for a team to adopt within a day.

### 2.3 Non-goals (MVP)

- Detailed time tracking / full timesheet replacement.
- Complex role-based permissions and multi-tenant hierarchy.
- Advanced analytics (trends, forecasting).
- Deep tool integrations (Jira, Asana, LMS).
- Native mobile apps.

---

## 3. Users & Personas

### 3.1 Primary

**Instructional Design Manager**

- Oversees multiple designers and projects.
- Needs to see team capacity, who is over/under-loaded, and which projects need attention.
- Uses ClarityCanvas several times per week.

**Instructional Designer**

- Works on multiple projects in parallel.
- Needs clarity on weekly priorities and tasks.
- Updates basic project/effort info.

### 3.2 Secondary (Future)

- Ops / PMO / leadership for cross-team insights and trend reports.

---

## 4. User Scenarios

1. **Manager reviews weekly capacity**
   - Monday morning, manager opens the dashboard.
   - Sees each designer’s capacity, planned hours, and remaining hours.
   - Adjusts capacities for PTO / part-time weeks.

2. **Manager identifies risky projects**
   - Manager scans project list.
   - Projects with “Over Budget” and “At Risk” badges stand out.
   - Manager inspects those projects and decides how to respond.

3. **Designer understands their focus**
   - Designer logs in.
   - Sees their current active projects and which one is flagged as primary focus (due date + remaining work).
   - Updates tasks / hours worked as the week progresses.

4. **Manager creates/updates projects**
   - Manager creates new projects with basic info.
   - Manager/ID updates status, hours worked, notes, and tasks.

5. **Manager adjusts designer capacity**
   - A designer is only available for 20 hours this week.
   - Manager updates weekly available hours.
   - Workload recalculates and shows over/under capacity.

6. **Manager exports a summary (nice-to-have)**
   - Manager exports CSV for last month for reporting and planning.

7. **Designer converts messy notes into tasks (stretch)**
   - Designer pastes notes into a project.
   - Clicks “Summarize notes” to get suggested tasks (AI-powered).

---

## 5. Scope (MVP)

### 5.1 In Scope

**Must-have**

- Project CRUD (at minimum: create and read in UI; update can come next).
- Designer capacity data and listing.
- Per-designer workload metrics and team summary.
- Over-budget and at-risk detection based on hours and due dates.
- Designer focus project selection logic.
- Simple, at-a-glance dashboard.
- Basic authentication & data isolation (at least per deployment or team in later iterations).
- Supabase-hosted PostgreSQL as persistent store.

**Should-have**

- Capacity manager UI (view & later edit capacities).
- CSV export of summary + designer breakdown (can be a later MVP milestone).
- Filtering in projects list by designer/status.

**Could-have**

- AI-powered notes summarization and task suggestions.
- Search by project title/client.
- Simple settings for default weekly capacity and risk thresholds.

### 5.2 Out of Scope

- Complex permissions and multi-org structures.
- Full task management (subtasks, dependencies, etc.).
- Deep integrations with other task/PM systems.

---

## 6. Functional Requirements

### 6.1 Projects

**FR-P1 – Create Project**

- User can create a project with:
  - Title (required)
  - Client (required)
  - Instructional designer (required; free-text or from list)
  - Status (Planning, In Progress, Review, Handover)
  - Due date (required)
  - Estimated scoped hours (required)
  - Hours worked (optional, default 0)
  - Notes (optional)
- Stored as a `Project` row tied to a `Team`.

**FR-P2 – View Projects**

- Projects list (`/projects`) displays:
  - Title, client, ID, status, due date.
  - Risk/budget badges.
- Clicking a project opens detail view (`/projects/[id]`).

**FR-P3 – Project Detail**

- Project detail shows:
  - Core metadata (fields above).
  - Tasks (name + completed flag, optional estimated hours later).
  - Notes.
  - Risk/budget state with reason text.

**FR-P4 – Tasks (Simplified)**

- For MVP, tasks are optional:
  - Fields: name (string), completed (boolean).
- Used to show basic completion context; hours can be added later.

---

### 6.2 Designer Capacity & Workload

**FR-C1 – Designer Capacity Data**

- System stores weekly available hours per designer per team:
  - designerName
  - weeklyAvailableHours
- If missing, default weekly capacity (e.g. 40 hours) is assumed.

**FR-C2 – Capacity View**

- `/capacity` page lists all `DesignerCapacity` records with designer name and weekly hours.

**FR-C3 – Workload Calculation**

- For each designer:
  - Sum estimated scoped hours for active (non-Handover) projects.
  - Use capacity record or default value.
  - Compute `hoursRemaining = capacity - estimatedHours`.

**FR-C4 – Team Summary**

- Dashboard shows:
  - Total team capacity (sum of designer capacities).
  - Total planned hours (sum of estimated hours).
  - Total remaining hours.

---

### 6.3 Risk & Budget Logic

**FR-R1 – Over-budget**

- A project is considered over budget if:
  - `hoursWorked > estimatedScopedHours`.
- UI shows “Over Budget” badge plus textual explanation.

**FR-R2 – At-risk**

- A project is considered at risk if:
  - Has a due date.
  - Due in ≤ 7 days.
  - Remaining hours (`estimatedScopedHours - hoursWorked`) > 8.
  - Status is not Handover.
- UI shows “At Risk” badge plus explanation.

---

### 6.4 Designer Focus

**FR-F1 – Focus Project Selection**

- For each designer, the system chooses a single focus project based on:
  - Prefer at-risk projects.
  - Among at-risk, pick soonest due.
  - If none at-risk, pick soonest due / highest remaining effort.

**FR-F2 – Focus View**

- Dashboard shows per-designer card:
  - Designer name.
  - Focus project title and due date.
  - Risk/budget flags where relevant.

---

### 6.5 Reporting & Export (Nice-to-have)

**FR-E1 – CSV Export**

- User can export a CSV for a given time range with:
  - Summary: total projects, completed projects, scoped vs worked hours.
  - Designer breakdown: designer, active projects, estimated hours, capacity.

---

### 6.6 AI Summarization (Stretch)

**FR-AI1 – Summarize Notes**

- On a project detail view, user can click “Summarize notes”.
- System sends notes to backend AI endpoint.
- Receives summary points and suggested tasks.

**FR-AI2 – Convert Suggestions to Tasks**

- User can add suggested tasks into the project task list with one click.

---

## 7. Non-Functional Requirements

- **Performance:** Dashboard loads within ~2–3 seconds for up to 100 projects and 20 designers.
- **Availability:** Target ~99% monthly uptime (MVP tolerance).
- **Security:** Auth required to access app (later iteration); environment-based secrets for DB/AI.
- **Maintainability:** Clear separation of concerns between domain logic, data access, and UI.

---

## 8. Technical Architecture (High-level)

- **Frontend & Backend:** Next.js (App Router) as a full-stack monolith.
- **Language:** TypeScript.
- **Database:** Supabase-hosted PostgreSQL, accessed via Prisma.
- **Domain Logic:** Pure TypeScript modules in `domain/` (workload, risk, focus).
- **Data Layer:** Repository-style modules in `data/` wrapping Prisma.
- **AI Integration:** Next.js API route calling Gemini/OpenAI with keys in env vars.
- **Auth (Planned):** Supabase Auth or NextAuth with Supabase as backing store.

---

## 9. Success Metrics

- 2–3 pilot teams use the tool weekly within first 1–2 months.
- ≥ 70% active projects updated (status or hours) at least weekly.
- ≥ 80% designers with a capacity record and at least one assigned project.
- Qualitative feedback from managers that weekly planning / reporting prep time is noticeably reduced (e.g., by ~30%).

---

## 10. Risks & Open Questions

- **Data discipline:** Risk and capacity accuracy depend on users updating hours and statuses.
- **Effort modeling:** Whether to refine from project-level hours to task-level hours in later versions.
- **Auth & multi-team support:** How soon to introduce robust team scoping and user management.

This PRD focuses on a lean but opinionated MVP with a clear path to extend both product features and technical architecture.
