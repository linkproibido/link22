import React, { useState } from 'react';
import { Plus, Edit, Trash2, Save, X, LogOut, Users, CheckCircle, XCircle } from 'lucide-react';
import { Movie, MOVIE_CATEGORIES, MovieCategory, UserPlan } from '../types';
import { useMovies } from '../hooks/useMovies';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface AdminPanelProps {
  onClose: () => void;
}

export function AdminPanel({ onClose }: AdminPanelProps) {
  const { user, signOut } = useAuth();
  const { movies, loading, addMovie, updateMovie, deleteMovie } = useMovies();
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'movies' | 'plans'>('movies');
  const [pendingPlans, setPendingPlans] = useState<(UserPlan & { user_email: string })[]>([]);
  const [plansLoading, setPlanLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    embed_url: '',
    thumbnail_url: '',
    genre: 'romance' as MovieCategory,
    duration: '',
    tags: '',
  });

  React.useEffect(() => {
    if (activeTab === 'plans') {
      fetchPendingPlans();
    }
  }, [activeTab]);

  const fetchPendingPlans = async () => {
    setPlanLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_plans')
        .select(`
          *,
          users!inner(email)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const plansWithEmail = data.map(plan => ({
        ...plan,
        user_email: plan.users.email
      }));
      
      setPendingPlans(plansWithEmail);
    } catch (error) {
      console.error('Erro ao buscar planos pendentes:', error);
    } finally {
      setPlanLoading(false);
    }
  };

  const approvePlan = async (planId: string) => {
    try {
      const now = new Date();
      const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 dias

      const { error } = await supabase
        .from('user_plans')
        .update({
          status: 'active',
          activated_at: now.toISOString(),
          expires_at: expiresAt.toISOString()
        })
        .eq('id', planId);

      if (error) throw error;
      
      alert('Plano aprovado com sucesso!');
      fetchPendingPlans();
    } catch (error) {
      alert('Erro ao aprovar plano: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
    }
  };

  const rejectPlan = async (planId: string) => {
    if (!window.confirm('Tem certeza que deseja rejeitar este plano?')) return;

    try {
      const { error } = await supabase
        .from('user_plans')
        .delete()
        .eq('id', planId);

      if (error) throw error;
      
      alert('Plano rejeitado!');
      fetchPendingPlans();
    } catch (error) {
      alert('Erro ao rejeitar plano: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      embed_url: '',
      thumbnail_url: '',
      genre: 'romance',
      duration: '',
      tags: '',
    });
    setShowAddForm(false);
    setEditingMovie(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const movieData = {
        ...formData,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
        movie_url: formData.embed_url, // Para compatibilidade com o schema
      };

      if (editingMovie) {
        await updateMovie(editingMovie.id, movieData);
      } else {
        await addMovie(movieData);
      }
      resetForm();
    } catch (error) {
      alert('Erro ao salvar dorama: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
    }
  };

  const handleEdit = (movie: Movie) => {
    setFormData({
      title: movie.title,
      description: movie.description || '',
      embed_url: movie.embed_url || movie.movie_url || '',
      thumbnail_url: movie.thumbnail_url,
      genre: (movie.genre as MovieCategory) || 'romance',
      duration: movie.duration || '',
      tags: movie.tags ? movie.tags.join(', ') : '',
    });
    setEditingMovie(movie);
    setShowAddForm(true);
  };

  const handleDelete = async (movie: Movie) => {
    if (window.confirm(`Tem certeza que deseja deletar "${movie.title}"?`)) {
      try {
        await deleteMovie(movie.id);
      } catch (error) {
        alert('Erro ao deletar dorama: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      onClose();
    } catch (error) {
      alert('Erro ao fazer logout');
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="bg-red-600 p-2 rounded-lg">
                <Plus className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-black">Painel Administrativo</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Admin: {user.email}</span>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 text-gray-600 hover:text-black px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Sair</span>
              </button>
              <button
                onClick={onClose}
                className="text-gray-600 hover:text-black transition-colors p-2 hover:bg-gray-100 rounded-md"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('movies')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'movies'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Gerenciar Doramas
              </button>
              <button
                onClick={() => setActiveTab('plans')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'plans'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>Aprovar Planos</span>
                  {pendingPlans.length > 0 && (
                    <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                      {pendingPlans.length}
                    </span>
                  )}
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Movies Tab */}
        {activeTab === 'movies' && (
          <>
            {/* Add Movie Button */}
            <div className="mb-8">
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors shadow-sm"
              >
                <Plus className="h-5 w-5" />
                <span>Adicionar Novo Dorama</span>
              </button>
            </div>

            {/* Add/Edit Form */}
            {showAddForm && (
              <div className="mb-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-xl font-semibold text-black mb-6">
                  {editingMovie ? 'Editar Dorama' : 'Adicionar Novo Dorama'}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Título *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Gênero *
                      </label>
                      <select
                        required
                        value={formData.genre}
                        onChange={(e) => setFormData({ ...formData, genre: e.target.value as MovieCategory })}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      >
                        {MOVIE_CATEGORIES.map((category) => (
                          <option key={category.value} value={category.value}>
                            {category.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Duração
                      </label>
                      <input
                        type="text"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        placeholder="Ex: 16 episódios"
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tags (separadas por vírgula)
                      </label>
                      <input
                        type="text"
                        value={formData.tags}
                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                        placeholder="romance, comédia, escola"
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL do Vídeo (Embed) *
                    </label>
                    <input
                      type="url"
                      required
                      value={formData.embed_url}
                      onChange={(e) => setFormData({ ...formData, embed_url: e.target.value })}
                      placeholder="https://www.youtube.com/embed/..."
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      URL do embed do YouTube, Vimeo ou outro provedor
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL da Capa *
                    </label>
                    <input
                      type="url"
                      required
                      value={formData.thumbnail_url}
                      onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descrição/Sinopse
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>

                  <div className="flex items-center space-x-4">
                    <button
                      type="submit"
                      className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md flex items-center space-x-2 transition-colors"
                    >
                      <Save className="h-4 w-4" />
                      <span>{editingMovie ? 'Atualizar' : 'Adicionar'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Movies List */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-black">
                  Doramas Cadastrados ({movies.length})
                </h3>
              </div>
              
              <div className="p-6">
                {loading ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg animate-pulse">
                        <div className="flex space-x-4">
                          <div className="w-24 h-16 bg-gray-200 rounded"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : movies.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <div className="text-4xl mb-4">🎭</div>
                    <p>Nenhum dorama cadastrado ainda</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {movies.map((movie) => (
                      <div key={movie.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <div className="flex space-x-4">
                          <img
                            src={movie.thumbnail_url}
                            alt={movie.title}
                            className="w-24 h-16 object-cover rounded"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-black font-medium truncate">{movie.title}</h4>
                            <p className="text-gray-600 text-sm">{MOVIE_CATEGORIES.find(cat => cat.value === movie.genre)?.label}</p>
                            <p className="text-gray-500 text-xs">
                              {new Date(movie.created_at).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEdit(movie)}
                              className="text-blue-600 hover:text-blue-700 p-2 hover:bg-blue-50 rounded transition-colors"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(movie)}
                              className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Plans Tab */}
        {activeTab === 'plans' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-black">
                Planos Aguardando Aprovação ({pendingPlans.length})
              </h3>
            </div>
            
            <div className="p-6">
              {plansLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg animate-pulse">
                      <div className="flex justify-between items-center">
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-48"></div>
                          <div className="h-3 bg-gray-200 rounded w-32"></div>
                        </div>
                        <div className="flex space-x-2">
                          <div className="h-8 w-20 bg-gray-200 rounded"></div>
                          <div className="h-8 w-20 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : pendingPlans.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <div className="text-4xl mb-4">✅</div>
                  <p>Nenhum plano aguardando aprovação</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingPlans.map((plan) => (
                    <div key={plan.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="text-black font-medium">{plan.user_email}</h4>
                            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                              Pendente
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p>Valor: R$ {(plan.amount / 100).toFixed(2)}</p>
                            <p>Método: {plan.payment_method.toUpperCase()}</p>
                            <p>Solicitado em: {new Date(plan.created_at).toLocaleString('pt-BR')}</p>
                            {plan.payment_proof_url && (
                              <p>
                                <a 
                                  href={plan.payment_proof_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-700 underline"
                                >
                                  Ver comprovante
                                </a>
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <button
                            onClick={() => approvePlan(plan.id)}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm flex items-center space-x-1 transition-colors"
                          >
                            <CheckCircle className="h-4 w-4" />
                            <span>Aprovar</span>
                          </button>
                          <button
                            onClick={() => rejectPlan(plan.id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm flex items-center space-x-1 transition-colors"
                          >
                            <XCircle className="h-4 w-4" />
                            <span>Rejeitar</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}