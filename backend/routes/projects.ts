// Importation des modules nécessaires
import express, { Request, Response } from 'express';
import { pool } from '../db/connection.js';

// Création du routeur pour les projets
export const projectsRouter = express.Router();

// Route GET pour récupérer tous les projets
projectsRouter.get('/', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT * FROM projects ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({
      error: 'Failed to fetch projects',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Route GET pour récupérer un projet par son ID
projectsRouter.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM projects WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({
      error: 'Failed to fetch project',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Route POST pour créer un nouveau projet
projectsRouter.post('/', async (req, res) => {
  try {
    const { name, description, status, startDate, endDate } = req.body;

    // Validation des données
    if (!name || !description || !status || !startDate || !endDate) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['name', 'description', 'status', 'startDate', 'endDate']
      });
    }

    if (!['active', 'completed', 'on-hold'].includes(status)) {
      return res.status(400).json({
        error: 'Invalid status',
        validStatuses: ['active', 'completed', 'on-hold']
      });
    }

    const result = await pool.query(
      `INSERT INTO projects (name, description, status, start_date, end_date)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name, description, status, startDate, endDate]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({
      error: 'Failed to create project',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Route PUT pour mettre à jour un projet existant
projectsRouter.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, status, startDate, endDate } = req.body;

    // Validation des données
    if (!name || !description || !status || !startDate || !endDate) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['name', 'description', 'status', 'startDate', 'endDate']
      });
    }

    if (!['active', 'completed', 'on-hold'].includes(status)) {
      return res.status(400).json({
        error: 'Invalid status',
        validStatuses: ['active', 'completed', 'on-hold']
      });
    }

    const result = await pool.query(
      `UPDATE projects
       SET name = $1, description = $2, status = $3, start_date = $4, end_date = $5, updated_at = NOW()
       WHERE id = $6
       RETURNING *`,
      [name, description, status, startDate, endDate, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({
      error: 'Failed to update project',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Route DELETE pour supprimer un projet
projectsRouter.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM projects WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ success: true, id: result.rows[0].id });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({
      error: 'Failed to delete project',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

