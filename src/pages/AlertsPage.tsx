import React, { useState, useEffect } from 'react';
import { useAlertStore } from '../stores/alertStore';
import type { Alert, AlertFilters as AlertFiltersType } from '../types';
import { AlertStatsCards } from '../components/alerts/AlertStatsCards';
import { AlertFilters } from '../components/alerts/AlertFilters';
import { AlertCard } from '../components/alerts/AlertCard';
import { AlertTriangle, RefreshCw, AlertCircle } from 'lucide-react';
import { DEFAULT_FILTERS } from '../constants/alerts';

/**
 * Página de alertas refactorizada - Más modular y mantenible
 * Usa componentes reutilizables y separa la lógica de presentación
 */
const AlertsPage: React.FC = () => {
  const {
    alerts,
    filteredAlerts,
    filters,
    stats,
    setFilters,
    markAsRead,
    markAsResolved,
    generateMockAlerts
  } = useAlertStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Inicializar con datos mock al cargar
  useEffect(() => {
    if (alerts.length === 0) {
      generateMockAlerts();
    }
  }, [alerts.length, generateMockAlerts]);

  // Filtrar por término de búsqueda
  const searchFilteredAlerts = filteredAlerts.filter((alert: Alert) => 
    alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alert.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alert.parcelName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFilterChange = (key: keyof AlertFiltersType, value: string) => {
    setFilters({
      ...filters,
      [key]: value
    });
  };

  const clearFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setSearchTerm('');
  };

  const handleMarkAsResolved = (id: string) => {
    markAsResolved(id, 'Usuario');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-red-500" />
            Sistema de Alertas
          </h1>
          <p className="text-gray-600 mt-1">
            Monitoreo y gestión de alertas del sistema IoT agrícola
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => generateMockAlerts()}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Actualizar
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <AlertStatsCards stats={stats} />

      {/* Filters and Search */}
      <AlertFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
      />

      {/* Alerts List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Alertas ({searchFilteredAlerts.length})
        </h3>
        
        {searchFilteredAlerts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg border p-8 text-center">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No hay alertas</h3>
            <p className="text-gray-500">No se encontraron alertas que coincidan con los filtros aplicados.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {searchFilteredAlerts.map((alert) => (
              <AlertCard
                key={alert.id}
                alert={alert}
                onMarkAsRead={markAsRead}
                onMarkAsResolved={handleMarkAsResolved}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertsPage;