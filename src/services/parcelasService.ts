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
    return response.data!;
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
    const url = includeDeleted 
      ? `${API_ENDPOINTS.CULTIVOS}?includeDeleted=true`
      : API_ENDPOINTS.CULTIVOS;
      
    const response = await apiService.get<Cultivo[]>(url);
    return response.data || [];
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
    return response.data!;
  }

  async updateCultivo(id: number, cultivoData: UpdateCultivoRequest): Promise<void> {
    await apiService.put(API_ENDPOINTS.CULTIVO_BY_ID(id), cultivoData);
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