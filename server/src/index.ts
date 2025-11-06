import http from 'http';
import app from './app.js';
import { getDatabase } from './config/database.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from server root directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });

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

