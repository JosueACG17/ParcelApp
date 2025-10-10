import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Leaf,
  RotateCcw,
} from 'lucide-react';
import Modal from '../ui/Modal';
import ConfirmModal from '../ui/ConfirmModal';
import SuccessModal from '../ui/SuccessModal';
import { useCultivos } from '../../hooks/useParcelasData';
import type { Cultivo } from '../../types/parcelas';

interface CultivoFormData {
  nombre: string;
}

const CultivosCRUD: React.FC = () => {
  const { cultivos, loading, createCultivo, updateCultivo, deleteCultivo, restoreCultivo, refetch } = useCultivos();
  
  // Estados locales
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedCultivo, setSelectedCultivo] = useState<Cultivo | null>(null);
  const [includeDeleted, setIncludeDeleted] = useState(false);

  // Filtros
  const filteredCultivos = (cultivos || []).filter(cultivo => 
    cultivo && cultivo.nombre && cultivo.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Manejadores
  const handleCreate = async (formData: CultivoFormData) => {
    try {
      await createCultivo(formData);
      setShowCreateModal(false);
      setSuccessMessage('Cultivo creado exitosamente');
      setShowSuccessModal(true);
    } catch {
      // Error handling could be added here if needed
    }
  };

  const handleEdit = async (formData: CultivoFormData) => {
    if (!selectedCultivo) return;
    
    try {
      await updateCultivo(selectedCultivo.id, formData);
      setShowEditModal(false);
      setSelectedCultivo(null);
      setSuccessMessage('Cultivo actualizado exitosamente');
      setShowSuccessModal(true);
    } catch {
      // Error handling could be added here if needed
    }
  };

  const handleDelete = async () => {
    if (!selectedCultivo) return;
    
    try {
      await deleteCultivo(selectedCultivo.id);
      setShowDeleteModal(false);
      setSelectedCultivo(null);
      setSuccessMessage('Cultivo eliminado exitosamente');
      setShowSuccessModal(true);
    } catch {
      // Error handling could be added here if needed
    }
  };

  const handleRestore = async (cultivo: Cultivo) => {
    try {
      await restoreCultivo(cultivo.id);
      setSuccessMessage('Cultivo restaurado exitosamente');
      setShowSuccessModal(true);
    } catch {
      // Error handling could be added here if needed
    }
  };

  const handleToggleDeleted = () => {
    const newIncludeDeleted = !includeDeleted;
    setIncludeDeleted(newIncludeDeleted);
    refetch(newIncludeDeleted);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Gestión de Cultivos</h2>
          <p className="text-gray-600">Administra los tipos de cultivos disponibles</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleToggleDeleted}
            className={`px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2 ${
              includeDeleted 
                ? 'bg-gray-500 hover:bg-gray-600 text-white' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            {includeDeleted ? 'Ocultar eliminados' : 'Mostrar eliminados'}
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nuevo Cultivo
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar cultivos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Lista de cultivos */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {filteredCultivos.length === 0 ? (
          <div className="text-center py-12">
            <Leaf className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay cultivos configurados
            </h3>
            <p className="text-gray-500 mb-4">
              Agrega cultivos para poder asignarlos a las parcelas.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Crear primer cultivo
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredCultivos.map((cultivo) => (
              <motion.div
                key={cultivo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-6 hover:bg-gray-50 transition-colors ${
                  cultivo.isDeleted ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <Leaf className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {cultivo.nombre}
                        {cultivo.isDeleted && (
                          <span className="ml-2 text-xs text-red-600 bg-red-100 px-2 py-1 rounded-full">
                            Eliminado
                          </span>
                        )}
                      </h3>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {cultivo.isDeleted ? (
                      <button
                        onClick={() => handleRestore(cultivo)}
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Restaurar"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setSelectedCultivo(cultivo);
                            setShowEditModal(true);
                          }}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedCultivo(cultivo);
                            setShowDeleteModal(true);
                          }}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de crear cultivo */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Crear Nuevo Cultivo"
      >
        <CultivoForm onSubmit={handleCreate} />
      </Modal>

      {/* Modal de editar cultivo */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedCultivo(null);
        }}
        title="Editar Cultivo"
      >
        <CultivoForm
          initialData={selectedCultivo ? { nombre: selectedCultivo.nombre } : undefined}
          onSubmit={handleEdit}
        />
      </Modal>

      {/* Modal de confirmación de eliminación */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onConfirm={handleDelete}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedCultivo(null);
        }}
        title="Eliminar Cultivo"
        message={`¿Estás seguro de que deseas eliminar el cultivo "${selectedCultivo?.nombre}"? Esta acción no se puede deshacer.`}
      />

      {/* Modal de éxito */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="¡Éxito!"
        message={successMessage}
      />
    </div>
  );
};

// Componente del formulario de cultivo
interface CultivoFormProps {
  initialData?: CultivoFormData;
  onSubmit: (data: CultivoFormData) => void;
}

const CultivoForm: React.FC<CultivoFormProps> = ({ initialData, onSubmit }) => {
  const [formData, setFormData] = useState<CultivoFormData>(
    initialData || { nombre: '' }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nombre del Cultivo
        </label>
        <input
          type="text"
          value={formData.nombre}
          onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="Ej: Maíz, Soja, Trigo..."
          required
          maxLength={50}
        />
        <p className="text-xs text-gray-500 mt-1">
          Máximo 50 caracteres
        </p>
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

export default CultivosCRUD;