// Constantes para el Dashboard
export const DASHBOARD_TABS = [
  { id: 'overview', label: 'Resumen', icon: 'Home' },
  { id: 'sensors', label: 'Sensores', icon: 'Activity' },
  { id: 'analytics', label: 'Análisis', icon: 'PieChart' },
  { id: 'map', label: 'Mapa', icon: 'MapPin' },
  { id: 'parcels', label: 'Parcelas', icon: 'Database' },
  { id: 'cultivos', label: 'Cultivos', icon: 'Leaf' },
  { id: 'sensors-crud', label: 'Gestión Sensores', icon: 'Activity' },
  { id: 'users', label: 'Usuarios', icon: 'Users' },
  { id: 'alerts', label: 'Alertas', icon: 'Bell' },
] as const;

export type DashboardTab = typeof DASHBOARD_TABS[number]['id'];

// Configuración de actualizaciones de datos
export const DATA_UPDATE_INTERVALS = {
  SENSORS: 5 * 60 * 1000, // 5 minutos
  ALERTS: 30 * 1000, // 30 segundos
} as const;

// Estados de parcelas
export const PARCEL_STATUS = {
  ACTIVE: 'Activa',
  PREPARING: 'En preparación',
  HARVESTED: 'Cosechada',
} as const;

// Colores para estados
export const STATUS_COLORS = {
  [PARCEL_STATUS.ACTIVE]: 'bg-green-100 text-green-800',
  [PARCEL_STATUS.PREPARING]: 'bg-yellow-100 text-yellow-800',
  [PARCEL_STATUS.HARVESTED]: 'bg-blue-100 text-blue-800',
} as const;

// Colores para salud de parcelas
export const HEALTH_COLORS = {
  'Excelente': 'text-green-600',
  'Buena': 'text-blue-600',
  'Regular': 'text-yellow-600',
  'Mala': 'text-red-600',
} as const;