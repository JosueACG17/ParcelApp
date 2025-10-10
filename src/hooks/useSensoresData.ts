import { useState, useEffect, useCallback } from 'react';
import { sensoresService } from '../services/sensoresService';
import type { Sensor, Lectura } from '../types/parcelas';

export const useSensores = () => {
  const [sensores, setSensores] = useState<Sensor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSensores = useCallback(async () => {
    try {
      if (sensores.length === 0) {
        setLoading(true);
      }
      const data = await sensoresService.getAllSensores();
      setSensores(data);
      setError(null);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar los sensores';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [sensores.length]);

  useEffect(() => {
    fetchSensores();
    
    // Actualizar datos cada 30 segundos para tiempo real
    const interval = setInterval(() => {
      fetchSensores();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchSensores]);

  const createSensor = async (sensorData: {
    nombre: string;
    cultivo: string;
    tipo: 'temperatura' | 'humedad' | 'radiacion_solar' | 'lluvia';
    id_parcela_sql: string;
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

  const updateSensor = async (id: string, sensorData: {
    nombre?: string;
    cultivo?: string;
    tipo?: 'temperatura' | 'humedad' | 'radiacion_solar' | 'lluvia';
    id_parcela_sql?: string;
  }) => {
    try {
      const updatedSensor = await sensoresService.updateSensor(id, sensorData);
      setSensores(prev => prev.map(sensor => 
        sensor._id === id ? updatedSensor : sensor
      ));
      return updatedSensor;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar el sensor';
      setError(errorMessage);
      throw err;
    }
  };

  const deleteSensor = async (id: string) => {
    try {
      await sensoresService.deleteSensor(id);
      setSensores(prev => prev.filter(sensor => sensor._id !== id));
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar el sensor';
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
    updateSensor,
    deleteSensor,
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
    valor: number;
    unidad: string;
  }) => {
    try {
      const newLectura = await sensoresService.createLectura(lecturaData);
      setLecturas(prev => [...prev, newLectura]);
      return newLectura;
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