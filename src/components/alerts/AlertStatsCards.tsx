import React from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  CheckCircle, 
  EyeOff 
} from 'lucide-react';
import type { AlertStats } from '../../types';

interface AlertStatsProps {
  stats: AlertStats;
}

/**
 * Componente reutilizable para mostrar estadísticas de alertas
 * Encapsula la lógica de presentación de las estadísticas
 */
export const AlertStatsCards: React.FC<AlertStatsProps> = ({ stats }) => {
  const statsConfig = [
    {
      label: 'Total',
      value: stats.total,
      icon: AlertTriangle,
      color: 'text-gray-400',
    },
    {
      label: 'Críticas',
      value: stats.critical,
      icon: AlertTriangle,
      color: 'text-red-400',
    },
    {
      label: 'Medias',
      value: stats.medium,
      icon: AlertCircle,
      color: 'text-yellow-400',
    },
    {
      label: 'Bajas',
      value: stats.low,
      icon: Info,
      color: 'text-blue-400',
    },
    {
      label: 'Sin leer',
      value: stats.unread,
      icon: EyeOff,
      color: 'text-orange-400',
    },
    {
      label: 'Resueltas',
      value: stats.resolved,
      icon: CheckCircle,
      color: 'text-green-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {statsConfig.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-4 shadow-lg border"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className={`text-2xl font-bold ${
                  stat.label === 'Críticas' ? 'text-red-600' :
                  stat.label === 'Medias' ? 'text-yellow-600' :
                  stat.label === 'Bajas' ? 'text-blue-600' :
                  stat.label === 'Sin leer' ? 'text-orange-600' :
                  stat.label === 'Resueltas' ? 'text-green-600' :
                  'text-gray-800'
                }`}>
                  {stat.value}
                </p>
              </div>
              <IconComponent className={`w-8 h-8 ${stat.color}`} />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};