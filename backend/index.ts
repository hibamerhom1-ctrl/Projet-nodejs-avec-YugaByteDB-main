// Importation des modules nécessaires
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool } from './db/connection.js';
import { projectsRouter } from './routes/projects.js';

// Configuration des variables d'environnement
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware pour gérer les requêtes CORS et JSON
app.use(cors());
app.use(express.json());

// Route de vérification de santé
app.get('/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({
      status: 'Healthy',
      timestamp: result.rows[0].now,
    });
  } catch {
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// Routes
app.use('/api/projects', projectsRouter);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response) => {
  res.status(500).json({ error: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing server...');
  await pool.end();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, closing server...');
  await pool.end();
  process.exit(0);
});

