import express, { type Express } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { crawlerRouter } from './routes/crawler';
import { logger } from './utils/logger';

dotenv.config();

const app: Express = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// API Routes
app.use('/api', crawlerRouter);

// Serve UI
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start server
app.listen(PORT, () => {
  logger.info('Crawler Service UI started', { port: PORT });
  console.log(`\n🚀 Crawler Service UI: http://localhost:${PORT}\n`);
});

export default app;
