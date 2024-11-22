import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { router as reviewsRouter } from './routes/reviews';
import { router as projectsRouter } from './routes/projects';
import { router as usersRouter } from './routes/users';
import { router as convocatoriasRouter } from './routes/convocatorias';
import { router as settingsRouter } from './routes/settings';
import { router as authRouter } from './routes/auth';
import { healthcheck } from './healthcheck';
import { join } from 'path';
import { config } from '../config';

dotenv.config();

const app = express();

// Security middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Serve uploads
app.use('/uploads', express.static(join(__dirname, '../../uploads')));

// Health check endpoint
app.get('/health', healthcheck);

// API routes
app.use('/api/auth', authRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/users', usersRouter);
app.use('/api/convocatorias', convocatoriasRouter);
app.use('/api/settings', settingsRouter);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const port = config.api.port;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log('Environment:', process.env.NODE_ENV);
});

export default app;