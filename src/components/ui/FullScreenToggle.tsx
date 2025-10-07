import React from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';

interface FullScreenToggleProps {
  isFullScreen: boolean;
  onToggle: () => void;
  className?: string;
}

const FullScreenToggle: React.FC<FullScreenToggleProps> = ({ 
  isFullScreen, 
  onToggle,
  className = '' 
}) => {
  return (
    <button
      onClick={onToggle}
      className={`p-2 hover:bg-gray-100 rounded-lg transition-colors ${className}`}
      title={isFullScreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
    >
      {isFullScreen ? (
        <Minimize2 className="w-4 h-4 text-gray-600" />
      ) : (
        <Maximize2 className="w-4 h-4 text-gray-600" />
      )}
    </button>
  );
};

export default FullScreenToggle;