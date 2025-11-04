import express from 'express';
import cors from 'cors';
import heroRoutes from './routes/heroRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import mediaRoutes from './routes/mediaRoutes.js';

const app = express();

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }),
);
app.use(express.json());

app.use('/api', heroRoutes);
app.use('/api', uploadRoutes);
app.use('/api', mediaRoutes);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

export default app;

