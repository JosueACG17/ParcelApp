import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSharedSensorData } from '../../hooks/useSharedSensorData';
import { 
  Thermometer, 
  Droplets, 
  Sun, 
  CloudRain, 
  Activity, 
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  CheckCircle,
  Clock,
} from 'lucide-react';

const SensorMonitor: React.FC = () => {
  const { sensorData, sensores } = useSharedSensorData();

  const getSensorIcon = (tipo: string) => {
    switch (tipo.toLowerCase()) {
      case 'temperatura':
        return Thermometer;
      case 'humedad':
        return Droplets;
      case 'radiacion_solar':
        return Sun;
      case 'lluvia':
        return CloudRain;
      default:
        return Activity;
    }
  };

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
      default: 
        return {
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          iconBg: 'bg-green-100',
          dotColor: 'bg-green-500',
          icon: CheckCircle,
          label: 'Normal'
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
        {sensores.length === 0 ? (
          <div className="text-center py-12">
            <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay sensores configurados
            </h3>
            <p className="text-gray-500 mb-4">
              Agrega sensores para comenzar a monitorear tu sistema.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {sensores.map((sensor) => {
                const IconComponent = getSensorIcon(sensor.tipo);
                const currentSensorData = sensorData[sensor._id];
                
                if (!currentSensorData) return null;
                
                const statusConfig = getStatusConfig(currentSensorData.status);
                const trendConfig = getTrendConfig(currentSensorData.trend);
                
                return (
                  <motion.div
                    key={sensor._id}
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
                            {sensor.nombre}
                          </h4>
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
                          key={currentSensorData.valor}
                          initial={{ scale: 1.1, opacity: 0.7 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          className="text-2xl font-bold text-gray-900"
                        >
                          {currentSensorData.valor}
                        </motion.span>
                        <span className="text-sm text-gray-600 font-medium">
                          {currentSensorData.unidad}
                        </span>
                        
                        {/* Tendencia */}
                        <div className={`inline-flex items-center gap-1 px-2 py-0.5 ${trendConfig.bgColor} rounded-md ml-auto`}>
                          <trendConfig.icon className={`w-3 h-3 ${trendConfig.color}`} />
                        </div>
                      </div>
                      
                      {/* Rango normal si existe threshold */}
                      {currentSensorData.threshold && (
                        <div className="mt-2">
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>{currentSensorData.threshold.min}{currentSensorData.unidad}</span>
                            <span>{currentSensorData.threshold.max}{currentSensorData.unidad}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div 
                              className={`h-1.5 rounded-full transition-all duration-500 ${
                                currentSensorData.status === 'normal' ? 'bg-green-500' :
                                currentSensorData.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{
                                width: `${Math.max(0, Math.min(100, 
                                  ((currentSensorData.valor - currentSensorData.threshold.min) / 
                                  (currentSensorData.threshold.max - currentSensorData.threshold.min)) * 100
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
                          key={currentSensorData.timestamp.toISOString()}
                          initial={{ opacity: 0.5 }}
                          animate={{ opacity: 1 }}
                        >
                          {currentSensorData.timestamp.toLocaleTimeString('es-ES', { 
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
        )}

        {/* Resumen de estado */}
        {sensores.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">
                    <span className="font-medium text-gray-900">
                      {Object.values(sensorData).filter(s => s.status === 'normal').length}
                    </span> Normal
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">
                    <span className="font-medium text-gray-900">
                      {Object.values(sensorData).filter(s => s.status === 'warning').length}
                    </span> Alerta
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">
                    <span className="font-medium text-gray-900">
                      {Object.values(sensorData).filter(s => s.status === 'critical').length}
                    </span> Crítico
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
        )}
      </div>
    </div>
  );
};

export default SensorMonitor;