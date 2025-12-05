# Veris Crawler Service v2.0

Interactive web-based crawler with manual content selection.

## Quick Start

```bash
pnpm install
pnpm dev
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
