import React from 'react';
import { useSensores, useLecturasRecientes } from '../../hooks/useSensoresData';
import { Thermometer, Droplets, Sun, CloudRain, Activity } from 'lucide-react';

const SensorMonitor: React.FC = () => {
  const { sensores } = useSensores();
  const { lecturasRecientes } = useLecturasRecientes();

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

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">
          Monitoreo de Sensores
        </h3>
        <p className="text-sm text-gray-500">
          Datos en tiempo real de la red de sensores
        </p>
      </div>

      <div className="p-6">
        {sensores.length === 0 ? (
          <div className="text-center py-12">
            <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay sensores configurados
            </h3>
            <p className="text-gray-500">
              Agrega sensores para comenzar a monitorear tu sistema.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sensores.map((sensor) => {
              const IconComponent = getSensorIcon(sensor.tipo);
              const lecturaReciente = lecturasRecientes
                .filter(l => l.sensorId === sensor._id)
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

              return (
                <div
                  key={sensor._id}
                  className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{sensor.nombre}</h4>
                      <p className="text-xs text-gray-500">{sensor.ubicacion}</p>
                    </div>
                  </div>

                  {lecturaReciente ? (
                    <div className="mb-4">
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-gray-900">
                          {lecturaReciente.valor}
                        </span>
                        <span className="text-sm text-gray-600">
                          {lecturaReciente.unidad}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="mb-4">
                      <span className="text-gray-500">Sin lecturas</span>
                    </div>
                  )}

                  <div className="text-xs text-gray-500">
                    Estado: {sensor.estado}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SensorMonitor;