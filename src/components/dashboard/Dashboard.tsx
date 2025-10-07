import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../stores/authStore';
import RealTimeSensors from './RealTimeSensors';
import SensorCharts from './SensorCharts';
import ProductionCharts from './ProductionCharts';
import ParcelMap from './ParcelMap';
import ParcelsCRUD from './ParcelsCRUD';
import ConfirmModal from '../ui/ConfirmModal';
import FullScreenToggle from '../ui/FullScreenToggle';

// Iconos usando Lucide React
import { 
  TrendingUp, 
  TrendingDown, 
  MapPin,
  Settings,
  Bell,
  Search,
  Filter,
  Home,
  Activity,
  PieChart,
  Users,
  Database,
  Zap,
  Leaf,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

interface SensorData {
  time: string;
  temperature: number;
  humidity: number;
  solarRadiation: number;
  rain: number;
}

const Dashboard: React.FC = () => {
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'sensors' | 'analytics' | 'map' | 'parcels'>('overview');
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Generar datos simulados para las gráficas
  useEffect(() => {
    const generateMockData = () => {
      const data: SensorData[] = [];
      const now = new Date();
      
      for (let i = 23; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 60 * 60 * 1000);
        data.push({
          time: time.toISOString(),
          temperature: 20 + Math.sin(i * 0.3) * 8 + Math.random() * 3,
          humidity: 60 + Math.cos(i * 0.2) * 20 + Math.random() * 5,
          solarRadiation: Math.max(0, 400 + Math.sin((i - 12) * 0.5) * 400 + Math.random() * 100),
          rain: Math.random() < 0.8 ? 0 : Math.random() * 10
        });
      }
      return data;
    };

    setSensorData(generateMockData());

    // Actualizar datos cada 5 minutos
    const interval = setInterval(() => {
      setSensorData(generateMockData());
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  // Funciones
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

  const stats = [
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
      value: '3', 
      icon: Bell, 
      color: 'from-red-400 to-pink-500', 
      change: '-15%',
      trend: 'down' as const,
      description: '2 críticas, 1 media'
    },
  ];

  const recentParcels = [
    { id: 1, name: 'Parcela Norte A1', status: 'Activa', crop: 'Maíz', area: '12.5 ha', progress: 75, health: 'Excelente' },
    { id: 2, name: 'Parcela Sur B3', status: 'En preparación', crop: 'Trigo', area: '8.2 ha', progress: 45, health: 'Buena' },
    { id: 3, name: 'Parcela Este C2', status: 'Cosechada', crop: 'Soja', area: '15.0 ha', progress: 100, health: 'Excelente' },
    { id: 4, name: 'Parcela Oeste D1', status: 'Activa', crop: 'Girasol', area: '6.8 ha', progress: 60, health: 'Regular' },
  ];

  const tabs = [
    { id: 'overview', label: 'Resumen', icon: Home },
    { id: 'sensors', label: 'Sensores', icon: Activity },
    { id: 'analytics', label: 'Análisis', icon: PieChart },
    { id: 'map', label: 'Mapa', icon: MapPin },
    { id: 'parcels', label: 'Parcelas', icon: Database },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Activa': return 'bg-green-100 text-green-800';
      case 'En preparación': return 'bg-yellow-100 text-yellow-800';
      case 'Cosechada': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'Excelente': return 'text-green-600';
      case 'Buena': return 'text-blue-600';
      case 'Regular': return 'text-yellow-600';
      case 'Mala': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-semibold ${
                        stat.trend === 'up' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                      }`}>
                        {stat.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {stat.change}
                      </div>
                    </div>
                    <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
                    <p className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</p>
                    <p className="text-xs text-gray-500">{stat.description}</p>
                  </motion.div>
                );
              })}
            </div>

            {/* Sensores en Tiempo Real */}
            <RealTimeSensors />

            {/* Parcelas Recientes */}
            <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <Leaf className="w-6 h-6 text-green-600" />
                  Parcelas Recientes
                </h3>
                <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Ver todas
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recentParcels.map((parcel) => (
                  <motion.div
                    key={parcel.id}
                    whileHover={{ scale: 1.02 }}
                    className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-all duration-300 border border-gray-200"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-800">{parcel.name}</h4>
                        <p className="text-sm text-gray-600">{parcel.crop} • {parcel.area}</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(parcel.status)}`}>
                          {parcel.status}
                        </span>
                        <p className={`text-sm font-medium mt-1 ${getHealthColor(parcel.health)}`}>
                          {parcel.health}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${parcel.progress}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full"
                        ></motion.div>
                      </div>
                      <span className="text-sm font-medium text-gray-600">{parcel.progress}%</span>
                    </div>
                  </motion.div>
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

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white/95 backdrop-blur-lg shadow-xl transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800">ParcelApp IoT</h1>
              <p className="text-xs text-gray-500">Dashboard Agrícola</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="px-4 py-6">
          <div className="space-y-2">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setActiveTab(tab.id as typeof activeTab);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-green-700 to-green-400 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  {tab.label}
                </motion.button>
              );
            })}
          </div>

          {/* User Info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 bg-gradient-to-r from-green-700 to-green-400 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800 text-sm">{user?.name}</p>
                <p className="text-xs text-gray-500">Administrador</p>
              </div>
            </div>
            
            <button
              onClick={() => setShowLogoutModal(true)}
              className="cursor-pointer w-full mt-4 flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium"
            >
              <LogOut className="w-5 h-5" />
              Cerrar Sesión
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Bar */}
        <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-40">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
                >
                  <Menu className="w-6 h-6" />
                </button>
                
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    ¡Bienvenido de nuevo, {user?.name}!
                  </h1>
                  <p className="text-gray-600 capitalize">
                    {new Date().toLocaleDateString('es-ES', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Buscar..."
                    className="pl-10 pr-4 py-2 bg-gray-100 rounded-xl border-0 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>

                {/* Pantalla completa */}
                <FullScreenToggle 
                  isFullScreen={isFullScreen}
                  onToggle={toggleFullScreen}
                />
              
                <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors">
                  <Settings className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </header>

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

export default Dashboard;