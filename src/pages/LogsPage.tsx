import React, { useState } from 'react';
import { useLogs } from '../hooks/useSystemData';
import { AlertTriangle, RefreshCw, AlertCircle, Info, FileText, Search } from 'lucide-react';

const LogsPage: React.FC = () => {
  const { logs, loading, error, refetch } = useLogs();
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');

  const filteredLogs = logs.filter(log => {
    const matchesSearch = searchTerm === '' || 
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.source && log.source.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesLevel = levelFilter === 'all' || log.level.toLowerCase() === levelFilter.toLowerCase();
    
    return matchesSearch && matchesLevel;
  });

  const getLogIcon = (level: string) => {
    switch (level.toLowerCase()) {
      case 'error':
        return AlertTriangle;
      case 'warning':
        return AlertCircle;
      case 'info':
        return Info;
      case 'debug':
        return FileText;
      default:
        return FileText;
    }
  };

  const getLogColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'info':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'debug':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const stats = {
    total: logs.length,
    errors: logs.filter(l => l.level.toLowerCase() === 'error').length,
    warnings: logs.filter(l => l.level.toLowerCase() === 'warning').length,
    info: logs.filter(l => l.level.toLowerCase() === 'info').length,
    debug: logs.filter(l => l.level.toLowerCase() === 'debug').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Error al cargar los logs
        </h3>
        <p className="text-gray-500 mb-4">{error}</p>
        <button
          onClick={refetch}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Logs del Sistema</h2>
          <p className="text-gray-600">Registro de actividad y eventos del sistema</p>
        </div>
        <button
          onClick={refetch}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Actualizar
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-600">Total</div>
        </div>
        <div className="bg-red-50 rounded-xl shadow-sm border border-red-200 p-4">
          <div className="text-2xl font-bold text-red-600">{stats.errors}</div>
          <div className="text-sm text-red-700">Errores</div>
        </div>
        <div className="bg-yellow-50 rounded-xl shadow-sm border border-yellow-200 p-4">
          <div className="text-2xl font-bold text-yellow-600">{stats.warnings}</div>
          <div className="text-sm text-yellow-700">Advertencias</div>
        </div>
        <div className="bg-blue-50 rounded-xl shadow-sm border border-blue-200 p-4">
          <div className="text-2xl font-bold text-blue-600">{stats.info}</div>
          <div className="text-sm text-blue-700">Info</div>
        </div>
        <div className="bg-gray-50 rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="text-2xl font-bold text-gray-600">{stats.debug}</div>
          <div className="text-sm text-gray-700">Debug</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar en logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">Todos los niveles</option>
            <option value="error">Error</option>
            <option value="warning">Warning</option>
            <option value="info">Info</option>
            <option value="debug">Debug</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay logs para mostrar
            </h3>
            <p className="text-gray-500">
              {logs.length === 0 
                ? 'No se han registrado eventos aún.' 
                : 'No hay logs que coincidan con los filtros actuales.'
              }
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredLogs.map((log, index) => {
              const IconComponent = getLogIcon(log.level);
              const colorClasses = getLogColor(log.level);
              
              return (
                <div key={log.id || index} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClasses}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colorClasses}`}>
                              {log.level.toUpperCase()}
                            </span>
                            {log.source && (
                              <span className="text-xs text-gray-500">
                                {log.source}
                              </span>
                            )}
                          </div>
                          <p className="text-gray-900 font-medium">
                            {log.message}
                          </p>
                        </div>
                        <div className="text-sm text-gray-500 flex-shrink-0 ml-4">
                          {formatDate(log.timestamp)}
                        </div>
                      </div>
                      {log.details && Object.keys(log.details).length > 0 && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <div className="text-xs font-medium text-gray-700 mb-2">Detalles:</div>
                          <pre className="text-xs text-gray-600 whitespace-pre-wrap">
                            {JSON.stringify(log.details, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default LogsPage;