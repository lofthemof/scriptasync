# ScriptAsync

Web application for reading and annotating Bible passages. Users can browse scripture, select verses, and save personal notes.

## Features

- **Bible Reading** - Browse books and chapters with verse-by-verse display
- **Verse Selection** - Select multiple verses with visual highlighting
- **Note Taking** - Save and view personal notes attached to specific verses
- **Reading Progress** - Automatically remembers your last reading location
- **User Dashboard** - View user info + statistics

## Tech Stack

- **Framework**: React 19, Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **API**: tRPC for type-safe endpoints
- **Auth**: Auth.js with Google OAuth
- **Styling**: Tailwind CSS 4

### Prerequisites

- Node.js 18+
- pnpm
- PostgreSQL database
- Google OAuth credentials

### Installation

```bash
git clone https://github.com/lofthemof/scriptasync.git
cd scriptasync
pnpm install
```

### Environment Setup

Copy `.env.example` to `.env` and configure:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/scriptasync"

# Auth (generate with: npx auth secret)
AUTH_SECRET="your-auth-secret"

# Google OAuth (from Google Cloud Console)
GOOGLE_CLIENT_ID="your-client-id"
GOOGLE_CLIENT_SECRET="your-client-secret"
```

### Database Setup

```bash
# Run migrations
pnpm prisma migrate dev

# Seed Bible data
node scripts/seed-esv-bible-from-markdown.mjs
```

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

### Production

```bash
pnpm build
pnpm start
```

## Scripts

| Command             | Description                   |
| ------------------- | ----------------------------- |
| `pnpm dev`          | Start development server      |
| `pnpm build`        | Build for production          |
| `pnpm start`        | Start production server       |
| `pnpm check`        | Run linting and type checking |
| `pnpm lint:fix`     | Auto-fix linting issues       |
| `pnpm format:write` | Format code with Prettier     |

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── read/              # Bible reading interface
│   ├── notes/             # User's saved notes
│   ├── user/              # User dashboard
│   └── _components/       # Shared components
├── server/
│   ├── api/routers/       # tRPC routers (bible, user)
│   ├── auth/              # NextAuth configuration
│   └── db.ts              # Prisma client
├── trpc/                  # tRPC client setup
└── components/ui/         # UI components
```

## Database Schema

- **Bible** - Bible versions (ESV, KJV, etc.)
- **Book** - Books within a Bible (Genesis, Exodus, etc.)
- **Chapter** - Chapters within books
- **Verse** - Individual verses with text content
- **Note** - User-created notes
- **NoteVerse** - Links notes to specific verses
- **User** - User accounts with reading progress tracking
