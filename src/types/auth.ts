export interface User {
  id: number;
  nombre: string;
  correo: string;
  telefono: string;
  isDeleted: boolean;
  roles: string[]; // Array de roles del usuario (Admin, User, etc.)
}

export interface LoginCredentials {
  correo: string;
  password: string;
}

export interface RegisterCredentials {
  nombre: string;
  correo: string;
  password: string;
  telefono: string;
  confirmPassword?: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterResponse {
  message: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}