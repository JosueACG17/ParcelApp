import { apiService } from './api';
import type { 
  Parcela, 
  CreateParcelaRequest, 
  UpdateParcelaRequest,
  ParcelaDetallada,
  Cultivo,
  CreateCultivoRequest,
  UpdateCultivoRequest
} from '../types/parcelas';
import { API_ENDPOINTS } from '../utils/constants';

class ParcelasService {
  // Parcelas CRUD
  async getAllParcelas(includeDeleted = false): Promise<Parcela[]> {
    const url = includeDeleted 
      ? `${API_ENDPOINTS.PARCELAS}?includeDeleted=true`
      : API_ENDPOINTS.PARCELAS;
      
    const response = await apiService.get<Parcela[]>(url);
    return response.data || [];
  }

  async getParcelaById(id: string): Promise<Parcela> {
    const response = await apiService.get<Parcela>(
      API_ENDPOINTS.PARCELA_BY_ID(id)
    );
    return response.data!;
  }

  async getParcelaDetallada(id: string): Promise<ParcelaDetallada> {
    const response = await apiService.get<ParcelaDetallada>(
      API_ENDPOINTS.PARCELA_DETALLADA(id)
    );
    return response.data!;
  }

  async createParcela(parcelaData: CreateParcelaRequest): Promise<Parcela> {
    const response = await apiService.post<Parcela>(
      API_ENDPOINTS.PARCELAS,
      parcelaData
    );
    
    // Si response.data existe, lo usamos, sino creamos una parcela temporal
    if (response.data) {
      return response.data;
    }
    
    // Si no hay data, crear una parcela temporal con los datos enviados
    // más un ID temporal para evitar errores
    const tempParcela: Parcela = {
      id: `temp-${Date.now()}`,
      nombre: parcelaData.nombre,
      latitud: parcelaData.latitud,
      longitud: parcelaData.longitud,
      cantidadCultivos: parcelaData.cultivosIds.length,
      nombresCultivos: [], // Se llenarán en el próximo refetch
      isDeleted: false
    };
    
    return tempParcela;
  }

  async updateParcela(id: string, parcelaData: UpdateParcelaRequest): Promise<void> {
    await apiService.put(
      API_ENDPOINTS.PARCELA_BY_ID(id),
      parcelaData
    );
  }

  async deleteParcela(id: string): Promise<void> {
    await apiService.delete(API_ENDPOINTS.PARCELA_BY_ID(id));
  }

  async restoreParcela(id: string): Promise<void> {
    await apiService.patch(API_ENDPOINTS.PARCELA_RESTORE(id));
  }

  // Cultivos
  async getAllCultivos(includeDeleted = false): Promise<Cultivo[]> {
    // Forzamos el endpoint correcto directamente
    const url = includeDeleted 
      ? '/agro/cultivos?includeDeleted=true'
      : '/agro/cultivos';
      
    // Usar el nuevo método getArray que maneja arrays directos
    const cultivos = await apiService.getArray<Cultivo>(url);
    return cultivos;
  }

  async getCultivoById(id: number): Promise<Cultivo> {
    const response = await apiService.get<Cultivo>(
      API_ENDPOINTS.CULTIVO_BY_ID(id)
    );
    return response.data!;
  }

  async createCultivo(cultivoData: CreateCultivoRequest): Promise<Cultivo> {
    const response = await apiService.post<Cultivo>(
      API_ENDPOINTS.CULTIVOS,
      cultivoData
    );
    
    // Si response.data existe, lo usamos, sino creamos un cultivo temporal
    if (response.data) {
      return response.data;
    }
    
    // Si no hay data, crear un cultivo temporal con los datos enviados
    const tempCultivo: Cultivo = {
      id: Date.now(), // ID temporal
      nombre: cultivoData.nombre,
      isDeleted: false
    };
    
    return tempCultivo;
  }

  async updateCultivo(id: number, cultivoData: UpdateCultivoRequest): Promise<Cultivo> {
    const response = await apiService.put<Cultivo>(
      API_ENDPOINTS.CULTIVO_BY_ID(id),
      cultivoData
    );
    return response.data!;
  }

  async deleteCultivo(id: number): Promise<void> {
    await apiService.delete(API_ENDPOINTS.CULTIVO_BY_ID(id));
  }

  async restoreCultivo(id: number): Promise<void> {
    await apiService.patch(API_ENDPOINTS.CULTIVO_RESTORE(id));
  }
}

export const parcelasService = new ParcelasService();
export default parcelasService;