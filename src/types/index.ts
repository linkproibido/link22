export interface Movie {
  id: string;
  title: string;
  description?: string;
  embed_code: string;
  thumbnail_url: string;
  category: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
}

export type MovieCategory = 'action' | 'comedy' | 'drama' | 'horror' | 'sci-fi' | 'thriller' | 'romance' | 'documentary';

export const MOVIE_CATEGORIES: { value: MovieCategory; label: string }[] = [
  { value: 'action', label: 'Ação' },
  { value: 'comedy', label: 'Comédia' },
  { value: 'drama', label: 'Drama' },
  { value: 'horror', label: 'Terror' },
  { value: 'thriller', label: 'Suspense' },
  { value: 'romance', label: 'Romance' },
];