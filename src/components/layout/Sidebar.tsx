import React from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../stores/authStore';
import type { DashboardTab } from '../../constants/dashboard';
import { Leaf, X, Users, LogOut } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  tabs: Array<{
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }>;
  activeAlerts?: number;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  activeTab,
  onTabChange,
  tabs,
  activeAlerts = 0,
  onLogout
}) => {
  const { user } = useAuthStore();

  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white/95 backdrop-blur-lg shadow-xl transform transition-transform duration-300 ease-in-out ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
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
          onClick={onClose}
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
                  onTabChange(tab.id as DashboardTab);
                  onClose();
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-green-700 to-green-400 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                }`}
              >
                <IconComponent className="w-5 h-5" />
                {tab.label}
                {/* Badge de alertas activas */}
                {tab.id === 'alerts' && activeAlerts > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full min-w-[20px] text-center">
                    {activeAlerts}
                  </span>
                )}
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
              <p className="font-semibold text-gray-800 text-sm">{user?.nombre}</p>
              <p className="text-xs text-gray-500">Administrador</p>
            </div>
          </div>
          
          <button
            onClick={onLogout}
            className="cursor-pointer w-full mt-4 flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium"
          >
            <LogOut className="w-5 h-5" />
            Cerrar Sesión
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;