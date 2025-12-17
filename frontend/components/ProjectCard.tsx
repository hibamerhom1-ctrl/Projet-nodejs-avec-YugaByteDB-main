import { Project } from '../types';
import { Edit2, Trash2, Calendar } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
}

export function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  const statusColors = {
    active: 'bg-green-100 text-green-800',
    completed: 'bg-blue-100 text-blue-800',
    'on-hold': 'bg-yellow-100 text-yellow-800',
  };

  const formatDate = (date: string) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('fr-FR', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      active: 'En cours',
      completed: 'Terminé',
      'on-hold': 'En pause',
    };
    return labels[status] || status;
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{project.name}</h3>
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
              statusColors[project.status]
            }`}
          >
            {getStatusLabel(project.status)}
          </span>
        </div>
      </div>

      {project.description && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>
      )}

      <div className="space-y-2 mb-5 text-sm text-gray-500">
        {project.startDate && (
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            <span>
              {formatDate(project.startDate)} {project.endDate && `→ ${formatDate(project.endDate)}`}
            </span>
          </div>
        )}
      </div>

      <div className="flex gap-2 pt-4 border-t border-gray-100">
        <button
          onClick={() => onEdit(project)}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium text-sm"
        >
          <Edit2 size={16} />
          Modifier
        </button>
        <button
          onClick={() => onDelete(project.id)}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium text-sm"
        >
          <Trash2 size={16} />
          Supprimer
        </button>
      </div>
    </div>
  );
}
