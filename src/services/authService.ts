import { apiService } from './api';
import type { 
  LoginCredentials, 
  RegisterCredentials, 
  LoginResponse, 
  RegisterResponse,
  User 
} from '../types/auth';
import { API_ENDPOINTS } from '../utils/constants';

class AuthService {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await apiService.post<LoginResponse>(
      API_ENDPOINTS.LOGIN,
      credentials
    );
    
    if (response.data && response.data.token) {
      // Guardar token en cookies
      this.setAuthToken(response.data.token);
    }
    
    return response.data!;
  }

  async register(userData: RegisterCredentials): Promise<RegisterResponse> {
    // Remover confirmPassword antes de enviar
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...registerData } = userData;
    
    const response = await apiService.post<RegisterResponse>(
      API_ENDPOINTS.REGISTER,
      registerData
    );
    
    return response.data!;
  }

  async logout(): Promise<void> {
    // Limpiar cookies
    this.clearAuthToken();
    this.clearUser();
  }

  private setAuthToken(token: string): void {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 7); // 7 días
    
    document.cookie = `auth_token=${token}; expires=${expirationDate.toUTCString()}; path=/; SameSite=Strict`;
  }

  private clearAuthToken(): void {
    document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  }

  private clearUser(): void {
    document.cookie = 'user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  }

  getTokenFromCookies(): string | null {
    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('auth_token='));
    return tokenCookie ? tokenCookie.split('=')[1] : null;
  }

  getUserFromCookies(): User | null {
    const cookies = document.cookie.split(';');
    const userCookie = cookies.find(cookie => cookie.trim().startsWith('user='));
    
    if (userCookie) {
      try {
        const userJson = userCookie.split('=')[1];
        return JSON.parse(decodeURIComponent(userJson));
      } catch {
        return null;
      }
    }
    
    return null;
  }

  isAuthenticated(): boolean {
    return !!this.getTokenFromCookies();
  }
}

export const authService = new AuthService();
export default authService;