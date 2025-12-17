import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5433'),
  database: process.env.DB_NAME || 'yugabyte',
  user: process.env.DB_USER || 'yugabyte',
  password: process.env.DB_PASSWORD || 'yugabyte',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test connection
pool.on('connect', () => {
  console.log('✅ Connected to YugaByteDB');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle client', err);
  // Don't exit on error, just log it
});

// Test the connection (async, don't block)
pool.query('SELECT NOW()')
  .then(() => {
    console.log('✅ Database connection successful');
  })
  .catch((err) => {
    console.error('❌ Database connection failed:', err.message);
    console.error('💡 Make sure YugaByteDB is running: docker-compose up -d');
    console.error('💡 Make sure the database is initialized: npm run init-db');
  });

