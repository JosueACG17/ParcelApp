import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "../../stores/authStore";
import { ParcelCard, type ParcelCardData } from "./ParcelCard";
import ParcelMap from "./MapaParcelas";
import ConfirmModal from "../ui/ConfirmModal";
import Topbar from "../layout/Topbar";
import {
  Leaf,
  MapPin,
  Database,
  LogOut,
  X,
} from "lucide-react";

const userTabs = [
  { id: "overview", label: "Resumen", icon: Leaf },
  { id: "parcels", label: "Mis Parcelas", icon: Database },
  { id: "map", label: "Mapa", icon: MapPin },
] as const;

const UserDashboard: React.FC = () => {
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState<"overview" | "parcels" | "map">(
    "overview"
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Mock: Parcelas del usuario 
  const userParcels: ParcelCardData[] = [
    { id: 1, name: 'Parcela Norte A1', status: 'Activa', crop: 'Maíz', area: '12.5 ha', progress: 75, health: 'Excelente' },
    { id: 2, name: 'Parcela Sur B3', status: 'En preparación', crop: 'Trigo', area: '8.2 ha', progress: 45, health: 'Buena' },
    { id: 3, name: 'Parcela Este C2', status: 'Cosechada', crop: 'Soja', area: '15.0 ha', progress: 100, health: 'Excelente' },
  ];

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

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-8">
            <div className="bg-white/90 rounded-2xl shadow-lg border border-white/20 p-6">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Leaf className="w-6 h-6 text-green-600" />
                Mis Parcelas Recientes
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userParcels.slice(0, 2).map((parcel) => (
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
      case "parcels":
        return (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Todas mis parcelas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userParcels.map((parcel) => (
                <ParcelCard
                  key={parcel.id}
                  parcel={parcel}
                  onClick={() => {}}
                />
              ))}
            </div>
          </div>
        );
      case "map":
        return (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Mapa de mis parcelas
            </h2>
            <ParcelMap />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white/95 shadow-xl transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800">ParcelApp IoT</h1>
              <p className="text-xs text-gray-500">Panel de Usuario</p>
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
            {userTabs.map((tab) => {
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
                      ? "bg-gradient-to-r from-green-700 to-green-400 text-white shadow-lg"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
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
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800 text-sm">
                  {user?.nombre}
                </p>
                <p className="text-xs text-gray-500">Usuario</p>
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
        <Topbar
          onMenuClick={() => setSidebarOpen(true)}
          isFullScreen={isFullScreen}
          onToggleFullScreen={toggleFullScreen} onAlertsClick={function (): void {
            throw new Error("Function not implemented.");
          } }        />
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
        message="¿Estás seguro de que deseas cerrar tu sesión?"
        type="danger"
        confirmText="Cerrar Sesión"
        cancelText="Cancelar"
      />
    </div>
  );
};

export default UserDashboard;
