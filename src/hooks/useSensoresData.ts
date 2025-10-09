import { useState, useEffect, useCallback } from 'react';
import { sensoresService } from '../services/sensoresService';
import type { Sensor, Lectura } from '../types/parcelas';

export const useSensores = () => {
  const [sensores, setSensores] = useState<Sensor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSensores = async () => {
    try {
      setLoading(true);
      const data = await sensoresService.getAllSensores();
      setSensores(data);
      setError(null);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar los sensores';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSensores();
  }, []);

  const createSensor = async (sensorData: {
    _id: string;
    nombre: string;
    tipo: 'temperatura' | 'humedad' | 'radiacion_solar' | 'lluvia';
    id_parcela_sql: string;
    cultivo?: string;
  }) => {
    try {
      const newSensor = await sensoresService.createSensor(sensorData);
      setSensores(prev => [...prev, newSensor]);
      return newSensor;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear el sensor';
      setError(errorMessage);
      throw err;
    }
  };

  return {
    sensores,
    loading,
    error,
    refetch: fetchSensores,
    createSensor,
  };
};

export const useLecturas = () => {
  const [lecturas, setLecturas] = useState<Lectura[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLecturas = async () => {
    try {
      setLoading(true);
      const data = await sensoresService.getAllLecturas();
      setLecturas(data);
      setError(null);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar las lecturas';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLecturas();
  }, []);

  const createLectura = async (lecturaData: {
    sensorId: string;
    value: number;
    unit: string;
    timestamp: string;
    coords: {
      lat: number;
      lon: number;
    };
  }) => {
    try {
      const response = await sensoresService.createLectura(lecturaData);
      // Refetch lecturas since API only returns success message
      await fetchLecturas();
      return response;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear la lectura';
      setError(errorMessage);
      throw err;
    }
  };

  return {
    lecturas,
    loading,
    error,
    refetch: fetchLecturas,
    createLectura,
  };
};

export const useLecturasRecientes = () => {
  const [lecturasRecientes, setLecturasRecientes] = useState<Lectura[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLecturasRecientes = async () => {
    try {
      setLoading(true);
      const data = await sensoresService.getLecturasRecientes();
      setLecturasRecientes(data);
      setError(null);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar las lecturas recientes';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLecturasRecientes();
    
    // Actualizar cada 30 segundos
    const interval = setInterval(fetchLecturasRecientes, 30000);
    return () => clearInterval(interval);
  }, []);

  return {
    lecturasRecientes,
    loading,
    error,
    refetch: fetchLecturasRecientes,
  };
};

export const useLecturasBySensor = (sensorId: string) => {
  const [lecturas, setLecturas] = useState<Lectura[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLecturasBySensor = useCallback(async () => {
    if (!sensorId) return;
    
    try {
      setLoading(true);
      const data = await sensoresService.getLecturasBySensor(sensorId);
      setLecturas(data);
      setError(null);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar las lecturas del sensor';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [sensorId]);

  useEffect(() => {
    fetchLecturasBySensor();
  }, [fetchLecturasBySensor]);

  return {
    lecturas,
    loading,
    error,
    refetch: fetchLecturasBySensor,
  };
};