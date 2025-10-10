import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  User as UserIcon,
  Mail,
  Phone,
  Shield,
  RotateCcw,
  UserPlus
} from 'lucide-react';
import Modal from '../ui/Modal';
import ConfirmModal from '../ui/ConfirmModal';
import { useUsers } from '../../hooks/useUsersData';
import { useRoles } from '../../hooks/useSystemData';
import { authService } from '../../services/authService';
import type { User } from '../../types/auth';

interface UserFormData {
  nombre: string;
  correo: string;
  password?: string;
  telefono: string;
  role: string;
}

const UsuariosCRUD: React.FC = () => {
  const { users, loading, error, updateUser, deleteUser, restoreUser } = useUsers();
  const { roles } = useRoles();
  
  // Estados locales
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Filtros
  const filteredUsers = users.filter(user => {
    const matchesSearch = searchTerm === '' || 
      user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.role || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesStatus = true;
    if (statusFilter === 'active') {
      matchesStatus = !user.isDeleted;
    } else if (statusFilter === 'inactive') {
      matchesStatus = user.isDeleted;
    }
    
    return matchesSearch && matchesStatus;
  });

  // Manejadores
  const handleCreate = async (formData: UserFormData) => {
    try {
      // Crear usuario usando el servicio de registro
      await authService.register({
        nombre: formData.nombre,
        correo: formData.correo,
        password: formData.password || 'DefaultPassword123!',
        telefono: formData.telefono
      });
      
      setShowCreateModal(false);
      // Refrescar la lista después de crear
      window.location.reload(); // Temporal hasta tener mejor refresh
    } catch (error) {
      console.error('Error al crear usuario:', error);
      alert('Error al crear usuario. Verifique que el correo no esté ya registrado.');
    }
  };

  const handleEdit = async (formData: UserFormData) => {
    if (!selectedUser) return;
    
    try {
      await updateUser(selectedUser.id, {
        nombre: formData.nombre,
        correo: formData.correo,
        telefono: formData.telefono
      });
      setShowEditModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    
    try {
      await deleteUser(selectedUser.id);
      setShowDeleteModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
    }
  };

  const handleRestore = async (user: User) => {
    try {
      await restoreUser(user.id);
    } catch (error) {
      console.error('Error al restaurar usuario:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Activo';
      case 'inactive': return 'Inactivo';
      default: return 'Desconocido';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'user': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleText = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin': return 'Administrador';
      case 'user': return 'Usuario';
      default: return 'Sin rol';
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
        <div className="text-red-600 mb-2">Error al cargar usuarios</div>
        <div className="text-sm text-gray-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Gestión de Usuarios</h2>
          <p className="text-gray-600">Administra los usuarios del sistema</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          Nuevo Usuario
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
                placeholder="Buscar usuarios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">Todos los estados</option>
            <option value="active">Activos</option>
            <option value="inactive">Inactivos</option>
          </select>
        </div>
      </div>

      {/* Lista de usuarios */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <UserIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay usuarios configurados
            </h3>
            <p className="text-gray-500 mb-4">
              Crea el primer usuario para empezar.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Crear primer usuario
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-6 hover:bg-gray-50 transition-colors ${
                  user.isDeleted ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <UserIcon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-gray-900">
                          {user.nombre}
                          {user.isDeleted && (
                            <span className="ml-2 text-xs text-red-600 bg-red-100 px-2 py-1 rounded-full">
                              Eliminado
                            </span>
                          )}
                        </h3>
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role || 'User')}`}>
                          <Shield className="w-3 h-3 mr-1" />
                          {getRoleText(user.role || 'User')}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {user.correo}
                        </div>
                        {user.telefono && (
                          <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {user.telefono}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.isDeleted ? 'inactive' : 'active')}`}>
                      {getStatusText(user.isDeleted ? 'inactive' : 'active')}
                    </span>
                    
                    <div className="flex items-center gap-2">
                      {user.isDeleted ? (
                        <button
                          onClick={() => handleRestore(user)}
                          className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Restaurar"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setShowEditModal(true);
                            }}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedUser(user);
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
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de crear usuario */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Crear Nuevo Usuario"
      >
        <UserForm onSubmit={handleCreate} roles={roles} isCreate />
      </Modal>

      {/* Modal de editar usuario */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedUser(null);
        }}
        title="Editar Usuario"
      >
        <UserForm
          initialData={selectedUser ? {
            nombre: selectedUser.nombre,
            correo: selectedUser.correo,
            telefono: selectedUser.telefono,
            role: selectedUser.role || 'User'
          } : undefined}
          onSubmit={handleEdit}
          roles={roles}
        />
      </Modal>

      {/* Modal de confirmación de eliminación */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onConfirm={handleDelete}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedUser(null);
        }}
        title="Eliminar Usuario"
        message={`¿Estás seguro de que deseas eliminar al usuario "${selectedUser?.nombre}"? Esta acción no se puede deshacer.`}
      />
    </div>
  );
};

// Componente del formulario de usuario
interface UserFormProps {
  initialData?: UserFormData;
  onSubmit: (data: UserFormData) => void;
  roles: Array<{ id: number; nombre: string; descripcion?: string }>;
  isCreate?: boolean;
}

const UserForm: React.FC<UserFormProps> = ({ initialData, onSubmit, roles, isCreate = false }) => {
  const [formData, setFormData] = useState<UserFormData>(
    initialData || {
      nombre: '',
      correo: '',
      password: '',
      telefono: '',
      role: 'User'
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
          Nombre Completo
        </label>
        <input
          type="text"
          value={formData.nombre}
          onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="Ej: Juan Pérez"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Correo Electrónico
        </label>
        <input
          type="email"
          value={formData.correo}
          onChange={(e) => setFormData(prev => ({ ...prev, correo: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="correo@ejemplo.com"
          required
          disabled={!isCreate} // No permitir cambiar correo en edición
        />
      </div>

      {isCreate && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contraseña
          </label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Mínimo 6 caracteres"
            minLength={6}
            required
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Teléfono
        </label>
        <input
          type="tel"
          value={formData.telefono}
          onChange={(e) => setFormData(prev => ({ ...prev, telefono: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="+57 300 123 4567"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rol
        </label>
        <select
          value={formData.role}
          onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          required
        >
          {roles.map(role => (
            <option key={role.id} value={role.nombre}>
              {role.nombre} {role.descripcion && `- ${role.descripcion}`}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
        >
          {isCreate ? 'Crear Usuario' : 'Actualizar Usuario'}
        </button>
      </div>
    </form>
  );
};

export default UsuariosCRUD;