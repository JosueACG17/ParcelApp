// Tipos para Parcelas (.NET API)
export interface Parcela {
  id: string; // GUID
  nombre: string;
  latitud: number;
  longitud: number;
  cantidadCultivos: number;
  nombresCultivos: string[];
  isDeleted: boolean;
}

export interface CreateParcelaRequest {
  nombre: string; // max 100 chars
  latitud: number; // -90 a 90
  longitud: number; // -180 a 180
  cultivosIds: number[];
}

export interface UpdateParcelaRequest {
  nombre?: string;
  latitud?: number;
  longitud?: number;
  cultivosIds?: number[];
}

// Tipos para Cultivos (.NET API)
export interface Cultivo {
  id: number;
  nombre: string;
  isDeleted: boolean;
}

export interface CreateCultivoRequest {
  nombre: string; // max 50 chars
}

export interface UpdateCultivoRequest {
  nombre: string;
}

// Tipos para Sensores (Node.js service)
export interface Sensor {
  _id: string;
  nombre: string;
  cultivo: string;
  tipo: 'temperatura' | 'humedad' | 'radiacion_solar' | 'lluvia';
  id_parcela_sql: string;
  fecha_instalacion: string; // ISO 8601
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

export interface CreateSensorRequest {
  nombre: string;
  cultivo: string;
  tipo: 'temperatura' | 'humedad' | 'radiacion_solar' | 'lluvia';
  id_parcela_sql: string;
}

export interface UpdateSensorRequest {
  nombre?: string;
  cultivo?: string;
  tipo?: 'temperatura' | 'humedad' | 'radiacion_solar' | 'lluvia';
  id_parcela_sql?: string;
}

// Tipos para Lecturas (Node.js service)
export interface Lectura {
  _id: string;
  sensorId: string;
  valor: number;
  unidad: string;
  timestamp: string; // ISO 8601
}

export interface CreateLecturaRequest {
  sensorId: string;
  valor: number;
  unidad: string;
}

// Tipo para el endpoint del gateway (parcela detallada)
export interface ParcelaDetallada {
  parcela: Parcela;
  sensores: Sensor[];
  ultimasLecturas: Lectura[];
}