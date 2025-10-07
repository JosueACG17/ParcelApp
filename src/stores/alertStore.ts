import { create } from 'zustand';
import type { Alert, AlertFilters, AlertStats } from '../types/alerts';

interface AlertStore {
  alerts: Alert[];
  filteredAlerts: Alert[];
  filters: AlertFilters;
  stats: AlertStats;
  isLoading: boolean;
  
  // Actions
  setAlerts: (alerts: Alert[]) => void;
  addAlert: (alert: Alert) => void;
  updateAlert: (id: string, updates: Partial<Alert>) => void;
  markAsRead: (id: string) => void;
  markAsResolved: (id: string, resolvedBy: string) => void;
  setFilters: (filters: AlertFilters) => void;
  applyFilters: () => void;
  generateMockAlerts: () => void;
  checkSensorAlerts: (sensorData: { temperature: number; humidity: number; solarRadiation: number; rain: number; time: string }[]) => void;
}

const generateMockAlerts = (): Alert[] => {
  const mockAlerts: Alert[] = [
    {
      id: '1',
      type: 'sensor',
      severity: 'critical',
      title: 'Temperatura Crítica',
      description: 'La temperatura en la Parcela Norte A1 ha alcanzado 45°C, superando el umbral crítico de 40°C.',
      parcelId: '1',
      parcelName: 'Parcela Norte A1',
      sensorId: 'temp_001',
      sensorType: 'temperature',
      timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutos atrás
      isRead: false,
      isResolved: false,
      value: 45,
      threshold: 40,
      unit: '°C'
    },
    {
      id: '2',
      type: 'sensor',
      severity: 'medium',
      title: 'Humedad Baja',
      description: 'La humedad en la Parcela Sur B3 está en 25%, por debajo del nivel recomendado.',
      parcelId: '2',
      parcelName: 'Parcela Sur B3',
      sensorId: 'hum_002',
      sensorType: 'humidity',
      timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutos atrás
      isRead: true,
      isResolved: false,
      value: 25,
      threshold: 30,
      unit: '%'
    },
    {
      id: '3',
      type: 'system',
      severity: 'critical',
      title: 'Sensor Desconectado',
      description: 'El sensor de lluvia en la Parcela Este C2 no ha enviado datos en los últimos 30 minutos.',
      parcelId: '3',
      parcelName: 'Parcela Este C2',
      sensorId: 'rain_003',
      sensorType: 'rain',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutos atrás
      isRead: false,
      isResolved: false
    },
    {
      id: '4',
      type: 'agricultural',
      severity: 'medium',
      title: 'Riego Programado',
      description: 'La Parcela Oeste D1 requiere riego basado en los niveles de humedad y pronóstico del tiempo.',
      parcelId: '4',
      parcelName: 'Parcela Oeste D1',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 horas atrás
      isRead: true,
      isResolved: false
    },
    {
      id: '5',
      type: 'sensor',
      severity: 'low',
      title: 'Radiación Solar Baja',
      description: 'La radiación solar promedio está 15% por debajo de lo esperado para esta época del año.',
      parcelId: '1',
      parcelName: 'Parcela Norte A1',
      sensorId: 'solar_001',
      sensorType: 'solarRadiation',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 horas atrás
      isRead: true,
      isResolved: true,
      resolvedBy: 'Sistema Automático',
      resolvedAt: new Date(Date.now() - 1000 * 60 * 60),
      value: 340,
      threshold: 400,
      unit: 'W/m²'
    }
  ];

  return mockAlerts;
};

const calculateStats = (alerts: Alert[]): AlertStats => {
  return {
    total: alerts.length,
    critical: alerts.filter(a => a.severity === 'critical').length,
    medium: alerts.filter(a => a.severity === 'medium').length,
    low: alerts.filter(a => a.severity === 'low').length,
    unread: alerts.filter(a => !a.isRead).length,
    resolved: alerts.filter(a => a.isResolved).length
  };
};

const filterAlerts = (alerts: Alert[], filters: AlertFilters): Alert[] => {
  return alerts.filter(alert => {
    // Filtro por tipo
    if (filters.type && filters.type !== 'all' && alert.type !== filters.type) {
      return false;
    }

    // Filtro por severidad
    if (filters.severity && filters.severity !== 'all' && alert.severity !== filters.severity) {
      return false;
    }

    // Filtro por estado
    if (filters.status && filters.status !== 'all') {
      switch (filters.status) {
        case 'unread':
          if (alert.isRead) return false;
          break;
        case 'read':
          if (!alert.isRead || alert.isResolved) return false;
          break;
        case 'resolved':
          if (!alert.isResolved) return false;
          break;
        case 'active':
          if (alert.isResolved) return false;
          break;
      }
    }

    // Filtro por parcela
    if (filters.parcelId && alert.parcelId !== filters.parcelId) {
      return false;
    }

    // Filtro por fecha
    if (filters.dateFrom && alert.timestamp < filters.dateFrom) {
      return false;
    }
    if (filters.dateTo && alert.timestamp > filters.dateTo) {
      return false;
    }

    return true;
  });
};

export const useAlertStore = create<AlertStore>((set, get) => ({
  alerts: [],
  filteredAlerts: [],
  filters: {
    type: 'all',
    severity: 'all',
    status: 'all'
  },
  stats: {
    total: 0,
    critical: 0,
    medium: 0,
    low: 0,
    unread: 0,
    resolved: 0
  },
  isLoading: false,

  setAlerts: (alerts) => {
    const stats = calculateStats(alerts);
    const filters = get().filters;
    const filteredAlerts = filterAlerts(alerts, filters);
    
    set({ 
      alerts, 
      stats, 
      filteredAlerts 
    });
  },

  addAlert: (alert) => {
    const currentAlerts = get().alerts;
    const newAlerts = [alert, ...currentAlerts];
    const stats = calculateStats(newAlerts);
    const filters = get().filters;
    const filteredAlerts = filterAlerts(newAlerts, filters);
    
    set({ 
      alerts: newAlerts, 
      stats, 
      filteredAlerts 
    });
  },

  updateAlert: (id, updates) => {
    const alerts = get().alerts.map(alert => 
      alert.id === id ? { ...alert, ...updates } : alert
    );
    const stats = calculateStats(alerts);
    const filters = get().filters;
    const filteredAlerts = filterAlerts(alerts, filters);
    
    set({ 
      alerts, 
      stats, 
      filteredAlerts 
    });
  },

  markAsRead: (id) => {
    get().updateAlert(id, { isRead: true });
  },

  markAsResolved: (id, resolvedBy) => {
    get().updateAlert(id, { 
      isResolved: true, 
      resolvedBy, 
      resolvedAt: new Date() 
    });
  },

  setFilters: (filters) => {
    const alerts = get().alerts;
    const filteredAlerts = filterAlerts(alerts, filters);
    
    set({ 
      filters, 
      filteredAlerts 
    });
  },

  applyFilters: () => {
    const alerts = get().alerts;
    const filters = get().filters;
    const filteredAlerts = filterAlerts(alerts, filters);
    
    set({ filteredAlerts });
  },

  generateMockAlerts: () => {
    const mockAlerts = generateMockAlerts();
    get().setAlerts(mockAlerts);
  },

  checkSensorAlerts: (sensorData) => {
    // Función para generar alertas basadas en datos de sensores
    const newAlerts: Alert[] = [];
    const currentTime = new Date();

    sensorData.forEach((data, index) => {
      // Verificar temperatura crítica
      if (data.temperature > 35) {
        newAlerts.push({
          id: `temp_alert_${Date.now()}_${index}`,
          type: 'sensor',
          severity: data.temperature > 40 ? 'critical' : 'medium',
          title: `Temperatura ${data.temperature > 40 ? 'Crítica' : 'Alta'}`,
          description: `La temperatura ha alcanzado ${data.temperature.toFixed(1)}°C`,
          sensorType: 'temperature',
          timestamp: currentTime,
          isRead: false,
          isResolved: false,
          value: data.temperature,
          threshold: 35,
          unit: '°C'
        });
      }

      // Verificar humedad baja
      if (data.humidity < 30) {
        newAlerts.push({
          id: `hum_alert_${Date.now()}_${index}`,
          type: 'sensor',
          severity: data.humidity < 20 ? 'critical' : 'medium',
          title: 'Humedad Baja',
          description: `La humedad está en ${data.humidity.toFixed(1)}%`,
          sensorType: 'humidity',
          timestamp: currentTime,
          isRead: false,
          isResolved: false,
          value: data.humidity,
          threshold: 30,
          unit: '%'
        });
      }
    });

    // Agregar las nuevas alertas
    newAlerts.forEach(alert => get().addAlert(alert));
  }
}));