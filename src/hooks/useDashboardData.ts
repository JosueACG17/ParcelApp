import { useEffect } from 'react';
import { useAlertStore } from '../stores/alertStore';
import { useSensorData } from './useSensorData';
import type { StatCardData } from '../components/dashboard/StatsGrid';
import type { ParcelCardData } from '../components/dashboard/ParcelCard';
import { Leaf, Zap, Database, Bell } from 'lucide-react';

/**
 * Hook personalizado para manejar los datos del dashboard
 * Centraliza la lógica de datos mock y preparación para la API real
 */
export const useDashboardData = () => {
  const { stats: alertStats, generateMockAlerts } = useAlertStore();
  const { sensorData } = useSensorData();

  // Inicializar alertas mock
  useEffect(() => {
    generateMockAlerts();
  }, [generateMockAlerts]);

  // Datos mock de parcelas - TODO: Reemplazar con API real
  const mockParcels: ParcelCardData[] = [
    { id: 1, name: 'Parcela Norte A1', status: 'Activa', crop: 'Maíz', area: '12.5 ha', progress: 75, health: 'Excelente' },
    { id: 2, name: 'Parcela Sur B3', status: 'En preparación', crop: 'Trigo', area: '8.2 ha', progress: 45, health: 'Buena' },
    { id: 3, name: 'Parcela Este C2', status: 'Cosechada', crop: 'Soja', area: '15.0 ha', progress: 100, health: 'Excelente' },
    { id: 4, name: 'Parcela Oeste D1', status: 'Activa', crop: 'Girasol', area: '6.8 ha', progress: 60, health: 'Regular' },
  ];

  // Estadísticas del dashboard - TODO: Reemplazar con datos reales de la API
  const dashboardStats: StatCardData[] = [
    { 
      title: 'Parcelas Activas', 
      value: '24', 
      icon: Leaf, 
      color: 'from-green-400 to-emerald-500', 
      change: '+12%',
      trend: 'up' as const,
      description: '4 nuevas este mes'
    },
    { 
      title: 'Sensores Activos', 
      value: '156', 
      icon: Zap, 
      color: 'from-blue-400 to-cyan-500', 
      change: '+8%',
      trend: 'up' as const,
      description: '98.7% operativo'
    },
    { 
      title: 'Producción Estimada', 
      value: '342.5', 
      icon: Database, 
      color: 'from-yellow-400 to-orange-500', 
      change: '+25%',
      trend: 'up' as const,
      description: 'Ton. este trimestre'
    },
    { 
      title: 'Alertas Activas', 
      value: (alertStats.total - alertStats.resolved).toString(), 
      icon: Bell, 
      color: 'from-red-400 to-pink-500', 
      change: alertStats.critical > 0 ? '+' + alertStats.critical + '%' : '-15%',
      trend: alertStats.critical > 0 ? 'up' as const : 'down' as const,
      description: `${alertStats.critical} críticas, ${alertStats.medium} medias`
    },
  ];

  return {
    sensorData,
    dashboardStats,
    mockParcels,
    alertStats,
  };
};