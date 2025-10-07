import { create } from 'zustand';
import type { User, AuthState } from '../types';

interface AuthStore extends AuthState {
  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

// Función para obtener user de cookies
const getUserFromCookies = (): User | null => {
  if (typeof document === 'undefined') return null;
  const cookies = document.cookie.split(';');
  const userCookie = cookies.find(cookie => cookie.trim().startsWith('user='));
  if (userCookie) {
    try {
      return JSON.parse(decodeURIComponent(userCookie.split('=')[1]));
    } catch {
      return null;
    }
  }
  return null;
};

// Función para obtener token de cookies
const getTokenFromCookies = (): string | null => {
  if (typeof document === 'undefined') return null;
  const cookies = document.cookie.split(';');
  const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('auth_token='));
  return tokenCookie ? tokenCookie.split('=')[1] : null;
};

// Función para establecer cookie
const setCookie = (name: string, value: string, days: number = 7) => {
  if (typeof document === 'undefined') return;
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/`;
};

// Función para eliminar cookie
const deleteCookie = (name: string) => {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

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

      login: async (email: string, _password: string): Promise<boolean> => {
        set({ isLoading: true, error: null });

        try {
          // Simulamos una llamada a la API
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Aquí harías la validación real de credenciales
          // Por ahora, simulamos que cualquier email/password es válido
          
          const mockUser: User = {
            id: '1',
            email,
            name: email.split('@')[0],
            role: 'user',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          const mockToken = 'mock-jwt-token-' + Date.now();

          setCookie('auth_token', mockToken);
          setCookie('user', encodeURIComponent(JSON.stringify(mockUser)));

          set({
            user: mockUser,
            token: mockToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          return true;
        } catch {
          set({
            isLoading: false,
            error: 'Error al iniciar sesión. Verifica tus credenciales.',
          });
          return false;
        }
      },

      register: async (name: string, email: string, _password: string): Promise<boolean> => {
        set({ isLoading: true, error: null });

        try {
          // Simulamos una llamada a la API
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const mockUser: User = {
            id: Date.now().toString(),
            email,
            name,
            role: 'user',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          const mockToken = 'mock-jwt-token-' + Date.now();

          setCookie('auth_token', mockToken);
          setCookie('user', encodeURIComponent(JSON.stringify(mockUser)));

          set({
            user: mockUser,
            token: mockToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          return true;
        } catch {
          set({
            isLoading: false,
            error: 'Error al crear la cuenta. Inténtalo de nuevo.',
          });
          return false;
        }
      },

      logout: () => {
        deleteCookie('auth_token');
        deleteCookie('user');
        
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
  const token = getTokenFromCookies();
  const user = getUserFromCookies();
  
  if (token && user) {
    useAuthStore.setState({
      user,
      token,
      isAuthenticated: true,
      isLoading: false,
      error: null,
    });
  }
};