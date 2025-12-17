# Database Integration Guide

This project is a fully functional React CRUD application for managing projects. Currently, data is stored in localStorage for demonstration. Follow this guide to connect your database.

## Project Structure

```
src/
├── components/
│   ├── ProjectForm.tsx      # Create/Edit form modal
│   ├── ProjectCard.tsx      # Individual project display
│   └── DeleteConfirmation.tsx # Delete confirmation modal
├── hooks/
│   └── useProjects.ts       # CRUD operations hook
├── types/
│   └── index.ts             # TypeScript interfaces
└── App.tsx                  # Main application component
```

## Core Types

Located in `src/types/index.ts`:

```typescript
interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'on-hold';
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

interface ProjectFormData {
  name: string;
  description: string;
  status: 'active' | 'completed' | 'on-hold';
  startDate: string;
  endDate: string;
}
```

## Database Operations Hook

The `useProjects` hook in `src/hooks/useProjects.ts` contains all CRUD operations:

- **CREATE**: `createProject(formData)` - Add new project
- **READ**: `fetchProjects()` - Fetch all projects
- **UPDATE**: `updateProject(id, formData)` - Edit existing project
- **DELETE**: `deleteProject(id)` - Remove project

## How to Connect Your Database

### Step 1: Replace API Endpoints

In `src/hooks/useProjects.ts`, replace the TODO comments with your API calls:

#### For fetchProjects (READ):
```typescript
const fetchProjects = async () => {
  try {
    setLoading(true);
    setError(null);

    // Replace with your API endpoint
    const response = await fetch('YOUR_API_ENDPOINT/projects');
    const data = await response.json();
    setProjects(data);
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to fetch projects');
  } finally {
    setLoading(false);
  }
};
```

#### For createProject (CREATE):
```typescript
const createProject = async (formData: ProjectFormData) => {
  try {
    setError(null);

    // Replace with your API endpoint
    const response = await fetch('YOUR_API_ENDPOINT/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    const newProject = await response.json();

    setProjects([...projects, newProject]);
    return newProject;
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to create project';
    setError(message);
    throw err;
  }
};
```

#### For updateProject (UPDATE):
```typescript
const updateProject = async (id: string, formData: ProjectFormData) => {
  try {
    setError(null);

    // Replace with your API endpoint
    const response = await fetch(`YOUR_API_ENDPOINT/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    const updatedProject = await response.json();

    const updated = projects.map(p => (p.id === id ? updatedProject : p));
    setProjects(updated);

    return updatedProject;
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to update project';
    setError(message);
    throw err;
  }
};
```

#### For deleteProject (DELETE):
```typescript
const deleteProject = async (id: string) => {
  try {
    setError(null);

    // Replace with your API endpoint
    await fetch(`YOUR_API_ENDPOINT/projects/${id}`, {
      method: 'DELETE',
    });

    const updated = projects.filter(project => project.id !== id);
    setProjects(updated);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to delete project';
    setError(message);
    throw err;
  }
};
```

### Step 2: Update Base URL

Define your API base URL at the top of `useProjects.ts`:

```typescript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

const response = await fetch(`${API_BASE_URL}/projects`);
```

### Step 3: Handle Authentication (if needed)

Add headers for authentication:

```typescript
const headers: HeadersInit = {
  'Content-Type': 'application/json',
};

if (process.env.REACT_APP_AUTH_TOKEN) {
  headers['Authorization'] = `Bearer ${process.env.REACT_APP_AUTH_TOKEN}`;
}

const response = await fetch('YOUR_API_ENDPOINT/projects', {
  method: 'POST',
  headers,
  body: JSON.stringify(formData),
});
```

## Features Included

- Full CRUD operations (Create, Read, Update, Delete)
- Real-time search filtering
- Status filtering (Active, Completed, On Hold)
- Responsive grid layout (1-3 columns based on screen size)
- Form validation
- Error handling
- Loading states
- Delete confirmation dialog
- Modal-based form for creating/editing
- Beautiful Tailwind CSS styling

## Frontend Components

### ProjectForm.tsx
Modal form for creating and editing projects with:
- Project name input
- Description textarea
- Status dropdown
- Start and end date pickers
- Form validation
- Loading states

### ProjectCard.tsx
Displays individual project with:
- Project name and status badge
- Description (truncated)
- Date range
- Edit and delete buttons
- Hover effects

### DeleteConfirmation.tsx
Confirmation modal for deletion with:
- Warning icon
- Confirmation message
- Cancel/Delete buttons
- Loading state

## Environment Variables

Create a `.env` file in the root with:

```
VITE_API_URL=http://localhost:3000/api
```

## Testing Locally

The app currently uses localStorage for demo purposes. To test:

1. Run `npm run dev`
2. Create a project using the "New Project" button
3. Edit or delete existing projects
4. Data persists in browser localStorage

Once you connect your database, all data will be stored there instead.

## Notes

- The project ID is auto-generated but should be replaced with your database's auto-generated IDs
- Timestamps (createdAt, updatedAt) are set on the frontend - consider setting them on the backend
- All dates are stored as ISO strings
- The application uses TypeScript for type safety
