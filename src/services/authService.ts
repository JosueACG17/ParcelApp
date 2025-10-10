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
    
    // El token viene directamente en response
    const token = (response as { token?: string }).token;
    
    if (token) {
      // Guardar token en cookies
      this.setAuthToken(token);
      
      // Extraer usuario del token
      const user = this.extractUserFromToken(token);
      if (user) {
        this.setUser(user);
      }
      
      return { token, user } as LoginResponse;
    } else {
      throw new Error('No se recibió token válido del servidor');
    }
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

  private setUser(user: User): void {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 7); // 7 días
    
    const userJson = encodeURIComponent(JSON.stringify(user));
    document.cookie = `user=${userJson}; expires=${expirationDate.toUTCString()}; path=/; SameSite=Strict`;
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
    try {
      const cookies = document.cookie.split(';');
      const userCookie = cookies.find(cookie => cookie.trim().startsWith('user='));
      
      if (userCookie) {
        const userJson = userCookie.split('=')[1];
        const decodedJson = decodeURIComponent(userJson);
        const user = JSON.parse(decodedJson);
        return user;
      }
    } catch {
      // Error silencioso
    }
    
    return null;
  }

  isAuthenticated(): boolean {
    return !!this.getTokenFromCookies();
  }

  private extractUserFromToken(token: string): User | null {
    try {
      // Decodificar el JWT (solo el payload)
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const payload = JSON.parse(jsonPayload);

      // Extraer información del usuario del payload
      if (payload.sub && payload.email && payload.name) {
        return {
          id: parseInt(payload.sub),
          nombre: payload.name,
          correo: payload.email,
          telefono: '', // No está en el token, se puede obtener después
          isDeleted: false,
          role: payload.role || 'User' // Extraer el rol del token
        };
      }
    } catch {
      // Error silencioso, no mostrar en consola
    }
    
    return null;
  }
}

export const authService = new AuthService();
export default authService;