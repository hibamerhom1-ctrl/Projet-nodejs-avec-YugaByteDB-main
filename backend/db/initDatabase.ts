import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

async function initDatabase() {
  let adminPool: pg.Pool | null = null;
  let projectsPool: pg.Pool | null = null;

  try {
    console.log('🔄 Initializing YugaByteDB database...');

    // Connect to default 'yugabyte' database first to create new database
    adminPool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5433'),
      database: 'yugabyte',
      user: process.env.DB_USER || 'yugabyte',
      password: process.env.DB_PASSWORD || 'yugabyte',
    });

    const dbName = process.env.DB_NAME || 'yugabyte';
    
    // Check if database exists (only if we're creating a new one)
    if (dbName !== 'yugabyte') {
      const dbCheck = await adminPool.query(
        "SELECT 1 FROM pg_database WHERE datname = $1",
        [dbName]
      );

      if (dbCheck.rows.length === 0) {
        console.log(`📦 Creating database: ${dbName}`);
        await adminPool.query(`CREATE DATABASE ${dbName}`);
        console.log(`✅ Database ${dbName} created`);
      } else {
        console.log(`✅ Database ${dbName} already exists`);
      }
    }

    await adminPool.end();
    adminPool = null;

    // Now connect to the target database
    projectsPool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5433'),
      database: dbName,
      user: process.env.DB_USER || 'yugabyte',
      password: process.env.DB_PASSWORD || 'yugabyte',
    });

    // Create projects table
    console.log('📋 Creating projects table...');
    await projectsPool.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'completed', 'on-hold')),
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ Projects table created');

    // Create index on status for better query performance
    console.log('📊 Creating indexes...');
    await projectsPool.query(`
      CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status)
    `);
    await projectsPool.query(`
      CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC)
    `);

    console.log('✅ Indexes created');

    // Verify table structure
    const tableInfo = await projectsPool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'projects'
      ORDER BY ordinal_position
    `);

    console.log('\n📋 Table structure:');
    console.table(tableInfo.rows);

    await projectsPool.end();
    projectsPool = null;

    console.log('\n✅ Database initialization completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    if (adminPool) await adminPool.end();
    if (projectsPool) await projectsPool.end();
    process.exit(1);
  }
}

initDatabase();

