# API Integration Examples

This document provides example implementations for different backend technologies to help you connect your database to the React frontend.

## Example: Node.js + Express

### Backend Setup

```typescript
// server.ts
import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

// Example database (replace with your actual database)
const projects = [];

// CREATE
app.post('/api/projects', (req, res) => {
  const newProject = {
    id: Date.now().toString(),
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  projects.push(newProject);
  res.json(newProject);
});

// READ ALL
app.get('/api/projects', (req, res) => {
  res.json(projects);
});

// READ ONE
app.get('/api/projects/:id', (req, res) => {
  const project = projects.find(p => p.id === req.params.id);
  if (!project) return res.status(404).json({ error: 'Not found' });
  res.json(project);
});

// UPDATE
app.put('/api/projects/:id', (req, res) => {
  const index = projects.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Not found' });

  projects[index] = {
    ...projects[index],
    ...req.body,
    updatedAt: new Date().toISOString(),
  };

  res.json(projects[index]);
});

// DELETE
app.delete('/api/projects/:id', (req, res) => {
  const index = projects.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Not found' });

  projects.splice(index, 1);
  res.json({ success: true });
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

### Frontend Integration

In `src/hooks/useProjects.ts`, update the API calls:

```typescript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

const fetchProjects = async () => {
  try {
    setLoading(true);
    const response = await fetch(`${API_BASE_URL}/projects`);
    if (!response.ok) throw new Error('Failed to fetch');
    const data = await response.json();
    setProjects(data);
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to fetch projects');
  } finally {
    setLoading(false);
  }
};

const createProject = async (formData: ProjectFormData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    if (!response.ok) throw new Error('Failed to create');
    const newProject = await response.json();
    setProjects([...projects, newProject]);
    return newProject;
  } catch (err) {
    throw err;
  }
};

const updateProject = async (id: string, formData: ProjectFormData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    if (!response.ok) throw new Error('Failed to update');
    const updatedProject = await response.json();
    setProjects(projects.map(p => (p.id === id ? updatedProject : p)));
    return updatedProject;
  } catch (err) {
    throw err;
  }
};

const deleteProject = async (id: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete');
    setProjects(projects.filter(p => p.id !== id));
  } catch (err) {
    throw err;
  }
};
```

## Example: MongoDB + Express

```typescript
import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  name: String,
  description: String,
  status: String,
  startDate: String,
  endDate: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Project = mongoose.model('Project', projectSchema);

// CREATE
app.post('/api/projects', async (req, res) => {
  const project = new Project(req.body);
  await project.save();
  res.json(project);
});

// READ ALL
app.get('/api/projects', async (req, res) => {
  const projects = await Project.find();
  res.json(projects);
});

// UPDATE
app.put('/api/projects/:id', async (req, res) => {
  const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(project);
});

// DELETE
app.delete('/api/projects/:id', async (req, res) => {
  await Project.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});
```

## Example: Python + Flask

```python
from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)

projects = []

@app.route('/api/projects', methods=['POST'])
def create_project():
    data = request.json
    new_project = {
        'id': str(int(datetime.now().timestamp())),
        **data,
        'createdAt': datetime.now().isoformat(),
        'updatedAt': datetime.now().isoformat(),
    }
    projects.append(new_project)
    return jsonify(new_project)

@app.route('/api/projects', methods=['GET'])
def get_projects():
    return jsonify(projects)

@app.route('/api/projects/<id>', methods=['PUT'])
def update_project(id):
    project = next((p for p in projects if p['id'] == id), None)
    if not project:
        return jsonify({'error': 'Not found'}), 404

    data = request.json
    project.update({
        **data,
        'updatedAt': datetime.now().isoformat(),
    })
    return jsonify(project)

@app.route('/api/projects/<id>', methods=['DELETE'])
def delete_project(id):
    global projects
    projects = [p for p in projects if p['id'] != id]
    return jsonify({'success': True})

if __name__ == '__main__':
    app.run(debug=True, port=3000)
```

## Example: Next.js API Routes

```typescript
// pages/api/projects/index.ts
import { NextApiRequest, NextApiResponse } from 'next';

let projects = [];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    res.status(200).json(projects);
  } else if (req.method === 'POST') {
    const newProject = {
      id: Date.now().toString(),
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    projects.push(newProject);
    res.status(201).json(newProject);
  }
}

// pages/api/projects/[id].ts
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'PUT') {
    // Update logic
  } else if (req.method === 'DELETE') {
    // Delete logic
  }
}
```

## Adding Authentication

If your backend requires authentication, add headers to the React hook:

```typescript
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

const fetchProjects = async () => {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/projects`, { headers });
  // ... rest of code
};
```

## Error Handling Best Practices

```typescript
const createProject = async (formData: ProjectFormData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create project');
    }

    const newProject = await response.json();
    setProjects([...projects, newProject]);
    return newProject;
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error occurred';
    setError(message);
    throw err;
  }
};
```

## Testing Your API

Use tools like Postman or curl:

```bash
# Create
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Project",
    "description": "Test Description",
    "status": "active",
    "startDate": "2024-01-01",
    "endDate": "2024-12-31"
  }'

# Read all
curl http://localhost:3000/api/projects

# Update
curl -X PUT http://localhost:3000/api/projects/123 \
  -H "Content-Type: application/json" \
  -d '{"name": "Updated Name"}'

# Delete
curl -X DELETE http://localhost:3000/api/projects/123
```
