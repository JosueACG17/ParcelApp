// SensorsCRUD.tsx - Beautiful version with proper modals and animations
import React, { useState } from 'react';
import { Edit, Trash2, Plus, Search, AlertTriangle, X, CheckCircle, Thermometer, Droplets, Sun, CloudRain } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSensores } from '../../hooks/useSensoresData';
import { useParcelas } from '../../hooks/useParcelasData';
import type { Sensor } from '../../types/parcelas';

interface SensorFormData {
  nombre: string;
  tipo: 'temperatura' | 'humedad' | 'radiacion_solar' | 'lluvia';
  id_parcela_sql: string;
}

const SensorsCRUD: React.FC = () => {
  const { 
    sensores, 
    loading, 
    error, 
    updateSensor, 
    deleteSensor 
  } = useSensores();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSensor, setSelectedSensor] = useState<Sensor | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState<{
    title: string;
    message: string;
  } | null>(null);

  // Filtros
  const filteredSensores = sensores.filter(sensor => 
    (sensor.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
     sensor.cultivo.toLowerCase().includes(searchTerm.toLowerCase()) ||
     sensor.tipo.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (typeFilter === 'all' || sensor.tipo === typeFilter)
  );

  // Manejadores de eventos
  const handleCreate = async (formData: SensorFormData) => {
    console.log('🚀 Datos del formulario que se van a enviar:', formData);
    
    const sensorPayload = {
      _id: `${formData.tipo.toUpperCase()}_${formData.nombre.replace(/\s+/g, '_').toUpperCase()}_${Date.now()}`,
      nombre: formData.nombre,
      tipo: formData.tipo,
      id_parcela_sql: formData.id_parcela_sql
    };
    
    console.log('📊 JSON que se enviará al servidor:', JSON.stringify(sensorPayload, null, 2));
    
    try {
      const response = await fetch('http://localhost:5172/sensores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sensorPayload)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('✅ Respuesta del servidor:', result);
      setShowCreateModal(false);
      setSuccessMessage({
        title: '¡Sensor Creado!',
        message: `El sensor "${formData.nombre}" se ha creado exitosamente.`
      });
      setShowSuccessModal(true);
      setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      console.error('❌ Error al crear sensor:', error);
    }
  };

  const handleEdit = async (formData: SensorFormData) => {
    if (!selectedSensor) return;
    
    console.log('✏️ Editando sensor ID:', selectedSensor._id);
    console.log('🚀 Datos del formulario para editar:', formData);
    
    try {
      const result = await updateSensor(selectedSensor._id, formData);
      console.log('✅ Respuesta del servidor al editar:', result);
      setShowEditModal(false);
      setSelectedSensor(null);
      setSuccessMessage({
        title: '¡Sensor Actualizado!',
        message: `El sensor "${formData.nombre}" se ha actualizado exitosamente.`
      });
      setShowSuccessModal(true);
    } catch (error) {
      console.error('❌ Error al editar sensor:', error);
    }
  };

  const handleDelete = async () => {
    if (!selectedSensor) return;
    
    try {
      await deleteSensor(selectedSensor._id);
      setShowDeleteModal(false);
      setSuccessMessage({
        title: '¡Sensor Eliminado!',
        message: `El sensor "${selectedSensor.nombre}" se ha eliminado exitosamente.`
      });
      setSelectedSensor(null);
      setShowSuccessModal(true);
    } catch {
      // Error handling could be added here if needed
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
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
          <span className="text-red-700">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Sensores</h2>
          <p className="text-gray-600">Administra los sensores del sistema de monitoreo</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Nuevo Sensor</span>
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Buscar por nombre, tipo o cultivo..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
            >
              <option value="all">Todos los tipos</option>
              <option value="temperatura">Temperatura</option>
              <option value="humedad">Humedad</option>
              <option value="radiacion_solar">Radiación Solar</option>
              <option value="lluvia">Lluvia</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de sensores */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {filteredSensores.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay sensores</h3>
            <p className="text-gray-600">
              {searchTerm || typeFilter !== 'all' 
                ? 'No se encontraron sensores con los filtros aplicados.' 
                : 'Comienza creando tu primer sensor.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sensor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSensores.map((sensor) => (
                  <motion.tr 
                    key={sensor._id} 
                    className="hover:bg-gray-50 transition-colors"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                            sensor.tipo === 'temperatura' ? 'bg-red-100' :
                            sensor.tipo === 'humedad' ? 'bg-blue-100' :
                            sensor.tipo === 'radiacion_solar' ? 'bg-yellow-100' : 'bg-green-100'
                          }`}>
                            {sensor.tipo === 'temperatura' ? (
                              <Thermometer className="w-5 h-5 text-red-600" />
                            ) : sensor.tipo === 'humedad' ? (
                              <Droplets className="w-5 h-5 text-blue-600" />
                            ) : sensor.tipo === 'radiacion_solar' ? (
                              <Sun className="w-5 h-5 text-yellow-600" />
                            ) : (
                              <CloudRain className="w-5 h-5 text-green-600" />
                            )}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {sensor.nombre}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        sensor.tipo === 'temperatura' ? 'bg-red-100 text-red-800' :
                        sensor.tipo === 'humedad' ? 'bg-blue-100 text-blue-800' :
                        sensor.tipo === 'radiacion_solar' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {sensor.tipo.replace('_', ' ').replace(/^\w/, c => c.toUpperCase())}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => {
                            setSelectedSensor(sensor);
                            setShowEditModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                          title="Editar sensor"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedSensor(sensor);
                            setShowDeleteModal(true);
                          }}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                          title="Eliminar sensor"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modales */}
      <AnimatePresence>
        {/* Modal Crear Sensor */}
        {showCreateModal && (
          <Modal
            title="Crear Nuevo Sensor"
            onClose={() => setShowCreateModal(false)}
          >
            <SensorForm 
              onSubmit={handleCreate} 
              onCancel={() => setShowCreateModal(false)} 
            />
          </Modal>
        )}

        {/* Modal Editar Sensor */}
        {showEditModal && selectedSensor && (
          <Modal
            title="Editar Sensor"
            onClose={() => {
              setShowEditModal(false);
              setSelectedSensor(null);
            }}
          >
            <SensorForm
              initialData={{
                nombre: selectedSensor.nombre,
                tipo: selectedSensor.tipo,
                id_parcela_sql: selectedSensor.id_parcela_sql
              }}
              onSubmit={handleEdit}
              onCancel={() => {
                setShowEditModal(false);
                setSelectedSensor(null);
              }}
            />
          </Modal>
        )}

        {/* Modal Eliminar Sensor */}
        {showDeleteModal && selectedSensor && (
          <ConfirmModal
            title="Eliminar Sensor"
            message={`¿Estás seguro de que deseas eliminar el sensor "${selectedSensor.nombre}"? Esta acción no se puede deshacer.`}
            onConfirm={handleDelete}
            onCancel={() => {
              setShowDeleteModal(false);
              setSelectedSensor(null);
            }}
          />
        )}

        {/* Modal de Éxito */}
        {showSuccessModal && successMessage && (
          <SuccessModal
            title={successMessage.title}
            message={successMessage.message}
            onClose={() => setShowSuccessModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Componente Modal
interface ModalProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ title, children, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", duration: 0.3 }}
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
};

// Componente Modal de Confirmación
interface ConfirmModalProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ title, message, onConfirm, onCancel }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", duration: 0.3 }}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            </div>
          </div>
          
          <p className="text-gray-600 mb-6">{message}</p>
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Eliminar
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Componente Modal de Éxito
interface SuccessModalProps {
  title: string;
  message: string;
  onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ title, message, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", duration: 0.3 }}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 mb-6">{message}</p>
          
          <button
            onClick={onClose}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            ¡Perfecto!
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Componente del formulario de sensor
interface SensorFormProps {
  initialData?: SensorFormData;
  onSubmit: (data: SensorFormData) => void;
  onCancel: () => void;
}

const SensorForm: React.FC<SensorFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const { parcelas } = useParcelas();
  const [formData, setFormData] = useState<SensorFormData>(
    initialData || {
      nombre: '',
      tipo: 'temperatura',
      id_parcela_sql: ''
    }
  );

  const parcelasActivas = parcelas.filter(p => !p.isDeleted);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('📝 Formulario enviado con datos:', formData);
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nombre del Sensor
        </label>
        <input
          type="text"
          value={formData.nombre}
          onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
          placeholder="Ej: Sensor Temperatura Campo Norte"
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
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors bg-white"
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
          Parcela
        </label>
        <select
          value={formData.id_parcela_sql}
          onChange={(e) => {
            setFormData(prev => ({ 
              ...prev, 
              id_parcela_sql: e.target.value
            }));
          }}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors bg-white"
          required
        >
          <option value="">Selecciona una parcela</option>
          {parcelasActivas.map((parcela) => (
            <option key={parcela.id} value={parcela.id}>
              🌾 {parcela.nombre} - {parcela.nombresCultivos.join(', ')} ({parcela.cantidadCultivos} cultivos)
            </option>
          ))}
        </select>
        {parcelasActivas.length === 0 && (
          <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-700 flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2" />
              No hay parcelas disponibles. Crea una parcela primero.
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Guardar Sensor
        </button>
      </div>
    </form>
  );
};

export default SensorsCRUD;