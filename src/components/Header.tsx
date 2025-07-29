import React, { useState } from 'react';
import { Play, Menu, X, Search, User, LogOut, Crown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useUserPlan } from '../hooks/useUserPlan';

interface HeaderProps {
  onLoginClick?: () => void;
  onPlanClick?: () => void;
}

export function Header({ onLoginClick, onPlanClick }: HeaderProps) {
  const { user, signOut } = useAuth();
  const { hasActivePlan } = useUserPlan();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      setMobileMenuOpen(false);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="bg-red-600 p-1.5 rounded-lg">
              <Play className="h-4 w-4 text-white fill-current" />
            </div>
            <h1 className="text-lg font-bold text-black">Vazadinhas</h1>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-xl mx-6">
            <div className="relative w-full flex">
              <input
                type="text"
                placeholder="Pesquisar doramas..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-l-full focus:outline-none focus:border-red-500 text-sm"
              />
              <button className="px-4 py-2 bg-gray-50 border border-l-0 border-gray-300 rounded-r-full hover:bg-gray-100 flex items-center justify-center">
                <Search className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          </div>

          {/* User Menu - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                {hasActivePlan && (
                  <div className="flex items-center space-x-1 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                    <Crown className="h-4 w-4" />
                    <span>Premium</span>
                  </div>
                )}
                <div className="flex items-center space-x-2 text-gray-700">
                  <User className="h-4 w-4" />
                  <span className="text-sm">{user.email}</span>
                </div>
                {!hasActivePlan && onPlanClick && (
                  <button
                    onClick={onPlanClick}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
                  >
                    Ativar Plano
                  </button>
                )}
                <button
                  onClick={handleSignOut}
                  className="text-gray-600 hover:text-black p-2 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </>
            ) : (
              <button
                onClick={onLoginClick}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
              >
                Entrar
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-700 hover:text-black p-2"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3">
          <div className="relative w-full flex">
            <input
              type="text"
              placeholder="Pesquisar doramas..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-l-full focus:outline-none focus:border-red-500 text-sm"
            />
            <button className="px-4 py-2 bg-gray-50 border border-l-0 border-gray-300 rounded-r-full hover:bg-gray-100 flex items-center justify-center">
              <Search className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-2">
            <div className="flex flex-col space-y-1">
              {user ? (
                <>
                  <div className="px-4 py-2 text-sm text-gray-600">
                    Logado como: {user.email}
                  </div>
                  {hasActivePlan ? (
                    <div className="flex items-center space-x-2 px-4 py-2 text-yellow-800">
                      <Crown className="h-4 w-4" />
                      <span className="text-sm font-medium">Plano Premium Ativo</span>
                    </div>
                  ) : (
                    onPlanClick && (
                      <button
                        onClick={() => {
                          onPlanClick();
                          setMobileMenuOpen(false);
                        }}
                        className="text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-md text-sm font-medium transition-colors"
                      >
                        Ativar Plano Premium
                      </button>
                    )
                  )}
                  <button
                    onClick={handleSignOut}
                    className="text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md text-sm font-medium transition-colors"
                  >
                    Sair
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    onLoginClick?.();
                    setMobileMenuOpen(false);
                  }}
                  className="text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-md text-sm font-medium transition-colors"
                >
                  Entrar
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}