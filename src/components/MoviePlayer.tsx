import React from 'react';
import { X, Calendar, Tag } from 'lucide-react';
import { Movie } from '../types';
import { MOVIE_CATEGORIES } from '../types';

interface MoviePlayerProps {
  movie: Movie;
  onClose: () => void;
}

export function MoviePlayer({ movie, onClose }: MoviePlayerProps) {
  const categoryLabel = MOVIE_CATEGORIES.find(cat => cat.value === movie.category)?.label || movie.category;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderEmbedCode = (embedCode: string) => {
    // Sanitize and render the embed code safely
    return { __html: embedCode };
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-2 md:p-4">
      <div className="w-full max-w-6xl mx-auto bg-white rounded-lg overflow-hidden shadow-2xl max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-3 md:p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h2 className="text-lg md:text-xl font-bold text-black truncate pr-4">{movie.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-black transition-colors p-2 hover:bg-gray-100 rounded-md"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 md:gap-6 p-3 md:p-6">
          {/* Video Player */}
          <div className="lg:col-span-2">
            <div className="aspect-video bg-black rounded-lg overflow-hidden">
              <div 
                className="w-full h-full"
                dangerouslySetInnerHTML={renderEmbedCode(movie.embed_code)}
              />
            </div>
          </div>

          {/* Movie Info */}
          <div className="space-y-4 md:space-y-6">
            {/* Thumbnail */}
            <div className="aspect-video rounded-lg overflow-hidden lg:block hidden">
              <img
                src={movie.thumbnail_url}
                alt={movie.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
                }}
              />
            </div>

            {/* Details */}
            <div className="space-y-3 md:space-y-4">
              <div className="flex items-center space-x-2">
                <Tag className="h-4 w-4 text-red-600" />
                <span className="bg-red-600 text-white text-xs md:text-sm px-3 py-1 rounded-full font-medium">
                  {categoryLabel}
                </span>
              </div>

              <div className="flex items-center space-x-2 text-gray-600">
                <Calendar className="h-4 w-4" />
                <span className="text-xs md:text-sm">{formatDate(movie.created_at)}</span>
              </div>

              {movie.description && (
                <div>
                  <h3 className="text-black font-semibold mb-2 text-sm md:text-base">Descrição</h3>
                  <p className="text-gray-700 text-xs md:text-sm leading-relaxed">
                    {movie.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}