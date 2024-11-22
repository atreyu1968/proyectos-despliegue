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

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// API routes
app.use('/api/auth', authRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/users', usersRouter);
app.use('/api/convocatorias', convocatoriasRouter);
app.use('/api/settings', settingsRouter);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});