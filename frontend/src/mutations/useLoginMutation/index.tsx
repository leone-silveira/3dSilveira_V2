import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../api/apiClient';

interface LoginData {
  username: string;
  password: string;
}

export function useLoginMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ password, username }: LoginData) => {
      const payload = {
        grant_type: 'password',
        username,
        password,
      };
      const response = await api.post('/auth/login', payload, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      return response.data;
    },
    onSuccess: () => {
      // Refresh the auth-me query so AuthContext updates everywhere
      queryClient.invalidateQueries({ queryKey: ['auth-me'] });
    },
  });
}
