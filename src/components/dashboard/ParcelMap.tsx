import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix para los íconos de Leaflet
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Parcel {
  id: string;
  name: string;
  coordinates: [number, number];
  area: number;
  crop: string;
  status: 'active' | 'preparation' | 'harvested' | 'deleted';
  responsible: string;
  plantDate?: string;
  harvestDate?: string;
}

const parcelsData: Parcel[] = [
  {
    id: '1',
    name: 'Parcela Norte A1',
    coordinates: [-34.6037, -58.3816], // Buenos Aires como ejemplo
    area: 12.5,
    crop: 'Maíz',
    status: 'active',
    responsible: 'Juan Pérez',
    plantDate: '2024-03-15'
  },
  {
    id: '2',
    name: 'Parcela Sur B3',
    coordinates: [-34.6047, -58.3826],
    area: 8.2,
    crop: 'Trigo',
    status: 'preparation',
    responsible: 'María García'
  },
  {
    id: '3',
    name: 'Parcela Este C2',
    coordinates: [-34.6027, -58.3836],
    area: 15.0,
    crop: 'Soja',
    status: 'harvested',
    responsible: 'Carlos López',
    plantDate: '2024-01-10',
    harvestDate: '2024-04-20'
  },
  {
    id: '4',
    name: 'Parcela Oeste D1',
    coordinates: [-34.6057, -58.3806],
    area: 6.8,
    crop: 'Girasol',
    status: 'active',
    responsible: 'Ana Martínez',
    plantDate: '2024-02-28'
  },
  {
    id: '5',
    name: 'Parcela Central E1',
    coordinates: [-34.6037, -58.3796],
    area: 10.3,
    crop: 'Maíz',
    status: 'deleted',
    responsible: 'Roberto Silva',
    plantDate: '2023-12-01',
    harvestDate: '2024-03-15'
  }
];

const ParcelMap: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (mapRef.current && !mapInstance.current) {
      // Inicializar el mapa
      mapInstance.current = L.map(mapRef.current).setView([-34.6037, -58.3816], 14);

      // Agregar capa de tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstance.current);

      // Agregar marcadores para cada parcela
      parcelsData.forEach((parcel) => {
        if (mapInstance.current) {
          const getMarkerColor = (status: string) => {
            switch (status) {
              case 'active': return '#22c55e';
              case 'preparation': return '#f59e0b';
              case 'harvested': return '#3b82f6';
              case 'deleted': return '#ef4444';
              default: return '#6b7280';
            }
          };

          const getStatusText = (status: string) => {
            switch (status) {
              case 'active': return 'Activa';
              case 'preparation': return 'En Preparación';
              case 'harvested': return 'Cosechada';
              case 'deleted': return 'Eliminada';
              default: return 'Desconocido';
            }
          };

          // Crear ícono personalizado
          const customIcon = L.divIcon({
            html: `
              <div style="
                background-color: ${getMarkerColor(parcel.status)};
                width: 24px;
                height: 24px;
                border-radius: 50%;
                border: 3px solid white;
                box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                color: white;
                font-size: 12px;
              ">
                ${parcel.status === 'deleted' ? '✕' : '🌾'}
              </div>
            `,
            className: 'custom-marker',
            iconSize: [24, 24],
            iconAnchor: [12, 12]
          });

          const marker = L.marker(parcel.coordinates, { icon: customIcon })
            .addTo(mapInstance.current);

          // Popup con información detallada
          const popupContent = `
            <div style="font-family: system-ui; max-width: 250px;">
              <h3 style="margin: 0 0 8px 0; color: #1f2937; font-size: 16px; font-weight: bold;">
                ${parcel.name}
              </h3>
              <div style="display: grid; gap: 4px; font-size: 14px;">
                <p style="margin: 0;"><strong>Cultivo:</strong> ${parcel.crop}</p>
                <p style="margin: 0;"><strong>Área:</strong> ${parcel.area} ha</p>
                <p style="margin: 0;"><strong>Estado:</strong> 
                  <span style="
                    background: ${getMarkerColor(parcel.status)}20;
                    color: ${getMarkerColor(parcel.status)};
                    padding: 2px 6px;
                    border-radius: 4px;
                    font-size: 12px;
                  ">
                    ${getStatusText(parcel.status)}
                  </span>
                </p>
                <p style="margin: 0;"><strong>Responsable:</strong> ${parcel.responsible}</p>
                ${parcel.plantDate ? `<p style="margin: 0;"><strong>Siembra:</strong> ${new Date(parcel.plantDate).toLocaleDateString('es-ES')}</p>` : ''}
                ${parcel.harvestDate ? `<p style="margin: 0;"><strong>Cosecha:</strong> ${new Date(parcel.harvestDate).toLocaleDateString('es-ES')}</p>` : ''}
              </div>
            </div>
          `;

          marker.bindPopup(popupContent);
        }
      });
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  const deletedParcels = parcelsData.filter(p => p.status === 'deleted');

  return (
    <div className="space-y-6">
      {/* Mapa */}
      <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          Mapa de Parcelas
          </h3>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Activa</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span>Preparación</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Cosechada</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Eliminada</span>
            </div>
          </div>
        </div>
        
        <div 
          ref={mapRef} 
          className="w-full h-96 rounded-xl border border-gray-200"
          style={{ minHeight: '400px' }}
        />
      </div>

      {/* Lista de Parcelas Eliminadas */}
      <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          Parcelas Eliminadas
        </h3>
        
        {deletedParcels.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No hay parcelas eliminadas registradas
          </p>
        ) : (
          <div className="space-y-4">
            {deletedParcels.map((parcel) => (
              <div 
                key={parcel.id}
                className="bg-red-50 border border-red-200 rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-800">{parcel.name}</h4>
                  <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-medium">
                    Eliminada
                  </span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Cultivo</p>
                    <p className="font-medium">{parcel.crop}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Área</p>
                    <p className="font-medium">{parcel.area} ha</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Responsable</p>
                    <p className="font-medium">{parcel.responsible}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Coordenadas</p>
                    <p className="font-medium text-xs">
                      {parcel.coordinates[0].toFixed(4)}, {parcel.coordinates[1].toFixed(4)}
                    </p>
                  </div>
                </div>

                {(parcel.plantDate || parcel.harvestDate) && (
                  <div className="mt-3 pt-3 border-t border-red-200">
                    <div className="flex gap-4 text-sm">
                      {parcel.plantDate && (
                        <div>
                          <p className="text-gray-600">Fecha de Siembra</p>
                          <p className="font-medium">
                            {new Date(parcel.plantDate).toLocaleDateString('es-ES')}
                          </p>
                        </div>
                      )}
                      {parcel.harvestDate && (
                        <div>
                          <p className="text-gray-600">Fecha de Cosecha</p>
                          <p className="font-medium">
                            {new Date(parcel.harvestDate).toLocaleDateString('es-ES')}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ParcelMap;