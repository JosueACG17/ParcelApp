import { apiService } from './api';
import type { User } from '../types/auth';
import { API_ENDPOINTS } from '../utils/constants';

export interface UpdateUserRequest {
  nombre?: string;
  correo?: string;
  telefono?: string;
}

class UsersService {
  async getAllUsers(includeDeleted = false): Promise<User[]> {
    const url = includeDeleted 
      ? `${API_ENDPOINTS.USERS}?includeDeleted=true`
      : API_ENDPOINTS.USERS;
      
    const response = await apiService.get<User[]>(url);
    return response.data || [];
  }

  async getUserById(id: number): Promise<User> {
    const response = await apiService.get<User>(
      API_ENDPOINTS.USER_BY_ID(id)
    );
    return response.data!;
  }

  async updateUser(id: number, userData: UpdateUserRequest): Promise<void> {
    await apiService.put(API_ENDPOINTS.USER_BY_ID(id), userData);
  }

  async deleteUser(id: number): Promise<void> {
    await apiService.delete(API_ENDPOINTS.USER_BY_ID(id));
  }

  async restoreUser(id: number): Promise<void> {
    await apiService.patch(API_ENDPOINTS.USER_RESTORE(id));
  }
}

export const usersService = new UsersService();
export default usersService;