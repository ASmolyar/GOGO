import http from 'http';
import app from './app.js';
import { getDatabase } from './config/database.js';
import dotenv from 'dotenv';

dotenv.config();

const port = Number(process.env.PORT ?? 4000);

async function startServer() {
  try {
    await getDatabase();
    const server = http.createServer(app);
    server.listen(port, () => {
      console.log(`Impact Report API listening on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server', error);
    process.exit(1);
  }
}

void startServer();

