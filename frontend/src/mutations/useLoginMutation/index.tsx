import { useMutation } from '@tanstack/react-query';
import { api } from '../../api/apiClient';

interface LoginData {
  username: string;
  password: string;
}

export function useLoginMutation() {
  return useMutation({
    mutationFn: async (data: LoginData) => {
      const payload = {
        grant_type: 'password',
        username: data.username,
        password: data.password,
      };
      const response = await api.post('/auth/login', payload, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      return response.data;
    },
  });
}
