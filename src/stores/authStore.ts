import { create } from 'zustand';
import type { AuthState, LoginCredentials, RegisterCredentials } from '../types';
import { authService } from '../services/authService';

interface AuthStore extends AuthState {
  // Actions
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (userData: RegisterCredentials) => Promise<boolean>;
  logout: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthStore>()((set) => ({
  // Estado inicial
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  // Actions
  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  clearError: () => {
    set({ error: null });
  },

  checkAuth: () => {
    const token = authService.getTokenFromCookies();
    const user = authService.getUserFromCookies();
    
    if (token && user) {
      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } else {
      // Si no hay token o user válidos, asegurarse de limpiar el estado
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  },

  login: async (credentials: LoginCredentials): Promise<boolean> => {
    set({ isLoading: true, error: null });

    try {
      const response = await authService.login(credentials);
      
      set({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      return true;
    } catch (error: unknown) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Error al iniciar sesión. Verifica tus credenciales.',
      });
      return false;
    }
  },

  register: async (userData: RegisterCredentials): Promise<boolean> => {
    set({ isLoading: true, error: null });

    try {
      await authService.register(userData);
      
      set({
        isLoading: false,
        error: null,
      });

      return true;
    } catch (error: unknown) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Error al crear la cuenta. Inténtalo de nuevo.',
      });
      return false;
    }
  },

  logout: async (): Promise<void> => {
    await authService.logout();
    
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  },
}));

// Hook para inicializar el estado desde cookies al cargar la app
export const initializeAuth = () => {
  useAuthStore.getState().checkAuth();
};