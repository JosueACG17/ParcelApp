import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Thermometer,
  Droplets,
  Sun,
  CloudRain,
  Activity
} from 'lucide-react';
import Modal from '../ui/Modal';
import ConfirmModal from '../ui/ConfirmModal';
import { useSensores } from '../../hooks/useSensoresData';
import type { Sensor } from '../../types/parcelas';

interface SensorFormData {
  nombre: string;
  tipo: 'temperatura' | 'humedad' | 'radiacion_solar' | 'lluvia';
  ubicacion: string;
  estado: 'activo' | 'inactivo' | 'mantenimiento';
}

const SensorsCRUD: React.FC = () => {
  const { 
    sensores, 
    loading, 
    error, 
    createSensor, 
    updateSensor, 
    deleteSensor 
  } = useSensores();
  
  // Estados locales
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSensor, setSelectedSensor] = useState<Sensor | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>('all');

  // Filtros
  const filteredSensores = sensores.filter(sensor => 
    (sensor.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
     sensor.ubicacion.toLowerCase().includes(searchTerm.toLowerCase()) ||
     sensor.tipo.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (typeFilter === 'all' || sensor.tipo === typeFilter)
  );

  // Obtener icono por tipo
  const getSensorIcon = (tipo: string) => {
    switch (tipo.toLowerCase()) {
      case 'temperatura':
        return Thermometer;
      case 'humedad':
        return Droplets;
      case 'radiacion_solar':
        return Sun;
      case 'lluvia':
        return CloudRain;
      default:
        return Activity;
    }
  };

  // Obtener color por estado
  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'activo':
        return 'bg-green-100 text-green-800';
      case 'inactivo':
        return 'bg-red-100 text-red-800';
      case 'mantenimiento':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Manejadores
  const handleCreate = async (formData: SensorFormData) => {
    try {
      await createSensor(formData);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error al crear sensor:', error);
    }
  };

  const handleEdit = async (formData: SensorFormData) => {
    if (!selectedSensor) return;
    
    try {
      await updateSensor(selectedSensor._id, formData);
      setShowEditModal(false);
      setSelectedSensor(null);
    } catch (error) {
      console.error('Error al actualizar sensor:', error);
    }
  };

  const handleDelete = async () => {
    if (!selectedSensor) return;
    
    try {
      await deleteSensor(selectedSensor._id);
      setShowDeleteModal(false);
      setSelectedSensor(null);
    } catch (error) {
      console.error('Error al eliminar sensor:', error);
    }
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
        <div className="text-red-600 mb-2">Error al cargar sensores</div>
        <div className="text-sm text-gray-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Gestión de Sensores</h2>
          <p className="text-gray-600">Administra la red de sensores IoT</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nuevo Sensor
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar sensores..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">Todos los tipos</option>
            <option value="temperatura">Temperatura</option>
            <option value="humedad">Humedad</option>
            <option value="radiacion_solar">Radiación Solar</option>
            <option value="lluvia">Lluvia</option>
          </select>
        </div>
      </div>

      {/* Lista de sensores */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {filteredSensores.length === 0 ? (
          <div className="text-center py-12">
            <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay sensores configurados
            </h3>
            <p className="text-gray-500 mb-4">
              Agrega sensores para comenzar a monitorear tu sistema.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Crear primer sensor
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {filteredSensores.map((sensor) => {
              const IconComponent = getSensorIcon(sensor.tipo);
              
              return (
                <motion.div
                  key={sensor._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-all"
                >
                  {/* Header del sensor */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{sensor.nombre}</h3>
                        <p className="text-sm text-gray-500">{sensor.ubicacion}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedSensor(sensor);
                          setShowEditModal(true);
                        }}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedSensor(sensor);
                          setShowDeleteModal(true);
                        }}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Información del sensor */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Tipo:</span>
                      <span className="text-sm font-medium text-gray-900 capitalize">
                        {sensor.tipo.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Estado:</span>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(sensor.estado)}`}>
                        {sensor.estado}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal de crear sensor */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Crear Nuevo Sensor"
      >
        <SensorForm onSubmit={handleCreate} />
      </Modal>

      {/* Modal de editar sensor */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedSensor(null);
        }}
        title="Editar Sensor"
      >
        <SensorForm
          initialData={selectedSensor ? {
            nombre: selectedSensor.nombre,
            tipo: selectedSensor.tipo,
            ubicacion: selectedSensor.ubicacion,
            estado: selectedSensor.estado
          } : undefined}
          onSubmit={handleEdit}
        />
      </Modal>

      {/* Modal de confirmación de eliminación */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onConfirm={handleDelete}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedSensor(null);
        }}
        title="Eliminar Sensor"
        message={`¿Estás seguro de que deseas eliminar el sensor "${selectedSensor?.nombre}"? Esta acción no se puede deshacer.`}
      />
    </div>
  );
};

// Componente del formulario de sensor
interface SensorFormProps {
  initialData?: SensorFormData;
  onSubmit: (data: SensorFormData) => void;
}

const SensorForm: React.FC<SensorFormProps> = ({ initialData, onSubmit }) => {
  const [formData, setFormData] = useState<SensorFormData>(
    initialData || {
      nombre: '',
      tipo: 'temperatura',
      ubicacion: '',
      estado: 'activo'
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nombre del Sensor
        </label>
        <input
          type="text"
          value={formData.nombre}
          onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="Ej: Sensor Temperatura 1"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tipo de Sensor
        </label>
        <select
          value={formData.tipo}
          onChange={(e) => setFormData(prev => ({ ...prev, tipo: e.target.value as SensorFormData['tipo'] }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          required
        >
          <option value="temperatura">Temperatura</option>
          <option value="humedad">Humedad</option>
          <option value="radiacion_solar">Radiación Solar</option>
          <option value="lluvia">Lluvia</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Ubicación
        </label>
        <input
          type="text"
          value={formData.ubicacion}
          onChange={(e) => setFormData(prev => ({ ...prev, ubicacion: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="Ej: Parcela Norte, Sector A"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Estado
        </label>
        <select
          value={formData.estado}
          onChange={(e) => setFormData(prev => ({ ...prev, estado: e.target.value as SensorFormData['estado'] }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          required
        >
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
          <option value="mantenimiento">Mantenimiento</option>
        </select>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
        >
          Guardar
        </button>
      </div>
    </form>
  );
};

export default SensorsCRUD;