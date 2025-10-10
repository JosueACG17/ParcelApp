import React from 'react';
import { motion } from 'framer-motion';
import { STATUS_COLORS, HEALTH_COLORS } from '../../constants/dashboard';

export interface ParcelCardData {
  id: number;
  name: string;
  status: string;
  crop: string;
  area: string;
  progress: number;
  health: string;
  coordinates?: {
    lat: number;
    lon: number;
  };
}

interface ParcelCardProps {
  parcel: ParcelCardData;
  onClick?: (parcel: ParcelCardData) => void;
}

/**
 * Componente reutilizable para mostrar una tarjeta de parcela
 * Encapsula la lógica de presentación y puede ser reutilizado en diferentes contextos
 */
export const ParcelCard: React.FC<ParcelCardProps> = ({ parcel, onClick }) => {
  const getStatusColor = (status: string) => {
    return STATUS_COLORS[status as keyof typeof STATUS_COLORS] || 'bg-gray-100 text-gray-800';
  };

  const getHealthColor = (health: string) => {
    return HEALTH_COLORS[health as keyof typeof HEALTH_COLORS] || 'text-gray-600';
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-all duration-300 border border-gray-200 cursor-pointer"
      onClick={() => onClick?.(parcel)}
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
          />
        </div>
        <span className="text-sm font-medium text-gray-600">{parcel.progress}%</span>
      </div>
    </motion.div>
  );
};