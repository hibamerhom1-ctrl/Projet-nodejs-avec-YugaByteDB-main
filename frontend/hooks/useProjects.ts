import { useState, useEffect } from 'react';
import { Project, ProjectFormData } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Helper function to transform database response to frontend format
const transformProject = (dbProject: any): Project => {
  return {
    id: dbProject.id,
    name: dbProject.name,
    description: dbProject.description,
    status: dbProject.status,
    startDate: dbProject.start_date,
    endDate: dbProject.end_date,
    createdAt: dbProject.created_at,
    updatedAt: dbProject.updated_at,
  };
};

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // READ - Fetch all projects
  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/projects`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const transformedProjects = data.map(transformProject);
      setProjects(transformedProjects);
    } catch (err) {
      let errorMessage = 'Failed to fetch projects';
      
      if (err instanceof TypeError && err.message === 'Failed to fetch') {
        errorMessage = `Cannot connect to backend server. Please make sure the backend is running on ${API_BASE_URL.replace('/api', '')}`;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      console.error('Error fetching projects:', err);
      console.error('API URL:', API_BASE_URL);
    } finally {
      setLoading(false);
    }
  };

  // CREATE - Add new project
  const createProject = async (formData: ProjectFormData) => {
    try {
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const newProject = transformProject(data);
      setProjects([...projects, newProject]);
      
      return newProject;
    } catch (err) {
      let message = 'Failed to create project';
      
      if (err instanceof TypeError && err.message === 'Failed to fetch') {
        message = `Cannot connect to backend server. Please make sure the backend is running on ${API_BASE_URL.replace('/api', '')}`;
      } else if (err instanceof Error) {
        message = err.message;
      }
      
      setError(message);
      console.error('Error creating project:', err);
      throw new Error(message);
    }
  };

  // UPDATE - Edit project
  const updateProject = async (id: string, formData: ProjectFormData) => {
    try {
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const updatedProject = transformProject(data);
      
      const updated = projects.map(project =>
        project.id === id ? updatedProject : project
      );
      setProjects(updated);

      return updatedProject;
    } catch (err) {
      let message = 'Failed to update project';
      
      if (err instanceof TypeError && err.message === 'Failed to fetch') {
        message = `Cannot connect to backend server. Please make sure the backend is running on ${API_BASE_URL.replace('/api', '')}`;
      } else if (err instanceof Error) {
        message = err.message;
      }
      
      setError(message);
      console.error('Error updating project:', err);
      throw new Error(message);
    }
  };

  // DELETE - Remove project
  const deleteProject = async (id: string) => {
    try {
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const updated = projects.filter(project => project.id !== id);
      setProjects(updated);
    } catch (err) {
      let message = 'Failed to delete project';
      
      if (err instanceof TypeError && err.message === 'Failed to fetch') {
        message = `Cannot connect to backend server. Please make sure the backend is running on ${API_BASE_URL.replace('/api', '')}`;
      } else if (err instanceof Error) {
        message = err.message;
      }
      
      setError(message);
      console.error('Error deleting project:', err);
      throw new Error(message);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return {
    projects,
    loading,
    error,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
  };
}
