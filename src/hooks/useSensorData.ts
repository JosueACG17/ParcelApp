import { useState, useEffect, useCallback } from 'react';
import { useAlertStore } from '../stores/alertStore';
import { DATA_UPDATE_INTERVALS } from '../constants/dashboard';

export interface SensorData {
  time: string;
  temperature: number;
  humidity: number;
  solarRadiation: number;
  rain: number;
}

/**
 * Hook personalizado para manejar datos de sensores
 * Separa la lógica de generación de datos mock del componente
 */
export const useSensorData = () => {
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const { checkSensorAlerts } = useAlertStore();

  const generateMockData = useCallback((): SensorData[] => {
    const data: SensorData[] = [];
    const now = new Date();

    for (let i = 23; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000);
      data.push({
        time: time.toISOString(),
        temperature: 20 + Math.sin(i * 0.3) * 8 + Math.random() * 3,
        humidity: 60 + Math.cos(i * 0.2) * 20 + Math.random() * 5,
        solarRadiation: Math.max(
          0,
          400 + Math.sin((i - 12) * 0.5) * 400 + Math.random() * 100
        ),
        rain: Math.random() < 0.8 ? 0 : Math.random() * 10,
      });
    }
    return data;
  }, []);

  // Inicializar y actualizar datos
  useEffect(() => {
    const newData = generateMockData();
    setSensorData(newData);
    checkSensorAlerts(newData);

    const interval = setInterval(() => {
      const updatedData = generateMockData();
      setSensorData(updatedData);
      checkSensorAlerts(updatedData);
    }, DATA_UPDATE_INTERVALS.SENSORS);

    return () => clearInterval(interval);
  }, [generateMockData, checkSensorAlerts]);

  return {
    sensorData,
    refreshData: () => {
      const newData = generateMockData();
      setSensorData(newData);
      checkSensorAlerts(newData);
    }
  };
};