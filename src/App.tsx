import { useState, useMemo } from 'react';
import { Plus, Search, Loader, AlertCircle, RefreshCw } from 'lucide-react';
import { useProjects } from '@frontend/hooks/useProjects';
import { ProjectForm } from '@frontend/components/ProjectForm';
import { ProjectCard } from '@frontend/components/ProjectCard';
import { DeleteConfirmation } from '@frontend/components/DeleteConfirmation';
import { SuccessNotification } from '@frontend/components/SuccessNotification';
import { Project, ProjectFormData } from '@frontend/types';

function App() {
  const { projects, loading, error, fetchProjects, createProject, updateProject, deleteProject } = useProjects();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed' | 'on-hold'>(
    'all'
  );
  const [sortBy, setSortBy] = useState<'date-asc' | 'date-desc' | 'name-asc' | 'name-desc'>('date-desc');
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const filteredAndSortedProjects = useMemo(() => {
    // Filtrage
    let filtered = projects.filter(project => {
      const matchesSearch =
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    // Tri
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        case 'date-asc':
          return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
        case 'name-asc':
          return a.name.localeCompare(b.name, 'fr');
        case 'name-desc':
          return b.name.localeCompare(a.name, 'fr');
        default:
          return 0;
      }
    });

    return filtered;
  }, [projects, searchTerm, statusFilter, sortBy]);

  const handleCreateSubmit = async (formData: ProjectFormData) => {
    await createProject(formData);
    setSuccessMessage(`Le projet "${formData.name}" a été créé avec succès !`);
  };

  const handleUpdateSubmit = async (formData: ProjectFormData) => {
    if (editingProject) {
      await updateProject(editingProject.id, formData);
      setEditingProject(undefined);
      setSuccessMessage(`Les modifications du projet "${formData.name}" ont été enregistrées.`);
    }
  };

  const handleDeleteConfirm = async () => {
    if (deleteTarget) {
      try {
        setIsDeleting(true);
        const projectName = deleteTarget.name;
        await deleteProject(deleteTarget.id);
        setDeleteTarget(null);
        setSuccessMessage(`Le projet "${projectName}" a été supprimé.`);
      } catch (err) {
        console.error('Erreur lors de la suppression:', err);
        // Le message d'erreur sera géré par le hook useProjects
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingProject(undefined);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mes Projets</h1>
              <p className="text-gray-600 text-sm mt-1">Gérez et suivez l'avancement de vos projets</p>
            </div>
            <button
              onClick={() => {
                setEditingProject(undefined);
                setShowForm(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
            >
              <Plus size={20} />
              Nouveau Projet
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Rechercher un projet par nom ou description..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <select
            value={statusFilter}
            onChange={e =>
              setStatusFilter(e.target.value as 'all' | 'active' | 'completed' | 'on-hold')
            }
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tous les statuts</option>
            <option value="active">En cours</option>
            <option value="completed">Terminé</option>
            <option value="on-hold">En pause</option>
          </select>

          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as 'date-asc' | 'date-desc' | 'name-asc' | 'name-desc')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="date-desc">Plus récent</option>
            <option value="date-asc">Plus ancien</option>
            <option value="name-asc">Nom A-Z</option>
            <option value="name-desc">Nom Z-A</option>
          </select>
        </div>

        {error && (
          <div className="mb-6 p-6 bg-gradient-to-r from-red-50 to-rose-50 border-l-4 border-red-500 rounded-xl shadow-lg">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-red-600 mt-0.5" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-red-900 mb-2">Erreur de connexion</h3>
                <p className="text-red-700 mb-4">{error}</p>
                <div className="bg-white/60 rounded-lg p-4 mb-4">
                  <p className="text-sm font-semibold text-gray-800 mb-2">Pour résoudre ce problème :</p>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                    <li className="mb-1">
                      <strong>Démarrer YugaByteDB :</strong> Exécutez <code className="bg-gray-100 px-2 py-0.5 rounded text-xs">docker-compose up -d</code> depuis la racine du projet
                    </li>
                    <li className="mb-1">
                      <strong>Aller dans le dossier backend :</strong> <code className="bg-gray-100 px-2 py-0.5 rounded text-xs">cd backend</code>
                    </li>
                    <li className="mb-1">
                      <strong>Installer les dépendances :</strong> <code className="bg-gray-100 px-2 py-0.5 rounded text-xs">npm install</code>
                    </li>
                    <li className="mb-1">
                      <strong>Initialiser la base de données :</strong> <code className="bg-gray-100 px-2 py-0.5 rounded text-xs">npm run init-db</code>
                    </li>
                    <li className="mb-1">
                      <strong>Démarrer le serveur :</strong> <code className="bg-gray-100 px-2 py-0.5 rounded text-xs">npm run dev</code>
                    </li>
                    <li>
                      <strong>Vérifier :</strong> Assurez-vous que le serveur fonctionne sur <code className="bg-gray-100 px-2 py-0.5 rounded text-xs">http://localhost:3000</code>
                    </li>
                  </ol>
                </div>
                <button
                  onClick={() => fetchProjects()}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  <RefreshCw size={18} />
                  Réessayer
                </button>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="animate-spin text-blue-600" size={32} />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Impossible de charger les projets</p>
            <p className="text-gray-400 text-sm mt-2">Vérifiez le message d'erreur ci-dessus</p>
          </div>
        ) : filteredAndSortedProjects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {projects.length === 0 ? 'Aucun projet pour le moment.' : 'Aucun projet ne correspond à votre recherche.'}
            </p>
            {projects.length === 0 && (
              <button
                onClick={() => setShowForm(true)}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
              >
                Créer votre premier projet
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedProjects.map(project => (
              <ProjectCard
                key={project.id}
                project={project}
                onEdit={handleEdit}
                onDelete={id => setDeleteTarget(projects.find(p => p.id === id) || null)}
              />
            ))}
          </div>
        )}
      </main>

      {showForm && (
        <ProjectForm
          project={editingProject}
          onSubmit={editingProject ? handleUpdateSubmit : handleCreateSubmit}
          onClose={handleFormClose}
        />
      )}

      {deleteTarget && (
        <DeleteConfirmation
          projectName={deleteTarget.name}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
          isLoading={isDeleting}
        />
      )}

      {successMessage && (
        <SuccessNotification
          message={successMessage}
          onClose={() => setSuccessMessage(null)}
        />
      )}
    </div>
  );
}

export default App;
