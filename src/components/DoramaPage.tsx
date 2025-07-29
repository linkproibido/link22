import React from 'react';
import { ArrowLeft, Play, Lock, Crown, Calendar, Tag, Clock } from 'lucide-react';
import { Movie } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useUserPlan } from '../hooks/useUserPlan';

interface DoramaPageProps {
  dorama: Movie;
  onBack: () => void;
  onLoginClick: () => void;
  onPlanClick: () => void;
}

export function DoramaPage({ dorama, onBack, onLoginClick, onPlanClick }: DoramaPageProps) {
  const { user } = useAuth();
  const { hasActivePlan } = useUserPlan();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const canWatchVideo = user && hasActivePlan;

  const renderVideoPlayer = () => {
    if (canWatchVideo && dorama.embed_url) {
      return (
        <div className="aspect-video bg-black rounded-lg overflow-hidden">
          <iframe
            src={dorama.embed_url}
            className="w-full h-full"
            frameBorder="0"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>
      );
    }

    return (
      <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center relative overflow-hidden">
        <img
          src={dorama.thumbnail_url}
          alt={dorama.title}
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="relative z-10 text-center text-white p-6">
          <div className="bg-red-600 rounded-full p-4 mx-auto mb-4 w-16 h-16 flex items-center justify-center">
            <Lock className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold mb-2">Conteúdo Premium</h3>
          <p className="text-gray-300 mb-4 max-w-md">
            {!user 
              ? 'Faça login para assistir este dorama'
              : 'Ative seu plano premium para assistir todos os doramas'
            }
          </p>
          {!user ? (
            <button
              onClick={onLoginClick}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Fazer Login
            </button>
          ) : (
            <button
              onClick={onPlanClick}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 mx-auto"
            >
              <Crown className="h-5 w-5" />
              <span>Ativar Plano Premium</span>
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Voltar</span>
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Video Player */}
            <div className="lg:col-span-2">
              {renderVideoPlayer()}
            </div>

            {/* Dorama Info */}
            <div className="space-y-6">
              {/* Thumbnail - Mobile only */}
              <div className="lg:hidden aspect-[3/4] rounded-lg overflow-hidden">
                <img
                  src={dorama.thumbnail_url}
                  alt={dorama.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Title and basic info */}
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-black mb-2">
                  {dorama.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                  {dorama.genre && (
                    <div className="flex items-center space-x-1">
                      <Tag className="h-4 w-4 text-red-600" />
                      <span className="bg-red-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                        {dorama.genre.charAt(0).toUpperCase() + dorama.genre.slice(1)}
                      </span>
                    </div>
                  )}
                  
                  {dorama.duration && (
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{dorama.duration}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(dorama.created_at)}</span>
                  </div>
                </div>

                {/* Premium badge */}
                {hasActivePlan && (
                  <div className="flex items-center space-x-2 bg-yellow-100 text-yellow-800 px-3 py-2 rounded-lg mb-4">
                    <Crown className="h-4 w-4" />
                    <span className="text-sm font-medium">Você tem acesso premium</span>
                  </div>
                )}
              </div>

              {/* Description */}
              {dorama.description && (
                <div>
                  <h3 className="text-lg font-semibold text-black mb-2">Sinopse</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {dorama.description}
                  </p>
                </div>
              )}

              {/* Tags */}
              {dorama.tags && dorama.tags.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-black mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {dorama.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Stats */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-black mb-2">Estatísticas</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Visualizações:</span>
                    <span className="font-medium">{dorama.sales_count || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Adicionado em:</span>
                    <span className="font-medium">{formatDate(dorama.created_at)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}