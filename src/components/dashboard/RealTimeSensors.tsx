import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Thermometer, 
  Droplets, 
  Sprout, 
  Sun, 
  CloudRain, 
  Wind,
  TrendingUp,
  TrendingDown,
  Minus,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
} from 'lucide-react';

interface SensorReading {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: 'normal' | 'warning' | 'critical' | 'offline';
  iconComponent: React.ComponentType<{ className?: string }>;
  lastUpdate: string;
  trend: 'up' | 'down' | 'stable';
  description: string;
  threshold?: {
    min: number;
    max: number;
  };
}

const RealTimeSensors: React.FC = () => {
  const [sensors, setSensors] = useState<SensorReading[]>([
    {
      id: 'temp1',
      name: 'Temperatura Ambiente',
      value: 24.5,
      unit: '°C',
      status: 'normal',
      iconComponent: Thermometer,
      lastUpdate: new Date().toISOString(),
      trend: 'stable',
      description: 'Sensor de temperatura del aire',
      threshold: { min: 18, max: 35 }
    },
    {
      id: 'humidity1',
      name: 'Humedad Relativa',
      value: 65.2,
      unit: '%',
      status: 'normal',
      iconComponent: Droplets,
      lastUpdate: new Date().toISOString(),
      trend: 'up',
      description: 'Humedad del aire ambiente',
      threshold: { min: 40, max: 80 }
    },
    {
      id: 'soil1',
      name: 'Humedad del Suelo',
      value: 42.8,
      unit: '%',
      status: 'warning',
      iconComponent: Sprout,
      lastUpdate: new Date().toISOString(),
      trend: 'down',
      description: 'Contenido de agua en el suelo',
      threshold: { min: 30, max: 70 }
    },
    {
      id: 'light1',
      name: 'Radiación Solar',
      value: 850,
      unit: 'W/m²',
      status: 'normal',
      iconComponent: Sun,
      lastUpdate: new Date().toISOString(),
      trend: 'up',
      description: 'Intensidad de radiación solar',
      threshold: { min: 200, max: 1200 }
    },
    {
      id: 'rain1',
      name: 'Precipitación',
      value: 0.0,
      unit: 'mm/h',
      status: 'normal',
      iconComponent: CloudRain,
      lastUpdate: new Date().toISOString(),
      trend: 'stable',
      description: 'Intensidad de lluvia actual',
      threshold: { min: 0, max: 20 }
    },
    {
      id: 'wind1',
      name: 'Velocidad del Viento',
      value: 12.3,
      unit: 'km/h',
      status: 'normal',
      iconComponent: Wind,
      lastUpdate: new Date().toISOString(),
      trend: 'up',
      description: 'Velocidad promedio del viento',
      threshold: { min: 0, max: 30 }
    }
  ]);

  // Simular actualizaciones en tiempo real
  useEffect(() => {
    const interval = setInterval(() => {
      setSensors(prev => prev.map(sensor => {
        let newValue = sensor.value;
        let newStatus = sensor.status;
        let newTrend = sensor.trend;

        // Simular cambios realistas según el tipo de sensor
        switch (sensor.id) {
          case 'temp1':
            newValue = Math.max(15, Math.min(35, sensor.value + (Math.random() - 0.5) * 2));
            newStatus = newValue > 30 ? 'warning' : newValue > 35 ? 'critical' : 'normal';
            break;
          case 'humidity1':
            newValue = Math.max(30, Math.min(90, sensor.value + (Math.random() - 0.5) * 5));
            newStatus = newValue < 40 || newValue > 80 ? 'warning' : 'normal';
            break;
          case 'soil1':
            newValue = Math.max(20, Math.min(80, sensor.value + (Math.random() - 0.5) * 3));
            newStatus = newValue < 30 ? 'critical' : newValue < 40 ? 'warning' : 'normal';
            break;
          case 'light1':
            newValue = Math.max(0, Math.min(1200, sensor.value + (Math.random() - 0.5) * 100));
            break;
          case 'rain1':
            newValue = Math.max(0, Math.min(50, Math.random() * 2));
            newStatus = newValue > 20 ? 'warning' : 'normal';
            break;
          case 'wind1':
            newValue = Math.max(0, Math.min(50, sensor.value + (Math.random() - 0.5) * 5));
            newStatus = newValue > 30 ? 'warning' : 'normal';
            break;
        }

        // Determinar tendencia
        if (Math.abs(newValue - sensor.value) < 0.1) {
          newTrend = 'stable';
        } else {
          newTrend = newValue > sensor.value ? 'up' : 'down';
        }

        return {
          ...sensor,
          value: Math.round(newValue * 10) / 10,
          status: newStatus,
          trend: newTrend,
          lastUpdate: new Date().toISOString()
        };
      }));
    }, 3000); // Actualizar cada 3 segundos

    return () => clearInterval(interval);
  }, []);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'normal': 
        return {
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          iconBg: 'bg-green-100',
          dotColor: 'bg-green-500',
          icon: CheckCircle,
          label: 'Normal'
        };
      case 'warning': 
        return {
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          iconBg: 'bg-yellow-100',
          dotColor: 'bg-yellow-500',
          icon: AlertTriangle,
          label: 'Alerta'
        };
      case 'critical': 
        return {
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          iconBg: 'bg-red-100',
          dotColor: 'bg-red-500',
          icon: AlertTriangle,
          label: 'Crítico'
        };
      case 'offline':
        return {
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          iconBg: 'bg-gray-100',
          dotColor: 'bg-gray-400',
          icon: Activity,
          label: 'Offline'
        };
      default: 
        return {
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          iconBg: 'bg-gray-100',
          dotColor: 'bg-gray-400',
          icon: Activity,
          label: 'Desconocido'
        };
    }
  };

  const getTrendConfig = (trend: string) => {
    switch (trend) {
      case 'up': 
        return {
          icon: TrendingUp,
          color: 'text-green-600',
          bgColor: 'bg-green-100'
        };
      case 'down': 
        return {
          icon: TrendingDown,
          color: 'text-red-600',
          bgColor: 'bg-red-100'
        };
      case 'stable': 
        return {
          icon: Minus,
          color: 'text-gray-600',
          bgColor: 'bg-gray-100'
        };
      default: 
        return {
          icon: Minus,
          color: 'text-gray-600',
          bgColor: 'bg-gray-100'
        };
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Monitoreo de Sensores
              </h3>
              <p className="text-sm text-gray-500">
                Datos en tiempo real de la red de sensores
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-700">En vivo</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sensor Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {sensors.map((sensor) => {
              const IconComponent = sensor.iconComponent;
              const statusConfig = getStatusConfig(sensor.status);
              const trendConfig = getTrendConfig(sensor.trend);
              
              return (
                <motion.div
                  key={sensor.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="group relative bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-gray-300 transition-all duration-200"
                >
                  {/* Header con ícono y estado */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 ${statusConfig.iconBg} rounded-xl flex items-center justify-center transition-colors`}>
                        <IconComponent className={`w-6 h-6 ${statusConfig.color}`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm leading-tight">
                          {sensor.name}
                        </h4>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {sensor.description}
                        </p>
                      </div>
                    </div>
                    
                    {/* Estado */}
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 ${statusConfig.bgColor} rounded-lg`}>
                      <statusConfig.icon className={`w-3 h-3 ${statusConfig.color}`} />
                      <span className={`text-xs font-medium ${statusConfig.color}`}>
                        {statusConfig.label}
                      </span>
                    </div>
                  </div>

                  {/* Valor principal */}
                  <div className="mb-4">
                    <div className="flex items-baseline gap-2">
                      <motion.span
                        key={sensor.value}
                        initial={{ scale: 1.1, opacity: 0.7 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="text-2xl font-bold text-gray-900"
                      >
                        {sensor.value}
                      </motion.span>
                      <span className="text-sm text-gray-600 font-medium">
                        {sensor.unit}
                      </span>
                      
                      {/* Tendencia */}
                      <div className={`inline-flex items-center gap-1 px-2 py-0.5 ${trendConfig.bgColor} rounded-md ml-auto`}>
                        <trendConfig.icon className={`w-3 h-3 ${trendConfig.color}`} />
                      </div>
                    </div>
                    
                    {/* Rango normal si existe threshold */}
                    {sensor.threshold && (
                      <div className="mt-2">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>{sensor.threshold.min}{sensor.unit}</span>
                          <span>{sensor.threshold.max}{sensor.unit}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className={`h-1.5 rounded-full transition-all duration-500 ${
                              sensor.status === 'normal' ? 'bg-green-500' :
                              sensor.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{
                              width: `${Math.max(0, Math.min(100, 
                                ((sensor.value - sensor.threshold.min) / 
                                (sensor.threshold.max - sensor.threshold.min)) * 100
                              ))}%`
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Footer con timestamp */}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3" />
                      <motion.span
                        key={sensor.lastUpdate}
                        initial={{ opacity: 0.5 }}
                        animate={{ opacity: 1 }}
                      >
                        {new Date(sensor.lastUpdate).toLocaleTimeString('es-ES', { 
                          hour: '2-digit', 
                          minute: '2-digit',
                          second: '2-digit'
                        })}
                      </motion.span>
                    </div>
                    <div className={`w-2 h-2 ${statusConfig.dotColor} rounded-full`} />
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Resumen de estado */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">
                  <span className="font-medium text-gray-900">
                    {sensors.filter(s => s.status === 'normal').length}
                  </span> Normal
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-gray-600">
                  <span className="font-medium text-gray-900">
                    {sensors.filter(s => s.status === 'warning').length}
                  </span> Alerta
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-600">
                  <span className="font-medium text-gray-900">
                    {sensors.filter(s => s.status === 'critical').length}
                  </span> Crítico
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                <span className="text-sm text-gray-600">
                  <span className="font-medium text-gray-900">
                    {sensors.filter(s => s.status === 'offline').length}
                  </span> Offline
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>
                Última actualización: {new Date().toLocaleTimeString('es-ES')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTimeSensors;