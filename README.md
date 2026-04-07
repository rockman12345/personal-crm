# Personal CRM

A personal CRM built with Next.js to manage contacts, relationships, workflows, and leverage AI for smarter follow-ups.

## Features

- **Contacts** — Track people with full details: contact info, company, social links, notes, status
- **Interactions** — Log every touchpoint: emails, calls, meetings, notes
- **Workflows** — Build follow-up sequences and outreach pipelines with multi-step automation
- **Tags** — Organize contacts with custom tags and colors
- **AI Assistant** — Claude-powered contact summaries and follow-up suggestions
- **Dashboard** — At-a-glance view of your relationship health

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: Supabase (Postgres) via Prisma
- **Styling**: Tailwind CSS v4
- **AI**: Anthropic Claude API
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- A [Supabase](https://supabase.com) account (free tier works great)

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Once created, go to **Settings → Database**
3. Scroll to **Connection string** and select **URI** mode
4. Copy the connection string — it looks like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
   ```

### 2. Set Up Environment Variables

Edit `.env` with your values:

```env
# Supabase Postgres connection string (from Settings → Database → URI)
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# Supabase project URL and anon key (from Settings → API)
# Required only if using Supabase Auth, Realtime, or Storage
NEXT_PUBLIC_SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"

# AI Integration
ANTHROPIC_API_KEY="your-anthropic-api-key"
```

### 3. Install & Run

```bash
# Install dependencies
npm install

# Push the schema to Supabase
npx prisma db push

# (Or run migrations)
npx prisma migrate dev --name init

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

> **Tip:** `prisma db push` is the fastest way to sync the schema during development. Use `prisma migrate dev` when you want to track schema history with migration files.

Get an Anthropic API key at [console.anthropic.com](https://console.anthropic.com).

## Project Structure

```
personal-crm/
├── app/
│   ├── page.tsx                          # Dashboard
│   ├── contacts/
│   │   ├── page.tsx                      # Contacts list
│   │   ├── new/page.tsx                  # New contact form
│   │   └── [id]/
│   │       ├── page.tsx                  # Contact detail
│   │       └── interactions/new/page.tsx # Log interaction
│   ├── workflows/
│   │   ├── page.tsx                      # Workflows list
│   │   ├── new/page.tsx                  # New workflow form
│   │   └── [id]/page.tsx                 # Workflow detail
│   ├── ai/page.tsx                       # AI assistant
│   ├── tags/page.tsx                     # Tags management
│   ├── settings/page.tsx                 # Settings
│   └── api/
│       ├── contacts/                     # Contact CRUD API
│       ├── ai/summarize/                 # AI summarization endpoint
│       └── workflows/                    # Workflow CRUD API
├── components/
│   ├── layout/sidebar.tsx                # Navigation sidebar
│   ├── contacts/
│   │   └── contact-form.tsx             # Reusable contact form
│   └── ui/                              # Shared UI components
├── lib/
│   ├── prisma.ts                         # Prisma client singleton
│   └── utils.ts                          # Utility functions
└── prisma/
    └── schema.prisma                     # Database schema
```

## Database Schema

| Model | Description |
|-------|-------------|
| `Contact` | People you track — name, email, phone, company, status |
| `Interaction` | Logged touchpoints — emails, calls, meetings, notes |
| `Tag` | Labels for organizing contacts |
| `Workflow` | Automation sequences with trigger types |
| `WorkflowStep` | Individual steps in a workflow |
| `WorkflowEnrollment` | Tracks which contacts are in which workflows |
| `AiSummary` | Cached AI-generated summaries for contacts |

## Deploying to Vercel

1. **Push your code** to GitHub (already done if you're reading this)
2. **Import the repo** at [vercel.com/new](https://vercel.com/new)
3. **Set environment variables** in the Vercel dashboard:
   - `DATABASE_URL` — your Supabase connection string (Settings → Database → URI)
   - `NEXT_PUBLIC_SUPABASE_URL` — your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — your Supabase anon key
   - `ANTHROPIC_API_KEY` — your Anthropic API key
4. **Deploy** — Vercel will build and deploy automatically

> **Note:** Make sure you've already run `npx prisma migrate dev` or `npx prisma db push` against your Supabase database before the first deploy.

## Roadmap

- [ ] Natural language search ("find contacts at YC companies")
- [ ] Email import / Gmail integration
- [ ] LinkedIn profile import
- [ ] AI-drafted outreach emails
- [ ] Bulk contact operations
- [ ] CSV import/export
- [ ] Reminders and follow-up scheduling
- [ ] Mobile-responsive improvements
