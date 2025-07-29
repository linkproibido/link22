import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Movie, MovieCategory } from '../types';

export function useMovies(category?: MovieCategory) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMovies();
  }, [category]);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('movies')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (category) {
        query = query.eq('genre', category);
      }

      const { data, error } = await query;

      if (error) throw error;
      setMovies(data || []);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao carregar doramas');
    } finally {
      setLoading(false);
    }
  };

  const getMovieById = async (id: string): Promise<Movie | null> => {
    try {
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao buscar dorama:', error);
      return null;
    }
  };

  const addMovie = async (movie: Omit<Movie, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('movies')
        .insert([{
          ...movie,
          is_active: true,
          sales_count: 0,
          price: 2000, // R$ 20,00 em centavos
        }])
        .select()
        .single();

      if (error) throw error;
      setMovies(prev => [data, ...prev]);
      return data;
    } catch (error) {
      throw error instanceof Error ? error : new Error('Erro ao adicionar dorama');
    }
  };

  const updateMovie = async (id: string, updates: Partial<Movie>) => {
    try {
      const { data, error } = await supabase
        .from('movies')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setMovies(prev => prev.map(movie => movie.id === id ? data : movie));
      return data;
    } catch (error) {
      throw error instanceof Error ? error : new Error('Erro ao atualizar dorama');
    }
  };

  const deleteMovie = async (id: string) => {
    try {
      const { error } = await supabase
        .from('movies')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;
      setMovies(prev => prev.filter(movie => movie.id !== id));
    } catch (error) {
      throw error instanceof Error ? error : new Error('Erro ao deletar dorama');
    }
  };

  return {
    movies,
    loading,
    error,
    addMovie,
    updateMovie,
    deleteMovie,
    getMovieById,
    refetch: fetchMovies,
  };
}