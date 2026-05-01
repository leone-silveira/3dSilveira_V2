import { createContext, useContext } from 'react';
import type { AuthUser } from '../api/authApi';

export interface AuthContextData {
  user: AuthUser | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  refetchAuth: () => void;
}

export const AuthContext = createContext<AuthContextData>({
  user: null,
  isLoggedIn: false,
  isLoading: true,
  refetchAuth: () => {},
});

export const useAuth = () => useContext(AuthContext);
