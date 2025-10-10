// Tipos para el sistema (logs, roles, etc.)

export interface LogEntry {
  id: string | number;
  timestamp: string;
  level: 'INFO' | 'WARNING' | 'ERROR' | 'DEBUG';
  message: string;
  source: string;
  details?: Record<string, unknown>;
}

export interface Role {
  id: number;
  nombre: string;
  descripcion: string;
}

export interface SystemStats {
  totalUsers: number;
  totalParcelas: number;
  totalSensores: number;
  totalLecturas: number;
  activeSensors: number;
  lastActivity: string;
}