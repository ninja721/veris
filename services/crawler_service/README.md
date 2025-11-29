# Veris Crawler Service

Automated web crawler that continuously collects claims from multiple sources and submits them for AI verification.

## Features

- **Multi-Source Crawling**: RSS feeds and Reddit
- **Intelligent Content Extraction**: Full article parsing with Cheerio
- **Automatic Deduplication**: Tracks processed URLs
- **Batch Processing**: Sends content to ADK agent
- **Configurable Intervals**: Customizable crawl frequency
- **Error Resilient**: Continues on individual failures

## Tech Stack

- TypeScript
- Node.js
- Axios (HTTP client)
- RSS Parser
- Cheerio (HTML parsing)
- PostgreSQL (Neon)

## Sources

### RSS Feeds
Default sources:
- BBC News
- Times of India
- The Guardian

Extracts:
- Full article content
- Images and media
- Author and publish date
- Article metadata

### Reddit
Default subreddits:
- r/worldnews
- r/news
- r/india

Extracts:
- Post title and text
- Author and score
- Timestamps
- Subreddit tags

## How It Works

1. **Crawl Cycle**: Runs every 5 minutes (configurable)
2. **Content Extraction**: Parses RSS feeds and Reddit posts
3. **Deduplication**: Filters out already processed URLs
4. **Batch Processing**: Sends new content to ADK agent
5. **Claim Extraction**: Agent extracts verifiable claims
6. **Verification**: Claims are verified and stored in database

## Setup

### Prerequisites

- Node.js 18+
- pnpm
- ADK Agent running

### Installation

```bash
cd services/crawler_service
pnpm install
```

### Configuration

Create `.env`:
```env
# ADK Agent
ADK_AGENT_URL=https://veris-ai-773695696004.us-central1.run.app

# RSS Feeds (comma-separated)
RSS_FEEDS=https://feeds.bbci.co.uk/news/rss.xml,https://timesofindia.indiatimes.com/rssfeedstopstories.cms

# Reddit Subreddits (comma-separated)
REDDIT_SUBREDDITS=worldnews,news,india

# Crawl interval in milliseconds (default: 5 minutes)
CRAWL_INTERVAL_MS=300000

# Test mode (sends single dummy article)
TEST_MODE=false
```

### Run

```bash
# Development
pnpm dev

# Production
pnpm build
pnpm start
```

## Project Structure

```
crawler_service/
├── src/
│   ├── crawlers/
│   │   ├── rssCrawler.ts      # RSS feed crawler
│   │   └── redditCrawler.ts   # Reddit crawler
│   ├── agents/
│   │   └── claimExtractorAgent.ts  # ADK agent client
│   ├── utils/
│   │   └── logger.ts          # Structured logging
│   ├── types.ts               # TypeScript types
│   └── app.ts                 # Main application
└── package.json
```

## Content Extraction

### RSS Crawler
1. Parses RSS feed XML
2. Fetches full article from URL
3. Uses Cheerio to extract clean content
4. Removes ads, navigation, scripts
5. Tries multiple selectors (article, main, .content)
6. Extracts images from media tags

### Reddit Crawler
1. Uses Reddit JSON API (no auth needed)
2. Fetches hot posts from subreddits
3. Combines title and selftext
4. Filters deleted/removed posts
5. Includes score and metadata

## Error Handling

- Individual failures don't stop the crawl
- Structured logging with context
- Automatic retry on next cycle
- Graceful shutdown on SIGINT/SIGTERM

## Rate Limiting

- 15-second timeout per request
- User-Agent headers for identification
- Respects robots.txt (implicit via axios)
- Configurable crawl intervals

## Test Mode

For testing without crawling:

```env
TEST_MODE=true
```

Sends a single dummy article to verify the pipeline works.

## Monitoring

Check logs for:
- Crawl cycle start/completion
- Items found per source
- Processing success/failure
- Error details with context

## Adding New Sources

### Add RSS Feed
```typescript
// In .env
RSS_FEEDS=existing_feeds,https://new-feed.com/rss
```

### Add Subreddit
```typescript
// In .env
REDDIT_SUBREDDITS=existing_subs,newsubreddit
```

### Add New Crawler Type
1. Create new crawler in `src/crawlers/`
2. Implement `crawl()` method returning `RawContentItem[]`
3. Add to `app.ts` crawl cycle
4. Update configuration

## Links

- [Main Project](../../README.md)
- [Web App](../web-app/README.md)
- [ADK Agent](../agent_service/README.md)
- [Chrome Extension](../veris_extension/README.md)
