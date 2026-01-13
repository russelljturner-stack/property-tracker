# Property Development Tracker

A web application for tracking property development projects, migrated from FileMaker Pro to Next.js.

## Tech Stack

- **Frontend:** Next.js 16 + React + TypeScript
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL (Railway)
- **ORM:** Prisma
- **Authentication:** NextAuth.js

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your database URL and NextAuth secret

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
```

### Environment Variables

```
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000
```

## Deployment

The application auto-deploys to Railway from the `master` branch.

**Production URL:** https://property-tracker-production-ac30.up.railway.app

## Project Structure

```
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/       # React components
│   └── lib/              # Utilities and helpers
├── prisma/
│   └── schema.prisma     # Database schema
├── docs/                 # Project documentation
└── CLAUDE.md             # AI assistant instructions
```

## Documentation

See `docs/` folder for:
- Phase summaries and progress
- Architecture decisions
- Schema audits
- Session handover notes

## Development

This project was migrated from FileMaker Pro 12 with assistance from Claude Code. See `CLAUDE.md` for AI assistant context and procedures.

---

*Property Development Tracker - A FileMaker to Next.js migration project*
