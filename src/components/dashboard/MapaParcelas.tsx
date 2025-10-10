import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useParcelas } from '../../hooks/useParcelasData';
import { MapPin, Leaf, Plus } from 'lucide-react';
import L from 'leaflet';

// Fix para los iconos de Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';

// Configurar iconos por defecto
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetina,
  iconUrl: icon,
  shadowUrl: iconShadow,
});

// Icono personalizado para las parcelas
const parcelaIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const MapaParcelas: React.FC = () => {
  const { parcelas, loading, error } = useParcelas();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-2">Error al cargar el mapa</div>
        <div className="text-sm text-gray-500">{error}</div>
      </div>
    );
  }

  const parcelasActivas = parcelas.filter(p => !p.isDeleted);

  // Calcular el centro del mapa basado en las parcelas existentes
  const calcularCentro = () => {
    if (parcelasActivas.length === 0) {
      return { lat: -12.0464, lng: -77.0428 }; // Lima, Perú por defecto
    }

    const totalLat = parcelasActivas.reduce((sum, p) => sum + p.latitud, 0);
    const totalLng = parcelasActivas.reduce((sum, p) => sum + p.longitud, 0);
    
    return {
      lat: totalLat / parcelasActivas.length,
      lng: totalLng / parcelasActivas.length
    };
  };

  const centro = calcularCentro();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Mapa de Parcelas
            </h3>
            <p className="text-sm text-gray-500">
              Ubicación geográfica de {parcelasActivas.length} parcelas activas
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <MapPin className="w-3 h-3 mr-1" />
              {parcelasActivas.length} ubicaciones
            </span>
          </div>
        </div>
      </div>

      {/* Contenido del mapa */}
      <div className="p-6">
        {parcelasActivas.length === 0 ? (
          <div className="text-center py-12">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay parcelas para mostrar
            </h3>
            <p className="text-gray-500 mb-4">
              Crea tu primera parcela para verla en el mapa.
            </p>
            <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Crear Parcela
            </button>
          </div>
        ) : (
          <div>
            {/* Mapa real con Leaflet */}
            <div className="rounded-xl overflow-hidden mb-6" style={{ height: '400px' }}>
              <MapContainer
                center={[centro.lat, centro.lng]}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
                className="rounded-xl"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {parcelasActivas.map((parcela) => (
                  <Marker
                    key={parcela.id}
                    position={[parcela.latitud, parcela.longitud]}
                    icon={parcelaIcon}
                  >
                    <Popup>
                      <div className="p-2">
                        <h4 className="font-semibold text-gray-900 mb-2">{parcela.nombre}</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3 h-3 text-gray-500" />
                            <span>{parcela.latitud.toFixed(4)}, {parcela.longitud.toFixed(4)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Leaf className="w-3 h-3 text-green-500" />
                            <span>{parcela.cantidadCultivos} cultivos</span>
                          </div>
                          <div className="text-xs text-gray-500 mt-2">
                            Cultivos: {parcela.nombresCultivos.join(', ')}
                          </div>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>

            {/* Lista de parcelas con coordenadas reales */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 mb-3">Parcelas en el Mapa:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {parcelasActivas.map((parcela, index) => (
                  <div
                    key={parcela.id}
                    className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-3 h-3 rounded-full bg-green-500`} />
                          <h5 className="font-medium text-gray-900">{parcela.nombre}</h5>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="w-3 h-3" />
                            <span>
                              {parcela.latitud.toFixed(4)}, {parcela.longitud.toFixed(4)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Leaf className="w-3 h-3" />
                            <span>
                              {parcela.cantidadCultivos} cultivos: {parcela.nombresCultivos.join(', ')}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-400">
                        #{index + 1}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Estadísticas del mapa */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-blue-600">{parcelasActivas.length}</div>
                <div className="text-sm text-blue-700">Parcelas</div>
              </div>
              <div className="bg-green-50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {parcelasActivas.reduce((sum, p) => sum + p.cantidadCultivos, 0)}
                </div>
                <div className="text-sm text-green-700">Cultivos</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {centro.lat.toFixed(2)}°
                </div>
                <div className="text-sm text-purple-700">Lat Centro</div>
              </div>
              <div className="bg-orange-50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {centro.lng.toFixed(2)}°
                </div>
                <div className="text-sm text-orange-700">Lng Centro</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapaParcelas;