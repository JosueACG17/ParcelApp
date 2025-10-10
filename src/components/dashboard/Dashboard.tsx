import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../stores/authStore';
import { useAlertStore } from '../../stores/alertStore';
import { useDashboardData } from '../../hooks/useDashboardData';
import { StatsGrid } from './StatsGrid';
import { ParcelCard } from './ParcelCard';
import SensorMonitor from './SensorMonitor';
import SensorCharts from './SensorCharts';
import ProductionCharts from './ProductionCharts';
import MapaParcelas from './MapaParcelas';
import ParcelsCRUD from './ParcelsCRUD';
import CultivosCRUD from './CultivosCRUD';
import SensorsCRUD from './SensorsCRUD';
import UsersCRUD from './UsersCRUD';
import LogsPage from '../../pages/LogsPage';
import ConfirmModal from '../ui/ConfirmModal';
import Sidebar from '../layout/Sidebar';
import Topbar from '../layout/Topbar';
import UserDashboard from './UserDashboard';
import type { DashboardTab } from '../../constants/dashboard';
import {
  MapPin,
  Filter,
  Home,
  Activity,
  PieChart,
  Users,
  Database,
  Bell,
  Leaf,
} from 'lucide-react';


const Dashboard: React.FC = () => {
  const { user } = useAuthStore();

  // Si el usuario es Admin, mostrar el dashboard completo
  // Si es User, mostrar el dashboard limitado
  const isAdmin = user?.role === 'Admin';

  if (isAdmin) {
    return <AdminDashboard />;
  } else {
    return <UserDashboard />;
  }
};

// Dashboard completo para administradores
const AdminDashboard: React.FC = () => {
  const { logout } = useAuthStore();
  const { stats: alertStats, generateMockAlerts } = useAlertStore();
  const { parcelas, dashboardStats } = useDashboardData();
  
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Inicializar alertas mock
  useEffect(() => {
    generateMockAlerts();
  }, [generateMockAlerts]);

  const tabs = [
    { id: 'overview', label: 'Resumen', icon: Home },
    { id: 'sensors', label: 'Monitoreo Sensores', icon: Activity },
    { id: 'analytics', label: 'Análisis', icon: PieChart },
    { id: 'map', label: 'Mapa', icon: MapPin },
    { id: 'parcels', label: 'Parcelas', icon: Database },
    { id: 'cultivos', label: 'Cultivos', icon: Leaf },
    { id: 'sensors-crud', label: 'Gestión Sensores', icon: Activity },
    { id: 'users', label: 'Usuarios', icon: Users },
    { id: 'alerts', label: 'Monitoreo Logs', icon: Bell },
  ];

  // Funciones de manejo
  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
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
            <SensorMonitor />

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
                {parcelas.slice(0, 4).map((parcel) => (
                  <ParcelCard
                    key={parcel.id}
                    parcel={parcel}
                    onClick={() => {}}
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
            <SensorMonitor />
            <SensorCharts />
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
            <SensorCharts />
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
            <MapaParcelas />
          </div>
        );

      case 'parcels':
        return <ParcelsCRUD />;

      case 'cultivos':
        return <CultivosCRUD />;

      case 'sensors-crud':
        return <SensorsCRUD />;

      case 'users':
        return <UsersCRUD />;

      case 'alerts':
        return <LogsPage />;

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
        onLogout={handleLogout}
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
        onConfirm={confirmLogout}
        title="Cerrar Sesión"
        message="¿Estás seguro de que deseas cerrar tu sesión? Tendrás que volver a iniciar sesión para acceder al dashboard."
        type="danger"
        confirmText="Cerrar Sesión"
        cancelText="Cancelar"
      />
    </div>
  );
};

export default Dashboard;