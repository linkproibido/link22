import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { UserPlan } from '../types';
import { useAuth } from '../contexts/AuthContext';

export function useUserPlan() {
  const { user } = useAuth();
  const [userPlan, setUserPlan] = useState<UserPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasActivePlan, setHasActivePlan] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserPlan();
    } else {
      setUserPlan(null);
      setHasActivePlan(false);
      setLoading(false);
    }
  }, [user]);

  const fetchUserPlan = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_plans')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setUserPlan(data || null);
      
      // Verificar se o plano está ativo
      if (data && data.status === 'active' && data.expires_at) {
        const expiresAt = new Date(data.expires_at);
        const now = new Date();
        setHasActivePlan(expiresAt > now);
      } else {
        setHasActivePlan(false);
      }
    } catch (error) {
      console.error('Erro ao buscar plano do usuário:', error);
      setUserPlan(null);
      setHasActivePlan(false);
    } finally {
      setLoading(false);
    }
  };

  const createPlanRequest = async (paymentProofUrl: string) => {
    if (!user) throw new Error('Usuário não logado');

    try {
      const { data, error } = await supabase
        .from('user_plans')
        .insert([{
          user_id: user.id,
          status: 'pending',
          payment_proof_url: paymentProofUrl,
          payment_method: 'pix',
          amount: 2000, // R$ 20,00 em centavos
        }])
        .select()
        .single();

      if (error) throw error;
      setUserPlan(data);
      return data;
    } catch (error) {
      throw error instanceof Error ? error : new Error('Erro ao criar solicitação de plano');
    }
  };

  return {
    userPlan,
    hasActivePlan,
    loading,
    createPlanRequest,
    refetch: fetchUserPlan,
  };
}