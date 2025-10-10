import { useState, useEffect } from 'react';
import { useSensores } from './useSensoresData';

interface SharedSensorData {
  [sensorId: string]: {
    valor: number;
    timestamp: Date;
    trend: 'up' | 'down' | 'stable';
    status: 'normal' | 'warning' | 'critical';
    unidad: string;
    threshold?: { min: number; max: number };
  };
}

interface ChartDataPoint {
  time: string;
  [key: string]: string | number;
}

// Hook compartido para datos de sensores en tiempo real
export const useSharedSensorData = () => {
  const { sensores } = useSensores();
  const [sensorData, setSensorData] = useState<SharedSensorData>({});
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);

  // Generar datos fake para cada tipo de sensor
  const generateFakeValue = (tipo: string, previousValue?: number) => {
    let valor: number;
    let status: 'normal' | 'warning' | 'critical' = 'normal';
    let threshold: { min: number; max: number };
    let unidad: string;
    
    switch (tipo.toLowerCase()) {
      case 'temperatura':
        valor = previousValue ? 
          Math.max(15, Math.min(35, previousValue + (Math.random() - 0.5) * 2)) :
          Math.round((Math.random() * 15 + 18) * 10) / 10;
        status = valor > 30 ? 'warning' : valor > 35 ? 'critical' : 'normal';
        unidad = '°C';
        threshold = { min: 18, max: 35 };
        break;
      case 'humedad':
        valor = previousValue ?
          Math.max(30, Math.min(90, previousValue + (Math.random() - 0.5) * 5)) :
          Math.round(Math.random() * 40 + 40);
        status = valor < 40 || valor > 80 ? 'warning' : 'normal';
        unidad = '%';
        threshold = { min: 40, max: 80 };
        break;
      case 'radiacion_solar':
        valor = previousValue ?
          Math.max(0, Math.min(1200, previousValue + (Math.random() - 0.5) * 100)) :
          Math.round(Math.random() * 800 + 200);
        unidad = 'W/m²';
        threshold = { min: 200, max: 1200 };
        break;
      case 'lluvia':
        valor = Math.max(0, Math.random() * 2);
        status = valor > 20 ? 'warning' : 'normal';
        unidad = 'mm';
        threshold = { min: 0, max: 20 };
        break;
      default:
        valor = Math.round(Math.random() * 100);
        unidad = 'units';
        threshold = { min: 0, max: 100 };
    }
    
    return { valor: Math.round(valor * 10) / 10, status, unidad, threshold };
  };

  // Actualizar datos cada 5 segundos (mismo timing que los gráficos)
  useEffect(() => {
    let currentSensorData: SharedSensorData = {};
    
    const updateData = () => {
      const now = new Date();
      const newSensorData: SharedSensorData = {};
      const newChartPoint: ChartDataPoint = {
        time: now.toISOString(),
      };

      sensores.forEach(sensor => {
        const previousData = currentSensorData[sensor._id];
        const { valor, status, unidad, threshold } = generateFakeValue(sensor.tipo, previousData?.valor);
        
        let trend: 'up' | 'down' | 'stable' = 'stable';
        if (previousData) {
          if (Math.abs(valor - previousData.valor) > 0.1) {
            trend = valor > previousData.valor ? 'up' : 'down';
          }
        }
        
        // Datos para las cards de monitoreo
        newSensorData[sensor._id] = {
          valor,
          timestamp: now,
          trend,
          status,
          unidad,
          threshold
        };

        // Datos para los gráficos
        const chartKey = sensor.nombre.toLowerCase().replace(/\s+/g, '_');
        newChartPoint[chartKey] = valor;
      });

      currentSensorData = newSensorData;
      setSensorData(newSensorData);
      
      // Actualizar datos del gráfico
      setChartData(prev => {
        const newData = [...prev, newChartPoint];
        // Mantener solo los últimos 20 puntos de datos
        return newData.slice(-20);
      });
    };

    // Generar datos iniciales
    if (sensores.length > 0) {
      updateData();
      // Actualizar cada 5 segundos para sincronizar con gráficos
      const interval = setInterval(updateData, 5000);
      return () => clearInterval(interval);
    }
  }, [sensores]);

  return {
    sensorData,
    chartData,
    sensores
  };
};