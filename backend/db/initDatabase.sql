-- Script SQL pour initialiser la base de données YugaByteDB
-- Exécutez ce script avec: psql -h localhost -p 5433 -U yugabyte -d yugabyte -f initDatabase.sql

-- Créer la base de données (si elle n'existe pas)
-- Note: Vous devez être connecté à la base 'yugabyte' par défaut pour créer une nouvelle base
-- CREATE DATABASE projects_db;

-- Se connecter à la base de données projects_db
-- \c projects_db;

-- Créer la table projects
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'completed', 'on-hold')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Créer les index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);

-- Afficher la structure de la table
\d projects

-- Vérifier que la table est créée
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'projects'
ORDER BY ordinal_position;

