// API Configuration
export const API_BASE_URL = 'http://localhost:5172';

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: '/agro/auth/login',
  REGISTER: '/agro/auth/register',
  
  // Parcelas endpoints (.NET)
  PARCELAS: '/agro/parcelas',
  PARCELA_BY_ID: (id: string) => `/agro/parcelas/${id}`,
  PARCELA_RESTORE: (id: string) => `/agro/parcelas/${id}/restore`,
  
  // Gateway endpoint for detailed parcel
  PARCELA_DETALLADA: (id: string) => `/gateway/parcela-detallada/${id}`,
  
  // Cultivos endpoints (.NET)
  CULTIVOS: '/agro/cultivos',
  CULTIVO_BY_ID: (id: number) => `/agro/cultivos/${id}`,
  CULTIVO_RESTORE: (id: number) => `/agro/cultivos/${id}/restore`,
  
  // Users endpoints (.NET)
  USERS: '/agro/users',
  USER_BY_ID: (id: number) => `/agro/users/${id}`,
  USER_RESTORE: (id: number) => `/agro/users/${id}/restore`,
  
  // Sensors endpoints (Node.js service)
  SENSORES: '/sensores',
  SENSOR_BY_ID: (id: string) => `/sensores/${id}`,
  SENSORES_BY_PARCELA: (parcelaId: string) => `/sensores/by-parcela/${parcelaId}`,
  
  // Lecturas endpoints (Node.js service)
  LECTURAS: '/lecturas',
  
  // Logs endpoints
  LOGS: '/logs',
  
  // Roles endpoints
  ROLES: '/roles',
} as const;