// Constantes para el sistema de alertas

// Configuración de severidades de alertas
export const ALERT_SEVERITY = {
  CRITICAL: 'critical',
  MEDIUM: 'medium',
  LOW: 'low',
} as const;

// Tipos de alertas
export const ALERT_TYPES = {
  SENSOR: 'sensor',
  SYSTEM: 'system',
  AGRICULTURAL: 'agricultural',
} as const;

// Tipos de sensores
export const SENSOR_TYPES = {
  TEMPERATURE: 'temperature',
  HUMIDITY: 'humidity',
  SOLAR_RADIATION: 'solarRadiation',
  RAIN: 'rain',
} as const;

// Colores para severidades
export const SEVERITY_COLORS = {
  [ALERT_SEVERITY.CRITICAL]: 'border-l-red-500 bg-red-50',
  [ALERT_SEVERITY.MEDIUM]: 'border-l-yellow-500 bg-yellow-50',
  [ALERT_SEVERITY.LOW]: 'border-l-blue-500 bg-blue-50',
} as const;

// Umbrales para generar alertas automáticas
export const SENSOR_THRESHOLDS = {
  TEMPERATURE: {
    CRITICAL: 40,
    WARNING: 35,
    UNIT: '°C',
  },
  HUMIDITY: {
    CRITICAL: 20,
    WARNING: 30,
    UNIT: '%',
  },
  SOLAR_RADIATION: {
    MIN_EXPECTED: 400,
    UNIT: 'W/m²',
  },
} as const;

// Filtros por defecto
export const DEFAULT_FILTERS = {
  type: 'all',
  severity: 'all',
  status: 'all',
} as const;