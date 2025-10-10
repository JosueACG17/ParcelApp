import React from 'react';
import { 
  Line, 
  Bar, 
  Pie, 
  Cell,
  ResponsiveContainer, 
  LineChart, 
  BarChart, 
  PieChart, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { useSharedSensorData } from '../../hooks/useSharedSensorData';

const SensorCharts: React.FC = () => {
  const { chartData, sensores } = useSharedSensorData();

  // Generar colores para cada sensor
  const getColorForSensor = (index: number) => {
    const colors = ['#ef4444', '#22c55e', '#3b82f6', '#f59e0b', '#8b5cf6', '#f97316'];
    return colors[index % colors.length];
  };

  const SensorChart: React.FC<{ sensorName: string; sensorType: string; color: string }> = ({ 
    sensorName, 
    sensorType, 
    color 
  }) => {
    const key = sensorName.toLowerCase().replace(/\s+/g, '_');
    
    const getUnit = (tipo: string) => {
      switch (tipo.toLowerCase()) {
        case 'temperatura': return '°C';
        case 'humedad': return '%';
        case 'radiacion_solar': return 'W/m²';
        case 'lluvia': return 'mm';
        default: return 'units';
      }
    };

    // Función para renderizar según el tipo de sensor
    const renderChart = () => {
      const commonTooltipStyle = {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        border: 'none',
        borderRadius: '12px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
      };

      switch (sensorType.toLowerCase()) {
        case 'temperatura':
          // 🌡️ Gráfica de LÍNEA para temperatura
          return (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
              <XAxis 
                dataKey="time" 
                stroke="#6b7280" 
                fontSize={12}
                tickFormatter={(value) => new Date(value).toLocaleTimeString().slice(0, 5)}
              />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip 
                contentStyle={commonTooltipStyle}
                labelFormatter={(value) => new Date(value).toLocaleTimeString()}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey={key} 
                stroke={color}
                strokeWidth={3}
                dot={{ fill: color, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
                name={`${sensorName} (${getUnit(sensorType)})`}
              />
            </LineChart>
          );

        case 'humedad':
        case 'lluvia':
          // 💧🌧️ Gráfica de BARRAS para humedad y lluvia
          return (
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
              <XAxis 
                dataKey="time" 
                stroke="#6b7280" 
                fontSize={12}
                tickFormatter={(value) => new Date(value).toLocaleTimeString().slice(0, 5)}
              />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip 
                contentStyle={commonTooltipStyle}
                labelFormatter={(value) => new Date(value).toLocaleTimeString()}
              />
              <Legend />
              <Bar 
                dataKey={key} 
                fill={color}
                radius={[4, 4, 0, 0]}
                name={`${sensorName} (${getUnit(sensorType)})`}
              />
            </BarChart>
          );

        case 'radiacion_solar': {
          // ☀️ Gráfica de PASTEL para radiación solar (distribución de valores)
          const pieData = [
            { name: 'Baja (0-300)', value: 25, fill: '#fbbf24' },
            { name: 'Media (300-600)', value: 35, fill: '#f59e0b' },
            { name: 'Alta (600-900)', value: 30, fill: '#d97706' },
            { name: 'Muy Alta (900+)', value: 10, fill: '#b45309' }
          ];
          
          return (
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }: any) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip contentStyle={commonTooltipStyle} />
              <Legend />
            </PieChart>
          );
        }

        default:
          // Por defecto usar línea
          return (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
              <XAxis 
                dataKey="time" 
                stroke="#6b7280" 
                fontSize={12}
                tickFormatter={(value) => new Date(value).toLocaleTimeString().slice(0, 5)}
              />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip 
                contentStyle={commonTooltipStyle}
                labelFormatter={(value) => new Date(value).toLocaleTimeString()}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey={key} 
                stroke={color}
                strokeWidth={3}
                dot={{ fill: color, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
                name={`${sensorName} (${getUnit(sensorType)})`}
              />
            </LineChart>
          );
      }
    };

    return (
      <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          {sensorType === 'temperatura' ? '🌡️' : 
           sensorType === 'humedad' ? '💧' :
           sensorType === 'radiacion_solar' ? '☀️' : '🌧️'} 
          {sensorName} ({getUnit(sensorType)})
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          {renderChart()}
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {sensores.length === 0 ? (
        <div className="col-span-full text-center py-12">
          <div className="text-gray-400 mb-4">📊</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay sensores para mostrar gráficos
          </h3>
          <p className="text-gray-500">
            Agrega sensores para ver sus datos en tiempo real.
          </p>
        </div>
      ) : (
        sensores.map((sensor, index) => (
          <SensorChart
            key={sensor._id}
            sensorName={sensor.nombre}
            sensorType={sensor.tipo}
            color={getColorForSensor(index)}
          />
        ))
      )}
    </div>
  );
};

export default SensorCharts;