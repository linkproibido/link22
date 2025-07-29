export interface Movie {
  id: string;
  title: string;
  description?: string;
  embed_url?: string;
  thumbnail_url: string;
  movie_url: string;
  price?: number;
  genre?: string;
  duration?: string;
  is_active?: boolean;
  sales_count?: number;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  full_name?: string;
  role?: 'user' | 'admin';
  created_at: string;
}

export interface UserPlan {
  id: string;
  user_id: string;
  status: 'pending' | 'active' | 'expired';
  payment_proof_url?: string;
  payment_method: 'pix';
  amount: number;
  activated_at?: string;
  expires_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Purchase {
  id: string;
  user_id: string;
  movie_id: string;
  status: 'pending' | 'paid' | 'cancelled';
  payment_reference?: string;
  movie_link?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
}

export type MovieCategory = 'romance' | 'drama' | 'comedy' | 'action' | 'thriller' | 'historical';

export const MOVIE_CATEGORIES: { value: MovieCategory; label: string }[] = [
  { value: 'romance', label: 'Romance' },
  { value: 'drama', label: 'Drama' },
  { value: 'comedy', label: 'Comédia' },
  { value: 'action', label: 'Ação' },
  { value: 'thriller', label: 'Suspense' },
  { value: 'historical', label: 'Histórico' },
];