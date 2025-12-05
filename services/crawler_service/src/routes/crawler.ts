import { Router, type Request, type Response } from 'express';
import { RSSCrawler } from '../crawlers/rssCrawler';
import { RedditCrawler } from '../crawlers/redditCrawler';
import { ADKAgentClient } from '../agents/claimExtractorAgent';
import { logger } from '../utils/logger';
import type { RawContentItem } from '../types';

const router: Router = Router();

// Get available sources
router.get('/sources', (req, res) => {
  const rssFeeds = process.env.RSS_FEEDS?.split(',') || [
    'https://feeds.bbci.co.uk/news/rss.xml',
    'https://timesofindia.indiatimes.com/rssfeedstopstories.cms',
    'https://www.theguardian.com/world/rss',
  ];

  const subreddits = process.env.REDDIT_SUBREDDITS?.split(',') || [
    'worldnews',
    'news',
    'india',
  ];

  res.json({
    rss: rssFeeds,
    reddit: subreddits,
  });
});

// Fetch content from selected sources
router.post('/fetch', async (req, res) => {
  try {
    const { type, sources } = req.body;

    if (!type || !sources || !Array.isArray(sources)) {
      return res.status(400).json({ error: 'Invalid request' });
    }

    logger.info('Fetching content', { type, sources });

    let items: RawContentItem[] = [];

    if (type === 'rss') {
      const crawler = new RSSCrawler(sources);
      items = await crawler.crawl();
    } else if (type === 'reddit') {
      const crawler = new RedditCrawler(sources);
      items = await crawler.crawl();
    } else {
      return res.status(400).json({ error: 'Invalid type' });
    }

    logger.info('Content fetched', { count: items.length });
    res.json({ items });
  } catch (error) {
    logger.error('Fetch error', { error });
    res.status(500).json({ error: 'Failed to fetch content' });
  }
});

// Process selected items
router.post('/process', async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ error: 'Invalid request' });
    }

    logger.info('Processing items', { count: items.length });

    const adkClient = new ADKAgentClient();
    const results = [];

    for (const item of items) {
      const success = await adkClient.processArticle(item);
      results.push({
        url: item.url,
        success,
      });
      
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    const successCount = results.filter(r => r.success).length;
    logger.info('Processing complete', { 
      total: items.length, 
      successful: successCount 
    });

    res.json({ results, successCount });
  } catch (error) {
    logger.error('Process error', { error });
    res.status(500).json({ error: 'Failed to process items' });
  }
});

export { router as crawlerRouter };
