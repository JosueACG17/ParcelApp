import { useEffect, useMemo } from 'react';
import { useAlertStore } from '../stores/alertStore';
import { useParcelas } from './useParcelasData';
import { useSensores, useLecturasRecientes } from './useSensoresData';
import type { StatCardData } from '../components/dashboard/StatsGrid';
import { Leaf, Zap, Database, Bell } from 'lucide-react';

/**
 * Hook personalizado para manejar los datos del dashboard con datos reales de la API
 */
export const useDashboardData = () => {
  const { stats: alertStats, generateMockAlerts } = useAlertStore();
  const { parcelas, loading: parcelasLoading } = useParcelas();
  const { sensores, loading: sensoresLoading } = useSensores();
  const { lecturasRecientes, loading: lecturasLoading } = useLecturasRecientes();

  // Inicializar alertas mock (mantenemos esto hasta tener sistema de alertas real)
  useEffect(() => {
    generateMockAlerts();
  }, [generateMockAlerts]);

  // Convertir parcelas reales a formato ParcelCardData
  const parcelCards = useMemo(() => {
    return parcelas.map(parcela => ({
      id: parcela.id,
      name: parcela.nombre,
      status: parcela.isDeleted ? 'Inactiva' : 'Activa',
      crop: parcela.nombresCultivos.join(', ') || 'Sin cultivo',
      area: `${parcela.cantidadCultivos} cultivos`,
      progress: parcela.isDeleted ? 0 : 85,
      health: parcela.isDeleted ? 'Inactiva' : 'Excelente',
      coordinates: {
        lat: parcela.latitud,
        lon: parcela.longitud
      }
    }));
  }, [parcelas]);

  // Estadísticas del dashboard calculadas con datos reales
  const dashboardStats: StatCardData[] = useMemo(() => {
    const parcelasActivas = parcelas.filter(p => !p.isDeleted).length;
    const totalSensores = sensores.length;
    const lecturasHoy = lecturasRecientes.filter(l => {
      const today = new Date();
      const lecturaDate = new Date(l.timestamp);
      return lecturaDate.toDateString() === today.toDateString();
    }).length;

    return [
      { 
        title: 'Parcelas Activas', 
        value: parcelasActivas.toString(), 
        icon: Leaf, 
        color: 'from-green-400 to-emerald-500', 
        change: '+12%',
        trend: 'up' as const,
        description: `${parcelas.length} totales`
      },
      { 
        title: 'Sensores Instalados', 
        value: totalSensores.toString(), 
        icon: Zap, 
        color: 'from-blue-400 to-cyan-500', 
        change: '+8%',
        trend: 'up' as const,
        description: `${totalSensores} en total`
      },
      { 
        title: 'Lecturas Hoy', 
        value: lecturasHoy.toString(), 
        icon: Database, 
        color: 'from-yellow-400 to-orange-500', 
        change: '+25%',
        trend: 'up' as const,
        description: `${lecturasRecientes.length} recientes`
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
  }, [parcelas, sensores, lecturasRecientes, alertStats]);

  // Loading state general
  const isLoading = parcelasLoading || sensoresLoading || lecturasLoading;

  return {
    parcelas: parcelCards,
    dashboardStats,
    alertStats,
    sensores: sensores.length,
    lecturas: lecturasRecientes.length,
    isLoading,
  };
};