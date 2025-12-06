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

// Static files - handle both dev and production paths
const publicPath = process.env.NODE_ENV === 'production' 
  ? path.join(__dirname, '../public')
  : path.join(__dirname, '../public');
  
app.use(express.static(publicPath));
logger.info('Serving static files from', { path: publicPath });

// API Routes
app.use('/api', crawlerRouter);

// Health check endpoint (required for Cloud Run)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Serve UI
app.get('/', (req, res) => {
  const indexPath = path.join(publicPath, 'index.html');
  logger.info('Serving index.html from', { path: indexPath });
  res.sendFile(indexPath);
});

// Start server
const HOST = '0.0.0.0'; // Required for Cloud Run
app.listen(PORT, HOST, () => {
  logger.info('Crawler Service UI started', { port: PORT, host: HOST });
  console.log(`\n🚀 Crawler Service UI: http://${HOST}:${PORT}\n`);
});

export default app;
