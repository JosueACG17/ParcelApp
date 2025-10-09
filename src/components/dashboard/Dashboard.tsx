import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../stores/authStore';
import { useAlertStore } from '../../stores/alertStore';
import { useSensorData } from '../../hooks/useSensorData';
import { StatsGrid } from './StatsGrid';
import { ParcelCard, type ParcelCardData } from './ParcelCard';
import RealTimeSensors from './RealTimeSensors';
import SensorCharts from './SensorCharts';
import ProductionCharts from './ProductionCharts';
import ParcelMap from './ParcelMap';
import ParcelsCRUD from './ParcelsCRUD';
import UsersCRUD from './UsersCRUD';
import AlertsPage from '../../pages/AlertsPage';
import ConfirmModal from '../ui/ConfirmModal';
import Sidebar from '../layout/Sidebar';
import Topbar from '../layout/Topbar';
import type { DashboardTab } from '../../constants/dashboard';
import {
  MapPin,
  Bell,
  Filter,
  Home,
  Activity,
  PieChart,
  Users,
  Database,
  Zap,
  Leaf,
} from 'lucide-react';

const DashboardClean: React.FC = () => {
  const { logout } = useAuthStore();
  const { stats: alertStats, generateMockAlerts } = useAlertStore();
  const { sensorData } = useSensorData();
  
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

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

  // Estadísticas del dashboard
  const dashboardStats = [
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

  const tabs = [
    { id: 'overview', label: 'Resumen', icon: Home },
    { id: 'sensors', label: 'Sensores', icon: Activity },
    { id: 'analytics', label: 'Análisis', icon: PieChart },
    { id: 'map', label: 'Mapa', icon: MapPin },
    { id: 'parcels', label: 'Parcelas', icon: Database },
    { id: 'users', label: 'Usuarios', icon: Users },
    { id: 'alerts', label: 'Alertas', icon: Bell },
  ];

  // Funciones de manejo
  const handleLogout = () => {
    logout();
    setShowLogoutModal(false);
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  // Escuchar cambios de fullscreen
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            {/* Stats Grid */}
            <StatsGrid stats={dashboardStats} />

            {/* Sensores en Tiempo Real */}
            <RealTimeSensors />

            {/* Parcelas Recientes */}
            <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <Leaf className="w-6 h-6 text-green-600" />
                  Parcelas Recientes
                </h3>
                <button 
                  onClick={() => setActiveTab('parcels')}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Users className="w-4 h-4" />
                  Ver todas
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockParcels.map((parcel) => (
                  <ParcelCard
                    key={parcel.id}
                    parcel={parcel}
                    onClick={() => console.log('Clicked parcel:', parcel)}
                  />
                ))}
              </div>
            </div>
          </div>
        );

      case 'sensors':
        return (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                Monitoreo de Sensores
              </h2>
              <div className="flex items-center gap-2">
                <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl transition-colors">
                  <Filter className="w-4 h-4" />
                </button>
              </div>
            </div>
            <RealTimeSensors />
            <SensorCharts data={sensorData} />
          </div>
        );

      case 'analytics':
        return (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                Análisis y Producción
              </h2>
            </div>
            <ProductionCharts />
            <SensorCharts data={sensorData} />
          </div>
        );

      case 'map':
        return (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                Mapa de Parcelas
              </h2>
            </div>
            <ParcelMap />
          </div>
        );

      case 'parcels':
        return <ParcelsCRUD />;

      case 'users':
        return <UsersCRUD />;

      case 'alerts':
        return <AlertsPage />;

      default:
        return null;
    }
  };

  const activeAlerts = alertStats.total - alertStats.resolved;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabs={tabs}
        activeAlerts={activeAlerts}
        onLogout={() => setShowLogoutModal(true)}
      />

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Bar */}
        <Topbar
          onMenuClick={() => setSidebarOpen(true)}
          isFullScreen={isFullScreen}
          onToggleFullScreen={toggleFullScreen}
          activeAlerts={activeAlerts}
          onAlertsClick={() => setActiveTab('alerts')}
        />

        {/* Page Content */}
        <main className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Overlay para mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Modal de Logout */}
      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        title="Cerrar Sesión"
        message="¿Estás seguro de que deseas cerrar tu sesión? Tendrás que volver a iniciar sesión para acceder al dashboard."
        type="danger"
        confirmText="Cerrar Sesión"
        cancelText="Cancelar"
      />
    </div>
  );
};

export default DashboardClean;