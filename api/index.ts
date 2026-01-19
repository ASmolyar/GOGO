import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import cors from 'cors';
import session from 'express-session';
import MongoStore from 'connect-mongo';

// Import routes
import heroRoutes from '../server/src/routes/heroRoutes.js';
import missionRoutes from '../server/src/routes/missionRoutes.js';
import defaultsRoutes from '../server/src/routes/defaultsRoutes.js';
import uploadRoutes from '../server/src/routes/uploadRoutes.js';
import mediaRoutes from '../server/src/routes/mediaRoutes.js';
import authRoutes from '../server/src/routes/authRoutes.js';
import financialRoutes from '../server/src/routes/financialRoutes.js';
import populationRoutes from '../server/src/routes/populationRoutes.js';
import methodRoutes from '../server/src/routes/methodRoutes.js';
import curriculumRoutes from '../server/src/routes/curriculumRoutes.js';
import impactSectionRoutes from '../server/src/routes/impactSectionRoutes.js';
import hearOurImpactRoutes from '../server/src/routes/hearOurImpactRoutes.js';
import testimonialsRoutes from '../server/src/routes/testimonialsRoutes.js';
import nationalImpactRoutes from '../server/src/routes/nationalImpactRoutes.js';
import flexARoutes from '../server/src/routes/flexARoutes.js';
import flexBRoutes from '../server/src/routes/flexBRoutes.js';
import flexCRoutes from '../server/src/routes/flexCRoutes.js';
import impactLevelsRoutes from '../server/src/routes/impactLevelsRoutes.js';
import partnersRoutes from '../server/src/routes/partnersRoutes.js';
import footerRoutes from '../server/src/routes/footerRoutes.js';
import snapshotRoutes from '../server/src/routes/snapshotRoutes.js';

const app = express();

// CORS configuration for production
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '',
  process.env.FRONTEND_URL || '',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return callback(null, true);
      if (allowedOrigins.some(allowed => origin.startsWith(allowed) || allowed.includes(origin))) {
        return callback(null, true);
      }
      // In production on Vercel, allow same-origin requests
      if (process.env.VERCEL) {
        return callback(null, true);
      }
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

app.use(express.json());

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      dbName: process.env.MONGO_DB_NAME || 'gogo-impact-report',
      touchAfter: 24 * 3600,
    }),
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    },
  })
);

// Auth routes (public)
app.use('/api/auth', authRoutes);

// All content routes
app.use('/api', heroRoutes);
app.use('/api', missionRoutes);
app.use('/api', defaultsRoutes);
app.use('/api', uploadRoutes);
app.use('/api', mediaRoutes);
app.use('/api', financialRoutes);
app.use('/api', populationRoutes);
app.use('/api', methodRoutes);
app.use('/api', curriculumRoutes);
app.use('/api', impactSectionRoutes);
app.use('/api', hearOurImpactRoutes);
app.use('/api', testimonialsRoutes);
app.use('/api', nationalImpactRoutes);
app.use('/api', flexARoutes);
app.use('/api', flexBRoutes);
app.use('/api', flexCRoutes);
app.use('/api', impactLevelsRoutes);
app.use('/api', partnersRoutes);
app.use('/api', footerRoutes);
app.use('/api', snapshotRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', env: process.env.NODE_ENV });
});

// Vercel serverless handler
export default function handler(req: VercelRequest, res: VercelResponse) {
  return app(req as any, res as any);
}
