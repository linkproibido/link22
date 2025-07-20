import React, { useState } from 'react';
import { Play, Menu, X, Search } from 'lucide-react';
import { MOVIE_CATEGORIES, MovieCategory } from '../types';

interface HeaderProps {
  activeCategory: MovieCategory | 'all';
  onCategoryChange: (category: MovieCategory | 'all') => void;
}

export function Header({ activeCategory, onCategoryChange }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Main Header */}
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
                  placeholder="Pesquisar"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-l-full focus:outline-none focus:border-red-500 text-sm"
                />
                <button className="px-4 py-2 bg-gray-50 border border-l-0 border-gray-300 rounded-r-full hover:bg-gray-100 flex items-center justify-center">
                  <Search className="h-4 w-4 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-700 hover:text-black p-2"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            {/* Desktop Navigation - Hidden on mobile */}
            <nav className="hidden lg:flex items-center space-x-4">
              <button
                onClick={() => onCategoryChange('all')}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === 'all'
                    ? 'bg-red-600 text-white'
                    : 'text-gray-700 hover:text-black hover:bg-gray-100'
                }`}
              >
                Todos
              </button>
              {MOVIE_CATEGORIES.map((category) => (
                <button
                  key={category.value}
                  onClick={() => onCategoryChange(category.value)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                    activeCategory === category.value
                      ? 'bg-red-600 text-white'
                      : 'text-gray-700 hover:text-black hover:bg-gray-100'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Mobile Search Bar */}
          <div className="md:hidden pb-3">
            <div className="relative w-full flex">
              <input
                type="text"
                placeholder="Pesquisar"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-l-full focus:outline-none focus:border-red-500 text-sm"
              />
              <button className="px-4 py-2 bg-gray-50 border border-l-0 border-gray-300 rounded-r-full hover:bg-gray-100 flex items-center justify-center">
                <Search className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-2">
              <div className="flex flex-col space-y-1">
                <button
                  onClick={() => {
                    onCategoryChange('all');
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeCategory === 'all'
                      ? 'bg-red-600 text-white'
                      : 'text-gray-700 hover:text-black hover:bg-gray-100'
                  }`}
                >
                  Todos
                </button>
                {MOVIE_CATEGORIES.map((category) => (
                  <button
                    key={category.value}
                    onClick={() => {
                      onCategoryChange(category.value);
                      setMobileMenuOpen(false);
                    }}
                    className={`text-left px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeCategory === category.value
                        ? 'bg-red-600 text-white'
                        : 'text-gray-700 hover:text-black hover:bg-gray-100'
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Categories Bar - Below Header on Desktop/Tablet */}
      <div className="hidden md:block lg:hidden bg-white border-b border-gray-200 sticky top-14 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-2 py-3 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => onCategoryChange('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                activeCategory === 'all'
                  ? 'bg-red-600 text-white'
                  : 'text-gray-700 hover:text-black hover:bg-gray-100 border border-gray-300'
              }`}
            >
              Todos
            </button>
            {MOVIE_CATEGORIES.map((category) => (
              <button
                key={category.value}
                onClick={() => onCategoryChange(category.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                  activeCategory === category.value
                    ? 'bg-red-600 text-white'
                    : 'text-gray-700 hover:text-black hover:bg-gray-100 border border-gray-300'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}