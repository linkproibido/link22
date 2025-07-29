import React from 'react';
import { Movie } from '../types';
import { DoramaCard } from './DoramaCard';

interface DoramaGridProps {
  doramas: Movie[];
  onDoramaClick: (dorama: Movie) => void;
  loading?: boolean;
}

export function DoramaGrid({ doramas, onDoramaClick, loading }: DoramaGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} className="bg-white rounded-lg overflow-hidden animate-pulse shadow-sm">
            <div className="aspect-[3/4] bg-gray-200"></div>
            <div className="p-3">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (doramas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-gray-600 text-center">
          <div className="text-4xl md:text-6xl mb-4">🎭</div>
          <h3 className="text-lg md:text-xl font-semibold mb-2">Nenhum dorama encontrado</h3>
          <p className="text-gray-500 text-sm md:text-base">Em breve novos doramas serão adicionados</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
      {doramas.map((dorama) => (
        <DoramaCard
          key={dorama.id}
          dorama={dorama}
          onClick={() => onDoramaClick(dorama)}
        />
      ))}
    </div>
  );
}