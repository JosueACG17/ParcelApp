import { apiService } from './api';
import type { 
  Sensor, 
  CreateSensorRequest,
  UpdateSensorRequest,
  Lectura,
  CreateLecturaRequest
} from '../types/parcelas';
import { API_ENDPOINTS } from '../utils/constants';

class SensoresService {
  // Sensores
  async getAllSensores(): Promise<Sensor[]> {
    const response = await apiService.get<Sensor[]>(API_ENDPOINTS.SENSORES);
    return response.data || [];
  }

  async getSensorById(id: string): Promise<Sensor> {
    const response = await apiService.get<Sensor>(API_ENDPOINTS.SENSOR_BY_ID(id));
    return response.data!;
  }

  async getSensoresByParcela(parcelaId: string): Promise<Sensor[]> {
    const response = await apiService.get<Sensor[]>(API_ENDPOINTS.SENSORES_BY_PARCELA(parcelaId));
    return response.data || [];
  }

  async createSensor(sensorData: CreateSensorRequest): Promise<Sensor> {
    const response = await apiService.post<Sensor>(
      API_ENDPOINTS.SENSORES,
      sensorData
    );
    return response.data!;
  }

  async updateSensor(id: string, sensorData: UpdateSensorRequest): Promise<Sensor> {
    const response = await apiService.put<Sensor>(
      API_ENDPOINTS.SENSOR_BY_ID(id),
      sensorData
    );
    return response.data!;
  }

  async deleteSensor(id: string): Promise<void> {
    await apiService.delete(API_ENDPOINTS.SENSOR_BY_ID(id));
  }

  // Lecturas
  async getAllLecturas(): Promise<Lectura[]> {
    const response = await apiService.get<Lectura[]>(API_ENDPOINTS.LECTURAS);
    return response.data || [];
  }

  async createLectura(lecturaData: CreateLecturaRequest): Promise<{ message: string }> {
    const response = await apiService.post<{ message: string }>(
      API_ENDPOINTS.LECTURAS,
      lecturaData
    );
    return response.data!;
  }

  // Obtener lecturas por sensor
  async getLecturasBySensor(sensorId: string): Promise<Lectura[]> {
    const allLecturas = await this.getAllLecturas();
    return allLecturas.filter(lectura => lectura.sensorId === sensorId);
  }

  // Obtener lecturas recientes (últimas 24 horas)
  async getLecturasRecientes(): Promise<Lectura[]> {
    const allLecturas = await this.getAllLecturas();
    const ahora = new Date();
    const hace24Horas = new Date(ahora.getTime() - 24 * 60 * 60 * 1000);
    
    return allLecturas.filter(lectura => 
      new Date(lectura.timestamp) >= hace24Horas
    );
  }
}

export const sensoresService = new SensoresService();
export default sensoresService;