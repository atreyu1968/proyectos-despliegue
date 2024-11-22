import { Request, Response } from 'express';
import { query } from './database/connection';

export async function healthcheck(req: Request, res: Response) {
  try {
    // Check database connection
    await query('SELECT 1');

    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'connected'
      }
    });
  } catch (error) {
    console.error('Healthcheck failed:', error);
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}