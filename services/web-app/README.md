# Veris Web App

Modern web application for submitting and viewing AI-verified claims.

## Features

- **Multi-modal Submission**: Submit text, images, or videos
- **Real-time Feed**: View verified claims with infinite scroll
- **Mobile Responsive**: Works on all devices
- **Source Attribution**: View evidence and sources for each claim
- **Status Indicators**: TRUE, FALSE, DISPUTED, UNVERIFIABLE badges

## Tech Stack

- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- PostgreSQL (Neon)
- Lucide Icons

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- PostgreSQL database (Neon)

### Installation

1. **Install dependencies**
```bash
cd services/web-app
pnpm install
```

2. **Setup environment**
```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
# Database (Neon PostgreSQL)
DATABASE_URL=postgresql://user:password@host/database?sslmode=require

# ADK Agent
NEXT_PUBLIC_ADK_AGENT_URL=https://veris-ai-773695696004.us-central1.run.app
```

3. **Run development server**
```bash
pnpm dev
# Open http://localhost:3000
```

4. **Production build**
```bash
pnpm build
pnpm start
```

## Usage

### Submit a Claim

1. Go to [Submit page](https://veris-web-app.vercel.app/submit)
2. Choose mode: Text, Image, or Video
3. Enter/upload content
4. Click "Verify"
5. Wait 2-3 minutes for results

### View Feed

1. Go to [Home page](https://veris-web-app.vercel.app)
2. Scroll through verified claims
3. See verdicts, confidence scores, and sources
4. Feed auto-loads more as you scroll (infinite scroll)

3. **Run development server**
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
app/
├── api/
│   ├── claims/         # GET claims with pagination
│   └── submit/         # POST submit for verification
├── submit/             # Claim submission page
├── layout.tsx          # Root layout
└── page.tsx            # Home feed

components/
├── ClaimCard.tsx       # Individual claim display
├── ClaimFeed.tsx       # Feed with infinite scroll
├── Sidebar.tsx         # Desktop navigation
├── BottomNav.tsx       # Mobile navigation
└── RightSidebar.tsx    # Trending sidebar

lib/
└── db.ts              # Database queries
```

## API Routes

### GET /api/claims

Fetch claims with pagination.

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

**Response:**
```json
{
  "success": true,
  "claims": [...],
  "page": 1,
  "limit": 10,
  "hasMore": true
}
```

### POST /api/submit

Submit content for verification.

**Body (FormData):**
- `text`: Text claim (required for text mode)
- `file`: Image/video file (required for media mode)

**Response:**
```json
{
  "success": true,
  "status": "submitted",
  "message": "Your submission has been sent for AI verification..."
}
```

## Features

### Infinite Scroll

Feed automatically loads more claims as you scroll. Loads 10 claims per page.

### Mobile Responsive

- Desktop: Sidebar + Feed + Right sidebar
- Tablet: Sidebar + Feed
- Mobile: Bottom nav + Feed

### Claim Submission

1. Choose mode: Text, Image, or Video
2. Enter/upload content
3. Click "Verify"
4. Check feed in 2-3 minutes

## Database Schema

```sql
CREATE TABLE crawled_content (
  id TEXT PRIMARY KEY,
  source TEXT,
  url TEXT,
  content_type TEXT,
  claim TEXT,
  category TEXT,
  verification_status TEXT,
  confidence NUMERIC,
  evidence TEXT,
  verification_sources TEXT[],
  images TEXT[],
  videos TEXT[],
  created_at TIMESTAMP
);
```

## Deployment

### Vercel

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy

**Environment Variables:**
- `DATABASE_URL`
- `NEXT_PUBLIC_ADK_AGENT_URL`

## Development

### Commands

```bash
pnpm dev          # Development server
pnpm build        # Production build
pnpm start        # Start production server
pnpm lint         # Run ESLint
```

### Adding New Features

1. Create component in `components/`
2. Add route in `app/`
3. Update API routes if needed
4. Test on mobile and desktop

## Links

- [Main Project](../../README.md)
- [Chrome Extension](../veris_extension/README.md)
- [ADK Agent](../agent_service/README.md)
- [Live Demo](https://veris-web-app.vercel.app)
