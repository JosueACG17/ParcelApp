import React from 'react';
import { motion } from 'framer-motion';
import { Clock, MapPin, Activity, Eye, Check, CheckCircle } from 'lucide-react';
import type { Alert } from '../../types';
import { AlertIcon } from './AlertIcon';
import { formatRelativeTime } from '../../utils/format';
import { SEVERITY_COLORS } from '../../constants/alerts';

interface AlertCardProps {
  alert: Alert;
  onMarkAsRead: (id: string) => void;
  onMarkAsResolved: (id: string) => void;
}

/**
 * Componente reutilizable para mostrar una tarjeta de alerta
 * Encapsula toda la lógica de presentación de una alerta individual
 */
export const AlertCard: React.FC<AlertCardProps> = ({
  alert,
  onMarkAsRead,
  onMarkAsResolved,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`bg-white rounded-xl shadow-lg border-l-4 p-6 hover:shadow-xl transition-all duration-300 ${
        SEVERITY_COLORS[alert.severity]
      } ${!alert.isRead ? 'ring-2 ring-blue-200' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <AlertIcon type="severity" value={alert.severity} />
            <h4 className="text-lg font-semibold text-gray-800">{alert.title}</h4>
            <div className="flex items-center gap-2">
              <AlertIcon type="alertType" value={alert.type} className="w-4 h-4" />
              <span className="text-xs text-gray-500 uppercase font-medium">
                {alert.type}
              </span>
            </div>
            {alert.sensorType && (
              <div className="flex items-center gap-1">
                <AlertIcon type="sensor" value={alert.sensorType} className="w-4 h-4" />
                <span className="text-xs text-gray-500 capitalize">
                  {alert.sensorType}
                </span>
              </div>
            )}
          </div>

          <p className="text-gray-600 mb-3">{alert.description}</p>

          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {formatRelativeTime(alert.timestamp)}
            </div>
            {alert.parcelName && (
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {alert.parcelName}
              </div>
            )}
            {alert.value && alert.threshold && (
              <div className="flex items-center gap-1">
                <Activity className="w-4 h-4" />
                {alert.value.toFixed(1)}
                {alert.unit} / {alert.threshold}
                {alert.unit}
              </div>
            )}
          </div>

          {alert.isResolved && (
            <div className="mt-3 p-2 bg-green-100 rounded-lg">
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">
                  Resuelto por {alert.resolvedBy} - {formatRelativeTime(alert.resolvedAt!)}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 ml-4">
          {!alert.isRead && (
            <button
              onClick={() => onMarkAsRead(alert.id)}
              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
              title="Marcar como leído"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}

          {!alert.isResolved && (
            <button
              onClick={() => onMarkAsResolved(alert.id)}
              className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
              title="Marcar como resuelto"
            >
              <Check className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};