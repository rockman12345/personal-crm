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
- **Database**: SQLite via Prisma (swap to Postgres for production)
- **Styling**: Tailwind CSS v4
- **AI**: Anthropic Claude API
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone or navigate to the project
cd personal-crm

# Install dependencies
npm install

# Set up the database
npx prisma migrate dev --name init

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Environment Variables

Edit `.env` and fill in your values:

```env
# Database (SQLite for local dev)
DATABASE_URL="file:./dev.db"

# AI Integration
ANTHROPIC_API_KEY="your-anthropic-api-key"
```

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

1. **Create a Postgres database** on [Vercel Storage](https://vercel.com/storage/postgres)
2. **Update Prisma schema** — change `provider = "sqlite"` to `provider = "postgresql"` in `prisma/schema.prisma`
3. **Set environment variables** in Vercel dashboard:
   - `DATABASE_URL` — your Vercel Postgres connection string
   - `ANTHROPIC_API_KEY` — your Anthropic API key
4. **Deploy**: `vercel deploy`

## Roadmap

- [ ] Natural language search ("find contacts at YC companies")
- [ ] Email import / Gmail integration
- [ ] LinkedIn profile import
- [ ] AI-drafted outreach emails
- [ ] Bulk contact operations
- [ ] CSV import/export
- [ ] Reminders and follow-up scheduling
- [ ] Mobile-responsive improvements
