# Veris Crawler Service v2.0

Interactive web-based crawler with manual content selection. Fully independent service - no monorepo dependencies.

## Quick Start

```bash
npm install
npm run dev
# Open http://localhost:3000
```

## Configuration

`.env`:
```env
PORT=3000
ADK_AGENT_URL=https://veris-ai-773695696004.us-central1.run.app
RSS_FEEDS=https://feeds.bbci.co.uk/news/rss.xml,https://www.theguardian.com/world/rss
REDDIT_SUBREDDITS=worldnews,news,india
```

## Workflow

1. Choose RSS or Reddit
2. Select sources to crawl
3. Review fetched content (click titles for details)
4. Select items to process
5. Send to ADK agent

## Media Support

- **Images**: Extracted from RSS feeds and displayed in detail view
- **Videos**: URLs captured but not embedded (text-only processing)
- **Text**: Primary content type sent to agent for claim extraction

Note: Agent service processes text content only. Images/videos are metadata.

## Deployment to Google Cloud Run

### Prerequisites
- Google Cloud SDK installed
- Docker installed
- Project ID configured

### Option 1: Using Deployment Script

**Windows:**
```powershell
# Edit deploy.ps1 and set your PROJECT_ID
.\deploy.ps1
```

**Linux/Mac:**
```bash
# Edit deploy.sh and set your PROJECT_ID
chmod +x deploy.sh
./deploy.sh
```

### Option 2: Manual Deployment

```bash
# Set your project
gcloud config set project YOUR_PROJECT_ID

# Build and push
docker build -t gcr.io/YOUR_PROJECT_ID/veris-crawler .
docker push gcr.io/YOUR_PROJECT_ID/veris-crawler

# Deploy
gcloud run deploy veris-crawler \
  --image gcr.io/YOUR_PROJECT_ID/veris-crawler \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars "PORT=3000,ADK_AGENT_URL=YOUR_AGENT_URL,RSS_FEEDS=YOUR_FEEDS,REDDIT_SUBREDDITS=YOUR_SUBREDDITS"
```

### Option 3: Cloud Build (Automated)

```bash
gcloud builds submit --config cloudbuild.yaml \
  --substitutions _ADK_AGENT_URL="YOUR_AGENT_URL",_RSS_FEEDS="YOUR_FEEDS",_REDDIT_SUBREDDITS="YOUR_SUBREDDITS"
```

## Build Commands

```bash
# Development
npm run dev

# Build (Linux/Mac)
npm run build

# Build (Windows)
npm run build:windows

# Production
npm start
```
