import React from 'react';
import { Play, Calendar } from 'lucide-react';
import { Movie } from '../types';

interface MovieCardProps {
  movie: Movie;
  onClick: () => void;
}

export function MovieCard({ movie, onClick }: MovieCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 w-full"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-gray-100">
        <img
          src={movie.thumbnail_url}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
          }}
        />
        
        {/* Play overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
          <div className="bg-red-600 rounded-full p-3 opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300">
            <Play className="h-6 w-6 text-white fill-current" />
          </div>
        </div>

        {/* Category badge */}
        <div className="absolute top-2 left-2">
          <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-md font-medium">
            {movie.category.charAt(0).toUpperCase() + movie.category.slice(1)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        <h3 className="text-black font-semibold text-sm mb-1 line-clamp-2 group-hover:text-red-600 transition-colors leading-tight">
          {movie.title}
        </h3>
        
        {movie.description && (
          <p className="text-gray-600 text-xs mb-2 line-clamp-2 leading-relaxed">
            {movie.description}
          </p>
        )}

        <div className="flex items-center text-gray-500 text-xs mt-2">
          <Calendar className="h-3 w-3 mr-1" />
          <span>{formatDate(movie.created_at)}</span>
        </div>
      </div>
    </div>
  );
}