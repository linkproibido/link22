import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { MovieGrid } from './components/MovieGrid';
import { MoviePlayer } from './components/MoviePlayer';
import { AdminRoute } from './components/AdminRoute';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useMovies } from './hooks/useMovies';
import { Movie, MovieCategory } from './types';

function HomePage() {
  const { loading: authLoading } = useAuth();
  const [activeCategory, setActiveCategory] = useState<MovieCategory | 'all'>('all');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { movies, loading: moviesLoading } = useMovies(
    activeCategory === 'all' ? undefined : activeCategory
  );

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleClosePlayer = () => {
    setSelectedMovie(null);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      <main className="container mx-auto px-3 md:px-4 py-4 md:py-8">
        {/* Hero Section */}
        <div className="mb-6 md:mb-12 text-center">
          <h1 className="text-2xl md:text-4xl lg:text-6xl font-bold text-black mb-2 md:mb-4">
            Bem-vindo ao <span className="text-red-600">Vazadinhas</span>
          </h1>
          <p className="text-sm md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Descubra e assista aos melhores filmes organizados por categoria
          </p>
        </div>

        {/* Category Title */}
        <div className="mb-4 md:mb-8">
          <h2 className="text-lg md:text-2xl font-bold text-black">
            {activeCategory === 'all' 
              ? 'Todos os Filmes' 
              : `${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}`
            }
          </h2>
          <div className="w-12 md:w-20 h-1 bg-red-600 mt-1 md:mt-2"></div>
        </div>

        {/* Movies Grid */}
        <MovieGrid
          movies={movies}
          onMovieClick={handleMovieClick}
          loading={moviesLoading}
        />
      </main>

      {/* Movie Player Modal */}
      {selectedMovie && (
        <MoviePlayer movie={selectedMovie} onClose={handleClosePlayer} />
      )}
    </div>
  );
}

function AppContent() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin10" element={<AdminRoute />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;