import React from 'react';
import { useAuthStore } from '../../stores/authStore';
import FullScreenToggle from '../ui/FullScreenToggle';
import { Menu, Bell } from 'lucide-react';
import { formatFullDate } from '../../utils/format';

interface TopbarProps {
  onMenuClick: () => void;
  isFullScreen: boolean;
  onToggleFullScreen: () => void;
  activeAlerts?: number;
  onAlertsClick: () => void;
}

const Topbar: React.FC<TopbarProps> = ({
  onMenuClick,
  isFullScreen,
  onToggleFullScreen,
  activeAlerts = 0,
  onAlertsClick
}) => {
  const { user } = useAuthStore();

  return (
    <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-40">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                ¡Bienvenido de nuevo, {user?.name}!
              </h1>
              <p className="text-gray-600 capitalize">
                {formatFullDate(new Date())}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <button 
              onClick={onAlertsClick}
              className="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <Bell className="w-6 h-6" />
              {activeAlerts > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-2 py-1 rounded-full min-w-[20px] text-center">
                  {activeAlerts}
                </span>
              )}
            </button>

            {/* Full Screen Toggle */}
            <FullScreenToggle 
              isFullScreen={isFullScreen}
              onToggle={onToggleFullScreen}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;