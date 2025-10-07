import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter, 
  MapPin,
  Calendar,
  User,
  Leaf
} from 'lucide-react';
import Modal from '../ui/Modal';
import ConfirmModal from '../ui/ConfirmModal';
import ExportButton from '../ui/ExportButton';

interface Parcel {
  id: string;
  name: string;
  crop: string;
  area: number;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  responsible: string;
  status: 'active' | 'preparation' | 'harvested' | 'deleted';
  plantDate?: string;
  harvestDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

const ParcelsCRUD: React.FC = () => {
  const [parcels, setParcels] = useState<Parcel[]>([
    {
      id: '1',
      name: 'Parcela Norte A1',
      crop: 'Maíz',
      area: 12.5,
      location: {
        latitude: -34.6037,
        longitude: -58.3816,
        address: 'Zona Norte, Campo San Juan'
      },
      responsible: 'Juan Pérez',
      status: 'active',
      plantDate: '2024-03-15',
      notes: 'Excelente drenaje, suelo fértil',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-03-15T14:30:00Z'
    },
    {
      id: '2',
      name: 'Parcela Sur B3',
      crop: 'Trigo',
      area: 8.2,
      location: {
        latitude: -34.6047,
        longitude: -58.3826,
        address: 'Zona Sur, Campo San Juan'
      },
      responsible: 'María García',
      status: 'preparation',
      notes: 'Preparando para siembra de invierno',
      createdAt: '2024-02-01T09:00:00Z',
      updatedAt: '2024-02-01T09:00:00Z'
    },
    {
      id: '3',
      name: 'Parcela Este C2',
      crop: 'Soja',
      area: 15.0,
      location: {
        latitude: -34.6027,
        longitude: -58.3836,
        address: 'Zona Este, Campo San Juan'
      },
      responsible: 'Carlos López',
      status: 'harvested',
      plantDate: '2024-01-10',
      harvestDate: '2024-04-20',
      notes: 'Cosecha exitosa, alto rendimiento',
      createdAt: '2023-12-15T08:00:00Z',
      updatedAt: '2024-04-20T16:00:00Z'
    }
  ]);

  const [filteredParcels, setFilteredParcels] = useState<Parcel[]>(parcels);
  const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Filtros
  useEffect(() => {
    let filtered = parcels;

    if (searchTerm) {
      filtered = filtered.filter(parcel => 
        parcel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        parcel.crop.toLowerCase().includes(searchTerm.toLowerCase()) ||
        parcel.responsible.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(parcel => parcel.status === statusFilter);
    }

    setFilteredParcels(filtered);
  }, [parcels, searchTerm, statusFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'preparation': return 'bg-yellow-100 text-yellow-800';
      case 'harvested': return 'bg-blue-100 text-blue-800';
      case 'deleted': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Activa';
      case 'preparation': return 'Preparación';
      case 'harvested': return 'Cosechada';
      case 'deleted': return 'Eliminada';
      default: return 'Desconocido';
    }
  };

  const handleCreate = (parcelData: Omit<Parcel, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newParcel: Parcel = {
      ...parcelData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setParcels([...parcels, newParcel]);
    setIsCreateModalOpen(false);
  };

  const handleUpdate = (parcelData: Omit<Parcel, 'createdAt' | 'updatedAt'>) => {
    setParcels(parcels.map(parcel => 
      parcel.id === parcelData.id 
        ? { ...parcelData, updatedAt: new Date().toISOString(), createdAt: parcel.createdAt }
        : parcel
    ));
    setIsEditModalOpen(false);
    setSelectedParcel(null);
  };

  const handleDelete = () => {
    if (selectedParcel) {
      setParcels(parcels.filter(parcel => parcel.id !== selectedParcel.id));
      setSelectedParcel(null);
    }
  };

  const handleExport = (format: 'pdf' | 'excel' | 'csv' | 'png') => {
    console.log(`Exportando ${filteredParcels.length} parcelas en formato ${format}`);
    // Aquí implementarías la lógica de exportación real
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Gestión de Parcelas</h2>
          <p className="text-gray-600">Administra todas las parcelas del sistema</p>
        </div>
        
        <div className="flex items-center gap-3">
          <ExportButton 
            onExport={handleExport}
            data={filteredParcels}
            filename="parcelas"
          />
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium"
          >
            <Plus className="w-4 h-4" />
            Nueva Parcela
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Búsqueda */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar por nombre, cultivo o responsable..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filtro por estado */}
          <div className="min-w-[200px]">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">Todos los estados</option>
                <option value="active">Activas</option>
                <option value="preparation">En preparación</option>
                <option value="harvested">Cosechadas</option>
                <option value="deleted">Eliminadas</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Parcela
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cultivo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Área
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Responsable
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fechas
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <AnimatePresence>
                {filteredParcels.map((parcel) => (
                  <motion.tr
                    key={parcel.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <Leaf className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {parcel.name}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            {parcel.location.address}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{parcel.crop}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{parcel.area} ha</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <User className="w-4 h-4 mr-2 text-gray-400" />
                        {parcel.responsible}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(parcel.status)}`}>
                        {getStatusText(parcel.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="space-y-1">
                        {parcel.plantDate && (
                          <div className="flex items-center text-xs text-gray-500">
                            <Calendar className="w-3 h-3 mr-1" />
                            Siembra: {new Date(parcel.plantDate).toLocaleDateString('es-ES')}
                          </div>
                        )}
                        {parcel.harvestDate && (
                          <div className="flex items-center text-xs text-gray-500">
                            <Calendar className="w-3 h-3 mr-1" />
                            Cosecha: {new Date(parcel.harvestDate).toLocaleDateString('es-ES')}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedParcel(parcel);
                            setIsEditModalOpen(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedParcel(parcel);
                            setIsDeleteModalOpen(true);
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {filteredParcels.length === 0 && (
          <div className="text-center py-12">
            <Leaf className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay parcelas</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter !== 'all' 
                ? 'No se encontraron parcelas con los filtros aplicados'
                : 'Comienza creando tu primera parcela'
              }
            </p>
          </div>
        )}
      </div>

      {/* Modales */}
      <ParcelFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreate}
        title="Nueva Parcela"
      />

      <ParcelFormModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedParcel(null);
        }}
        onSubmit={handleUpdate}
        title="Editar Parcela"
        initialData={selectedParcel}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedParcel(null);
        }}
        onConfirm={handleDelete}
        title="Eliminar Parcela"
        message={`¿Estás seguro de que deseas eliminar la parcela "${selectedParcel?.name}"? Esta acción no se puede deshacer.`}
        type="danger"
        confirmText="Eliminar"
        cancelText="Cancelar"
      />
    </div>
  );
};

// Componente del formulario modal
interface ParcelFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  title: string;
  initialData?: Parcel | null;
}

const ParcelFormModal: React.FC<ParcelFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  initialData
}) => {
  const [formData, setFormData] = useState({
    name: '',
    crop: '',
    area: '',
    responsible: '',
    status: 'preparation' as const,
    plantDate: '',
    harvestDate: '',
    notes: '',
    location: {
      latitude: '',
      longitude: '',
      address: ''
    }
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        crop: initialData.crop,
        area: initialData.area.toString(),
        responsible: initialData.responsible,
        status: initialData.status,
        plantDate: initialData.plantDate || '',
        harvestDate: initialData.harvestDate || '',
        notes: initialData.notes || '',
        location: {
          latitude: initialData.location.latitude.toString(),
          longitude: initialData.location.longitude.toString(),
          address: initialData.location.address
        }
      });
    } else {
      setFormData({
        name: '',
        crop: '',
        area: '',
        responsible: '',
        status: 'preparation',
        plantDate: '',
        harvestDate: '',
        notes: '',
        location: {
          latitude: '',
          longitude: '',
          address: ''
        }
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const parcelData = {
      ...(initialData && { id: initialData.id }),
      name: formData.name,
      crop: formData.crop,
      area: parseFloat(formData.area),
      responsible: formData.responsible,
      status: formData.status,
      plantDate: formData.plantDate || undefined,
      harvestDate: formData.harvestDate || undefined,
      notes: formData.notes || undefined,
      location: {
        latitude: parseFloat(formData.location.latitude),
        longitude: parseFloat(formData.location.longitude),
        address: formData.location.address
      }
    };

    onSubmit(parcelData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de la Parcela *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ej: Parcela Norte A1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cultivo *
            </label>
            <select
              required
              value={formData.crop}
              onChange={(e) => setFormData({ ...formData, crop: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Seleccionar cultivo</option>
              <option value="Maíz">Maíz</option>
              <option value="Trigo">Trigo</option>
              <option value="Soja">Soja</option>
              <option value="Girasol">Girasol</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Área (hectáreas) *
            </label>
            <input
              type="number"
              step="0.1"
              required
              value={formData.area}
              onChange={(e) => setFormData({ ...formData, area: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ej: 12.5"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Responsable *
            </label>
            <input
              type="text"
              required
              value={formData.responsible}
              onChange={(e) => setFormData({ ...formData, responsible: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nombre del responsable"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="preparation">En preparación</option>
              <option value="active">Activa</option>
              <option value="harvested">Cosechada</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha de Siembra
            </label>
            <input
              type="date"
              value={formData.plantDate}
              onChange={(e) => setFormData({ ...formData, plantDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha de Cosecha
            </label>
            <input
              type="date"
              value={formData.harvestDate}
              onChange={(e) => setFormData({ ...formData, harvestDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Latitud *
            </label>
            <input
              type="number"
              step="any"
              required
              value={formData.location.latitude}
              onChange={(e) => setFormData({ 
                ...formData, 
                location: { ...formData.location, latitude: e.target.value }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ej: -34.6037"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Longitud *
            </label>
            <input
              type="number"
              step="any"
              required
              value={formData.location.longitude}
              onChange={(e) => setFormData({ 
                ...formData, 
                location: { ...formData.location, longitude: e.target.value }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ej: -58.3816"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dirección *
          </label>
          <input
            type="text"
            required
            value={formData.location.address}
            onChange={(e) => setFormData({ 
              ...formData, 
              location: { ...formData.location, address: e.target.value }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Dirección o ubicación de la parcela"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notas
          </label>
          <textarea
            rows={3}
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Observaciones adicionales..."
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
          >
            {initialData ? 'Actualizar' : 'Crear'} Parcela
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ParcelsCRUD;