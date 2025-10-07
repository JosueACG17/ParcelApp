export interface Alert {
  id: string;
  type: 'sensor' | 'system' | 'agricultural';
  severity: 'critical' | 'medium' | 'low';
  title: string;
  description: string;
  parcelId?: string;
  parcelName?: string;
  sensorId?: string;
  sensorType?: 'temperature' | 'humidity' | 'rain' | 'solarRadiation';
  timestamp: Date;
  isRead: boolean;
  isResolved: boolean;
  resolvedBy?: string;
  resolvedAt?: Date;
  value?: number;
  threshold?: number;
  unit?: string;
}

export interface AlertFilters {
  type?: 'sensor' | 'system' | 'agricultural' | 'all';
  severity?: 'critical' | 'medium' | 'low' | 'all';
  status?: 'unread' | 'read' | 'resolved' | 'active' | 'all';
  parcelId?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface AlertStats {
  total: number;
  critical: number;
  medium: number;
  low: number;
  unread: number;
  resolved: number;
}