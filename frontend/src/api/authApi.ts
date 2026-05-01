import { api } from './apiClient';

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  role: string;
  activate: boolean;
}

export const authApi = {
  me: () => api.get<AuthUser>('/auth/me'),
  logout: () => api.post('/auth/logout'),
};
