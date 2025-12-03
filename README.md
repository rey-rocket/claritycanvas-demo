# ClarityCanvas MVP

A **capacity and risk dashboard for instructional design (ID) teams** that replaces scattered spreadsheets with a single, live view of projects, workload, and risk.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-38B2AC?logo=tailwind-css&logoColor=white)

## Features

- ✅ **Dashboard** - Real-time team workload, designer capacity, and focus projects
- ✅ **Risk Detection** - Automatic flagging of over-budget and at-risk projects
- ✅ **Project Management** - Full CRUD with filtering by designer and status
- ✅ **Task Tracking** - Add and manage tasks within projects
- ✅ **Capacity Planning** - Track and edit designer weekly availability
- ✅ **Focus Algorithm** - Auto-prioritizes projects for each designer

## Tech Stack

- **Framework**: Next.js 14 (App Router, React 18, TypeScript)
- **Database**: SQLite (development) / PostgreSQL (production)
- **ORM**: Prisma
- **Styling**: TailwindCSS
- **Icons**: Lucide React
- **Validation**: Zod

## Architecture

```
app/              # Next.js routes and pages
  actions/        # Server actions for mutations
  projects/       # Project pages
  capacity/       # Capacity management
domain/           # Pure business logic (testable)
  workload.ts     # Team workload calculations
  risk.ts         # Risk detection & budget flags
  focus.ts        # Focus project selection algorithm
data/             # Prisma repository layer
  projects.ts     # Project queries
  capacities.ts   # Capacity queries
components/       # Reusable React components
lib/              # Shared utilities
prisma/           # Database schema & migrations
```

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Database

For local development with SQLite (default):

```bash
# Copy environment template
cp .env.example .env

# The DATABASE_URL is already set to: file:./dev.db
```

For PostgreSQL (production):

```bash
# Update .env with your connection string
DATABASE_URL=postgresql://user:password@host:5432/claritycanvas
```

### 3. Run Migrations

```bash
npm run prisma:migrate
```

### 4. Seed the Database

```bash
npm run prisma:seed
```

This creates sample data:
- 1 team with 5 designers
- 10 projects in various states
- 13 tasks across projects

### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Key Pages

- `/` - Dashboard with team summary and risk overview
- `/projects` - Filterable project list
- `/projects/[id]` - Project details with tasks and progress
- `/projects/new` - Create new project
- `/capacity` - Manage designer weekly hours

## Business Logic

### Workload Calculation

```typescript
// For each designer:
capacity = weeklyAvailableHours (default 40)
estimatedHours = sum of estimatedScopedHours (active projects only)
hoursRemaining = capacity - estimatedHours
```

### Risk Detection

**Over Budget**: `hoursWorked > estimatedScopedHours`

**At Risk**: Due within 7 days AND >8 hours remaining AND not over budget

### Focus Algorithm

Projects scored by:
- +100 points if at-risk
- +50 points if over-budget
- +`max(0, 30 - daysToDue)` for urgency

Highest score = designer's focus project

## Development

### Database Commands

```bash
# Generate Prisma Client
npm run prisma:generate

# Create migration
npm run prisma:migrate

# Seed database
npm run prisma:seed

# Open Prisma Studio
npx prisma studio
```

### Build & Deploy

```bash
# Production build
npm run build

# Start production server
npm start
```

## Project Structure Details

### Domain Layer (Pure Logic)

All business rules live in `domain/` as pure TypeScript functions. This ensures:
- Easy unit testing
- Reusability across different contexts
- No coupling to database or UI

### Data Layer (Repository Pattern)

`data/` contains Prisma-based functions that:
- Handle all database access
- Return typed data
- Can be easily mocked for testing

### Server Actions

Next.js Server Actions in `app/actions/` handle:
- Form submissions
- Data mutations
- Validation with Zod
- Cache revalidation

## Environment Variables

```bash
# Database
DATABASE_URL=file:./dev.db  # SQLite (dev) or PostgreSQL connection string

# Auth (optional, for future)
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=http://localhost:3000

# AI (stubbed for MVP)
GEMINI_API_KEY=your-key
```

## Roadmap

See `docs/PRD.md` for full product requirements.

### Current (MVP ✅)
- ✅ Project CRUD
- ✅ Capacity management
- ✅ Risk detection
- ✅ Focus algorithm
- ✅ Task management

### Next Steps
- [ ] Authentication (Supabase Auth / NextAuth)
- [ ] Multi-team support
- [ ] AI notes summarization
- [ ] CSV export
- [ ] Project search

## Documentation

- `docs/PRD.md` - Product Requirements Document
- `docs/Technical_Design.md` - Technical architecture
- `docs/ProjectPlan.md` - Development milestones

## Deployment

### Deploy to Vercel

This project is optimized for Vercel deployment:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/rey-rocket/claritycanvas-demo)

### Manual Deployment Steps

1. Push your code to GitHub
2. Import the project in Vercel
3. Set environment variables (if using PostgreSQL)
4. Deploy!

Vercel will automatically:
- Detect Next.js framework
- Run build commands
- Set up serverless functions
- Enable automatic deployments on push

## Design System

ClarityCanvas features a polished, modern UI with:

- **Colors**: Teal (#2F7379) & Lime (#ABCA20) primary palette
- **Typography**: Poppins (display) + Inter (body)
- **Micro-interactions**: Smooth hover effects and animations
- **Components**: Card-based layout with elevation shadows
- **Responsive**: Optimized for desktop and mobile

See `brand_guide.md` for full design specifications.

## License

MIT

---

Built with ❤️ for instructional design teams
🤖 UI enhanced with Claude Code
