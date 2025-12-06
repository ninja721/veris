import express, { type Express } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { crawlerRouter } from './routes/crawler';
import { logger } from './utils/logger';

dotenv.config();

const app: Express = express();
const PORT = parseInt(process.env.PORT || '8080', 10);

// Middleware
app.use(express.json());

// Static files - in production, public is at /app/public, in dev it's ../public from dist
const publicPath = path.resolve(__dirname, '../public');
app.use(express.static(publicPath));

// API Routes
app.use('/api', crawlerRouter);

// Health check endpoint (required for Cloud Run)
app.get('/health', (_req, res) => {
  res.status(200).send('OK');
});

// Serve UI
app.get('/', (_req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

// Start server - MUST bind to 0.0.0.0 for Cloud Run
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
