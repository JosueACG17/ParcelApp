import { useState, useEffect, useCallback } from 'react';
import { parcelasService } from '../services/parcelasService';
import type { Parcela, ParcelaDetallada, Cultivo } from '../types/parcelas';

export const useParcelas = () => {
  const [parcelas, setParcelas] = useState<Parcela[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchParcelas = async (includeDeleted = false) => {
    try {
      setLoading(true);
      const data = await parcelasService.getAllParcelas(includeDeleted);
      setParcelas(data);
      setError(null);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar las parcelas';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParcelas();
  }, []);

  const createParcela = async (parcelaData: {
    nombre: string;
    latitud: number;
    longitud: number;
    cultivosIds: number[];
  }) => {
    try {
      const newParcela = await parcelasService.createParcela(parcelaData);
      
      // Limpiar error previo si existía
      setError(null);
      
      // Hacer refetch para obtener datos actualizados del servidor
      await fetchParcelas();
      
      return newParcela;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear la parcela';
      setError(errorMessage);
      throw err;
    }
  };

  const updateParcela = async (id: string, parcelaData: {
    nombre?: string;
    latitud?: number;
    longitud?: number;
    cultivosIds?: number[];
  }) => {
    try {
      await parcelasService.updateParcela(id, parcelaData);
      // Refetch data since API returns 204 No Content
      await fetchParcelas();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar la parcela';
      setError(errorMessage);
      throw err;
    }
  };

  const deleteParcela = async (id: string) => {
    try {
      await parcelasService.deleteParcela(id);
      setParcelas(prev => prev.filter(p => p.id !== id));
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar la parcela';
      setError(errorMessage);
      throw err;
    }
  };

  const restoreParcela = async (id: string) => {
    try {
      await parcelasService.restoreParcela(id);
      // Refetch data since API returns 204 No Content
      await fetchParcelas();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al restaurar la parcela';
      setError(errorMessage);
      throw err;
    }
  };

  return {
    parcelas,
    loading,
    error,
    refetch: fetchParcelas,
    createParcela,
    updateParcela,
    deleteParcela,
    restoreParcela,
  };
};

export const useParcelaDetallada = (id: string) => {
  const [parcelaDetallada, setParcelaDetallada] = useState<ParcelaDetallada | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchParcelaDetallada = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const data = await parcelasService.getParcelaDetallada(id);
      setParcelaDetallada(data);
      setError(null);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar los detalles de la parcela';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchParcelaDetallada();
  }, [fetchParcelaDetallada]);

  return {
    parcelaDetallada,
    loading,
    error,
    refetch: fetchParcelaDetallada,
  };
};

export const useCultivos = () => {
  const [cultivos, setCultivos] = useState<Cultivo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCultivos = async (includeDeleted = false) => {
    try {
      setLoading(true);
      const data = await parcelasService.getAllCultivos(includeDeleted);
      setCultivos(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar los cultivos';
      setError(`Error al cargar cultivos: ${errorMessage}`);
      setCultivos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCultivos();
  }, []);

  const createCultivo = async (cultivoData: {
    nombre: string;
  }) => {
    try {
      const newCultivo = await parcelasService.createCultivo(cultivoData);
      setCultivos(prev => [...prev, newCultivo]);
      return newCultivo;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear el cultivo';
      setError(errorMessage);
      throw err;
    }
  };

  const updateCultivo = async (id: number, cultivoData: {
    nombre: string;
  }) => {
    try {
      const updatedCultivo = await parcelasService.updateCultivo(id, cultivoData);
      setCultivos(prev => prev.map(cultivo => 
        cultivo.id === id ? updatedCultivo : cultivo
      ));
      return updatedCultivo;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar el cultivo';
      setError(errorMessage);
      throw err;
    }
  };

  const deleteCultivo = async (id: number) => {
    try {
      await parcelasService.deleteCultivo(id);
      setCultivos(prev => prev.filter(cultivo => cultivo.id !== id));
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar el cultivo';
      setError(errorMessage);
      throw err;
    }
  };

  const restoreCultivo = async (id: number) => {
    try {
      await parcelasService.restoreCultivo(id);
      await fetchCultivos(); // Refetch data
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al restaurar el cultivo';
      setError(errorMessage);
      throw err;
    }
  };

  return {
    cultivos,
    loading,
    error,
    refetch: fetchCultivos,
    createCultivo,
    updateCultivo,
    deleteCultivo,
    restoreCultivo,
  };
};