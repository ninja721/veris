# Veris Web App

Digital newspaper interface for AI-verified claims.

## Features

- **Veris** - Digital newspaper with page-flipping (last 100 claims)
- **Verify Claim** - Submit text/images/videos for verification

## Setup

```bash
cd services/web-app
pnpm install
cp .env.local.example .env.local
# Add DATABASE_URL and NEXT_PUBLIC_ADK_AGENT_URL
pnpm dev
```

## Tech Stack

Next.js 15, React 18, TypeScript, Tailwind CSS, PostgreSQL
