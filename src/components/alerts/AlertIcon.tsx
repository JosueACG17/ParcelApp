import React from 'react';
import {
  AlertTriangle,
  AlertCircle,
  Info,
  Activity,
  Settings,
  MapPin,
  Thermometer,
  Droplets,
  Sun,
  CloudRain,
  Zap,
} from 'lucide-react';
import type { Alert } from '../../types';
import { ALERT_SEVERITY, ALERT_TYPES, SENSOR_TYPES } from '../../constants/alerts';

interface AlertIconProps {
  type: 'severity' | 'alertType' | 'sensor';
  value: Alert['severity'] | Alert['type'] | Alert['sensorType'];
  className?: string;
}

/**
 * Componente reutilizable para iconos de alertas
 * Centraliza la lógica de selección de iconos
 */
export const AlertIcon: React.FC<AlertIconProps> = ({ type, value, className = "w-5 h-5" }) => {
  if (type === 'severity') {
    switch (value as Alert['severity']) {
      case ALERT_SEVERITY.CRITICAL:
        return <AlertTriangle className={`${className} text-red-500`} />;
      case ALERT_SEVERITY.MEDIUM:
        return <AlertCircle className={`${className} text-yellow-500`} />;
      case ALERT_SEVERITY.LOW:
        return <Info className={`${className} text-blue-500`} />;
      default:
        return <Info className={`${className} text-gray-500`} />;
    }
  }

  if (type === 'alertType') {
    switch (value as Alert['type']) {
      case ALERT_TYPES.SENSOR:
        return <Activity className={`${className}`} />;
      case ALERT_TYPES.SYSTEM:
        return <Settings className={`${className}`} />;
      case ALERT_TYPES.AGRICULTURAL:
        return <MapPin className={`${className}`} />;
      default:
        return <Activity className={`${className}`} />;
    }
  }

  if (type === 'sensor') {
    switch (value as Alert['sensorType']) {
      case SENSOR_TYPES.TEMPERATURE:
        return <Thermometer className={`${className} text-red-500`} />;
      case SENSOR_TYPES.HUMIDITY:
        return <Droplets className={`${className} text-blue-500`} />;
      case SENSOR_TYPES.SOLAR_RADIATION:
        return <Sun className={`${className} text-yellow-500`} />;
      case SENSOR_TYPES.RAIN:
        return <CloudRain className={`${className} text-gray-500`} />;
      default:
        return <Zap className={`${className}`} />;
    }
  }

  return <Info className={`${className} text-gray-500`} />;
};