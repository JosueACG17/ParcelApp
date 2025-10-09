import React, { useState, useEffect } from 'react';
import { 
  Edit, 
  Trash2, 
  MapPin,
  Calendar,
  User,
  Leaf
} from 'lucide-react';
import ConfirmModal from '../ui/ConfirmModal';
import PageHeader from '../ui/PageHeader';
import { SearchAndFilter } from '../ui/SearchAndFilter';
import { DataTable } from '../ui/DataTable';
import { DynamicFormModal } from '../ui/DynamicFormModal';
import type { TableColumn, TableAction } from '../ui/DataTable';

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

  // Configuración de campos del formulario
  const parcelFormFields = [
    {
      name: 'name',
      label: 'Nombre de la Parcela',
      type: 'text' as const,
      required: true,
      placeholder: 'Ej: Parcela Norte A1'
    },
    {
      name: 'crop',
      label: 'Cultivo',
      type: 'select' as const,
      required: true,
      options: [
        { value: 'Maíz', label: 'Maíz' },
        { value: 'Trigo', label: 'Trigo' },
        { value: 'Soja', label: 'Soja' },
        { value: 'Girasol', label: 'Girasol' },
        { value: 'Otro', label: 'Otro' }
      ]
    },
    {
      name: 'area',
      label: 'Área (hectáreas)',
      type: 'number' as const,
      required: true,
      step: '0.1',
      placeholder: 'Ej: 12.5'
    },
    {
      name: 'responsible',
      label: 'Responsable',
      type: 'text' as const,
      required: true,
      placeholder: 'Nombre del responsable'
    },
    {
      name: 'status',
      label: 'Estado',
      type: 'select' as const,
      required: true,
      options: [
        { value: 'preparation', label: 'En preparación' },
        { value: 'active', label: 'Activa' },
        { value: 'harvested', label: 'Cosechada' },
        { value: 'deleted', label: 'Eliminada' }
      ]
    },
    {
      name: 'plantDate',
      label: 'Fecha de Siembra',
      type: 'date' as const
    },
    {
      name: 'harvestDate',
      label: 'Fecha de Cosecha',
      type: 'date' as const
    },
    {
      name: 'address',
      label: 'Dirección',
      type: 'text' as const,
      required: true,
      placeholder: 'Dirección de la parcela'
    },
    {
      name: 'latitude',
      label: 'Latitud',
      type: 'number' as const,
      step: '0.000001',
      placeholder: 'Ej: -34.6037'
    },
    {
      name: 'longitude',
      label: 'Longitud',
      type: 'number' as const,
      step: '0.000001',
      placeholder: 'Ej: -58.3816'
    },
    {
      name: 'notes',
      label: 'Notas',
      type: 'textarea' as const,
      rows: 3,
      placeholder: 'Observaciones adicionales...'
    }
  ];

  // Configuración de la tabla
  const tableColumns: TableColumn<Parcel>[] = [
    {
      key: 'parcel',
      header: 'Parcela',
      accessor: (parcel) => (
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
      )
    },
    {
      key: 'crop',
      header: 'Cultivo',
      accessor: (parcel) => (
        <div className="text-sm text-gray-900">{parcel.crop}</div>
      )
    },
    {
      key: 'area',
      header: 'Área',
      accessor: (parcel) => (
        <div className="text-sm text-gray-900">{parcel.area} ha</div>
      )
    },
    {
      key: 'responsible',
      header: 'Responsable',
      accessor: (parcel) => (
        <div className="flex items-center text-sm text-gray-900">
          <User className="w-4 h-4 mr-2 text-gray-400" />
          {parcel.responsible}
        </div>
      )
    },
    {
      key: 'status',
      header: 'Estado',
      accessor: (parcel) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(parcel.status)}`}>
          {getStatusText(parcel.status)}
        </span>
      )
    },
    {
      key: 'dates',
      header: 'Fechas',
      accessor: (parcel) => (
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
      )
    }
  ];

  const tableActions: TableAction<Parcel>[] = [
    {
      label: 'Editar',
      icon: Edit,
      onClick: (parcel) => {
        setSelectedParcel(parcel);
        setIsEditModalOpen(true);
      },
      className: 'p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors',
      title: 'Editar'
    },
    {
      label: 'Eliminar',
      icon: Trash2,
      onClick: (parcel) => {
        setSelectedParcel(parcel);
        setIsDeleteModalOpen(true);
      },
      className: 'p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors',
      title: 'Eliminar'
    }
  ];


  return (
    <div className="space-y-6">
      <PageHeader
        title="Gestión de Parcelas"
        description="Administra todas las parcelas del sistema"
        buttonText="Nueva Parcela"
        buttonColor="green"
        onButtonClick={() => setIsCreateModalOpen(true)}
      />

      <SearchAndFilter
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Buscar por nombre, cultivo o responsable..."
        filterValue={statusFilter}
        onFilterChange={setStatusFilter}
        filterOptions={[
          { value: 'all', label: 'Todos los estados' },
          { value: 'active', label: 'Activas' },
          { value: 'preparation', label: 'En preparación' },
          { value: 'harvested', label: 'Cosechadas' },
          { value: 'deleted', label: 'Eliminadas' }
        ]}
      />

      <DataTable
        data={filteredParcels}
        columns={tableColumns}
        actions={tableActions}
        keyExtractor={(parcel) => parcel.id}
        emptyState={{
          icon: Leaf,
          title: 'No hay parcelas',
          description: searchTerm || statusFilter !== 'all' 
            ? 'No se encontraron parcelas con los filtros aplicados'
            : 'Comienza creando tu primera parcela'
        }}
      />

      {/* Modales */}
      <DynamicFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreate}
        title="Nueva Parcela"
        fields={parcelFormFields}
        submitButtonColor="green"
      />

      <DynamicFormModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedParcel(null);
        }}
        onSubmit={handleUpdate}
        title="Editar Parcela"
        fields={parcelFormFields}
        initialData={selectedParcel || undefined}
        submitButtonColor="green"
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



export default ParcelsCRUD;