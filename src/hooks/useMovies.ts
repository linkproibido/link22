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
        .order('created_at', { ascending: false });

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query;

      if (error) throw error;
      setMovies(data || []);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao carregar filmes');
    } finally {
      setLoading(false);
    }
  };

  const addMovie = async (movie: Omit<Movie, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('movies')
        .insert([{
          ...movie,
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      setMovies(prev => [data, ...prev]);
      return data;
    } catch (error) {
      throw error instanceof Error ? error : new Error('Erro ao adicionar filme');
    }
  };

  const updateMovie = async (id: string, updates: Partial<Movie>) => {
    try {
      const { data, error } = await supabase
        .from('movies')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setMovies(prev => prev.map(movie => movie.id === id ? data : movie));
      return data;
    } catch (error) {
      throw error instanceof Error ? error : new Error('Erro ao atualizar filme');
    }
  };

  const deleteMovie = async (id: string) => {
    try {
      const { error } = await supabase
        .from('movies')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setMovies(prev => prev.filter(movie => movie.id !== id));
    } catch (error) {
      throw error instanceof Error ? error : new Error('Erro ao deletar filme');
    }
  };

  return {
    movies,
    loading,
    error,
    addMovie,
    updateMovie,
    deleteMovie,
    refetch: fetchMovies,
  };
}