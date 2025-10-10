import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  MapPin,
  Leaf,
  RotateCcw,
  AlertTriangle
} from 'lucide-react';
import Modal from '../ui/Modal';
import ConfirmModal from '../ui/ConfirmModal';
import { useParcelas, useCultivos } from '../../hooks/useParcelasData';
import type { Parcela } from '../../types/parcelas';

interface ParcelFormData {
  nombre: string;
  latitud: number;
  longitud: number;
  cultivosIds: number[];
}

const ParcelsCRUD: React.FC = () => {
  const { parcelas, loading, error, createParcela, updateParcela, deleteParcela, restoreParcela, refetch } = useParcelas();
  const { cultivos, loading: cultivosLoading } = useCultivos();
  
  // Estados locales
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedParcela, setSelectedParcela] = useState<Parcela | null>(null);
  const [includeDeleted, setIncludeDeleted] = useState(false);

  // Filtros
  const filteredParcelas = parcelas.filter(parcela => 
    parcela.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    parcela.nombresCultivos.some(cultivo => 
      cultivo.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Manejadores
  const handleCreate = async (formData: ParcelFormData) => {
    try {
      await createParcela(formData);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error al crear parcela:', error);
    }
  };

  const handleEdit = async (formData: ParcelFormData) => {
    if (!selectedParcela) return;
    
    try {
      await updateParcela(selectedParcela.id, formData);
      setShowEditModal(false);
      setSelectedParcela(null);
    } catch (error) {
      console.error('Error al actualizar parcela:', error);
    }
  };

  const handleDelete = async () => {
    if (!selectedParcela) return;
    
    try {
      await deleteParcela(selectedParcela.id);
      setShowDeleteModal(false);
      setSelectedParcela(null);
    } catch (error) {
      console.error('Error al eliminar parcela:', error);
    }
  };

  const handleRestore = async (parcela: Parcela) => {
    try {
      await restoreParcela(parcela.id);
    } catch (error)  {
      console.error('Error al restaurar parcela:', error);
    }
  };

  const handleToggleDeleted = () => {
    setIncludeDeleted(!includeDeleted);
    refetch(!includeDeleted);
  };

  if (loading || cultivosLoading) {
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
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Parcelas</h2>
          <p className="text-gray-600">Administra las parcelas de tu campo</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Nueva Parcela</span>
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
              placeholder="Buscar por nombre o cultivo..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            onClick={handleToggleDeleted}
            className={`px-3 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
              includeDeleted 
                ? 'bg-gray-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span>{includeDeleted ? 'Ocultar eliminadas' : 'Mostrar eliminadas'}</span>
          </button>
        </div>
      </div>

      {/* Lista de parcelas */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {filteredParcelas.length === 0 ? (
          <div className="p-8 text-center">
            <Leaf className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay parcelas</h3>
            <p className="text-gray-600">
              {searchTerm ? 'No se encontraron parcelas con los filtros aplicados.' : 'Comienza creando tu primera parcela.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Parcela
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cultivos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Coordenadas
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredParcelas.map((parcela) => (
                  <motion.tr
                    key={parcela.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{parcela.nombre}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {parcela.latitud.toFixed(4)}, {parcela.longitud.toFixed(4)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Leaf className="h-4 w-4 text-green-500 mr-2" />
                        <div>
                          <span className="text-sm text-gray-900">
                            {parcela.nombresCultivos.join(', ') || 'Sin cultivos'}
                          </span>
                          <div className="text-xs text-gray-500">
                            {parcela.cantidadCultivos} cultivo{parcela.cantidadCultivos !== 1 ? 's' : ''}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        !parcela.isDeleted 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {parcela.isDeleted ? 'Eliminada' : 'Activa'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>{parcela.latitud.toFixed(4)}, {parcela.longitud.toFixed(4)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        {parcela.isDeleted ? (
                          <button
                            onClick={() => handleRestore(parcela)}
                            className="text-green-600 hover:text-green-900 p-1 rounded transition-colors"
                            title="Restaurar"
                          >
                            <RotateCcw className="h-4 w-4" />
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => {
                                setSelectedParcela(parcela);
                                setShowEditModal(true);
                              }}
                              className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors"
                              title="Editar"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedParcela(parcela);
                                setShowDeleteModal(true);
                              }}
                              className="text-red-600 hover:text-red-900 p-1 rounded transition-colors"
                              title="Eliminar"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de creación */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Crear Nueva Parcela"
      >
        <ParcelForm
          onSubmit={handleCreate}
          onCancel={() => setShowCreateModal(false)}
          cultivos={cultivos}
        />
      </Modal>

      {/* Modal de edición */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedParcela(null);
        }}
        title="Editar Parcela"
      >
        {selectedParcela && (
          <ParcelForm
            initialData={{
              nombre: selectedParcela.nombre,
              latitud: selectedParcela.latitud,
              longitud: selectedParcela.longitud,
              cultivosIds: [] // Esto necesitaría mapeo desde nombresCultivos a IDs
            }}
            onSubmit={handleEdit}
            onCancel={() => {
              setShowEditModal(false);
              setSelectedParcela(null);
            }}
            cultivos={cultivos}
            isEditing
          />
        )}
      </Modal>

      {/* Modal de confirmación de eliminación */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedParcela(null);
        }}
        onConfirm={handleDelete}
        title="Eliminar Parcela"
        message={`¿Estás seguro que deseas eliminar la parcela "${selectedParcela?.nombre}"? Esta acción se puede deshacer.`}
        confirmText="Eliminar"
      />
    </div>
  );
};

// Componente del formulario
interface ParcelFormProps {
  initialData?: ParcelFormData;
  onSubmit: (data: ParcelFormData) => void;
  onCancel: () => void;
  cultivos: Array<{id: number; nombre: string}>;
  isEditing?: boolean;
}

const ParcelForm: React.FC<ParcelFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  cultivos,
  isEditing = false
}) => {
  const [formData, setFormData] = useState<ParcelFormData>(
    initialData || {
      nombre: '',
      latitud: 0,
      longitud: 0,
      cultivosIds: []
    }
  );

  const [selectedCultivos, setSelectedCultivos] = useState<number[]>(
    initialData?.cultivosIds || []
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      cultivosIds: selectedCultivos
    });
  };

  const handleCultivoToggle = (cultivoId: number) => {
    setSelectedCultivos(prev => 
      prev.includes(cultivoId)
        ? prev.filter(id => id !== cultivoId)
        : [...prev, cultivoId]
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nombre de la Parcela *
        </label>
        <input
          type="text"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          value={formData.nombre}
          onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
          placeholder="Ej: Parcela Norte A1"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Latitud *
          </label>
          <input
            type="number"
            step="any"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            value={formData.latitud}
            onChange={(e) => setFormData({ ...formData, latitud: parseFloat(e.target.value) || 0 })}
            placeholder="-12.0464"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Longitud *
          </label>
          <input
            type="number"
            step="any"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            value={formData.longitud}
            onChange={(e) => setFormData({ ...formData, longitud: parseFloat(e.target.value) || 0 })}
            placeholder="-77.0428"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Cultivos *
        </label>
        <div className="border border-gray-300 rounded-lg p-3 max-h-40 overflow-y-auto">
          {cultivos.length === 0 ? (
            <p className="text-gray-500 text-sm">No hay cultivos disponibles</p>
          ) : (
            cultivos.map((cultivo) => (
              <label key={cultivo.id} className="flex items-center space-x-2 py-1">
                <input
                  type="checkbox"
                  checked={selectedCultivos.includes(cultivo.id)}
                  onChange={() => handleCultivoToggle(cultivo.id)}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">{cultivo.nombre}</span>
              </label>
            ))
          )}
        </div>
        {selectedCultivos.length === 0 && (
          <p className="text-red-500 text-xs mt-1">Selecciona al menos un cultivo</p>
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
          disabled={selectedCultivos.length === 0}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isEditing ? 'Actualizar' : 'Crear'} Parcela
        </button>
      </div>
    </form>
  );
};

export default ParcelsCRUD;