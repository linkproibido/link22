import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { DoramaGrid } from './components/DoramaGrid';
import { DoramaPage } from './components/DoramaPage';
import { LoginModal } from './components/LoginModal';
import { PlanModal } from './components/PlanModal';
import { AdminRoute } from './components/AdminRoute';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useMovies } from './hooks/useMovies';
import { Movie } from './types';

function HomePage() {
  const { loading: authLoading } = useAuth();
  const [selectedDorama, setSelectedDorama] = useState<Movie | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);

  const { movies: doramas, loading: doramasLoading } = useMovies();

  const handleDoramaClick = (dorama: Movie) => {
    setSelectedDorama(dorama);
  };

  const handleBackToHome = () => {
    setSelectedDorama(null);
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

  if (selectedDorama) {
    return (
      <>
        <DoramaPage
          dorama={selectedDorama}
          onBack={handleBackToHome}
          onLoginClick={() => setShowLoginModal(true)}
          onPlanClick={() => setShowPlanModal(true)}
        />
        <LoginModal 
          isOpen={showLoginModal} 
          onClose={() => setShowLoginModal(false)} 
        />
        <PlanModal 
          isOpen={showPlanModal} 
          onClose={() => setShowPlanModal(false)} 
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header
        onLoginClick={() => setShowLoginModal(true)}
        onPlanClick={() => setShowPlanModal(true)}
      />

      <main className="container mx-auto px-3 md:px-4 py-4 md:py-8">
        {/* Hero Section */}
        <div className="mb-6 md:mb-12 text-center">
          <h1 className="text-2xl md:text-4xl lg:text-6xl font-bold text-black mb-2 md:mb-4">
            Bem-vindo ao <span className="text-red-600">Vazadinhas</span>
          </h1>
          <p className="text-sm md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Descubra e assista aos melhores doramas coreanos com qualidade HD
          </p>
        </div>

        {/* Featured Section */}
        <div className="mb-4 md:mb-8">
          <h2 className="text-lg md:text-2xl font-bold text-black">
            Doramas em Destaque
          </h2>
          <div className="w-12 md:w-20 h-1 bg-red-600 mt-1 md:mt-2"></div>
        </div>

        {/* Doramas Grid */}
        <DoramaGrid
          doramas={doramas}
          onDoramaClick={handleDoramaClick}
          loading={doramasLoading}
        />
      </main>

      {/* Modals */}
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
      <PlanModal 
        isOpen={showPlanModal} 
        onClose={() => setShowPlanModal(false)} 
      />
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