import { useState, type ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { SystemContext } from './useSystem';
import { AuthContext } from './useAuth';
import { authApi } from '../api/authApi';

export function AppProviders({ children }: { children: ReactNode }) {
  const [system, setSystem] = useState<string>('dashboard');

  const { data: user = null, isLoading, refetch } = useQuery({
    queryKey: ['auth-me'],
    queryFn: async () => {
      try {
        const res = await authApi.me();
        return res.data;
      } catch {
        return null;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, isLoading, refetchAuth: refetch }}>
      <SystemContext.Provider value={{ system, setSystem }}>
        {children}
      </SystemContext.Provider>
    </AuthContext.Provider>
  );
}
