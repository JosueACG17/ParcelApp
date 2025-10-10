import { apiService } from './api';
import type { LogEntry, Role } from '../types/system';
import { API_ENDPOINTS } from '../utils/constants';

class SystemService {
  // Logs
  async getLogs(): Promise<LogEntry[]> {
    const response = await apiService.get<LogEntry[]>(API_ENDPOINTS.LOGS);
    return response.data || [];
  }

  // Roles
  async getRoles(): Promise<Role[]> {
    const response = await apiService.get<Role[]>(API_ENDPOINTS.ROLES);
    return response.data || [];
  }
}

export const systemService = new SystemService();
export default systemService;