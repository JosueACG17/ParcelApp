import React, { useState, useEffect } from 'react';
import { 
  Edit, 
  Trash2, 
  User as UserIcon,
  Mail,
  Phone,
  Shield,
  Calendar
} from 'lucide-react';
import ConfirmModal from '../ui/ConfirmModal';
import PageHeader from '../ui/PageHeader';
import { SearchAndFilter } from '../ui/SearchAndFilter';
import { DataTable } from '../ui/DataTable';
import { DynamicFormModal } from '../ui/DynamicFormModal';
import type { TableColumn, TableAction } from '../ui/DataTable';
import type {User} from '../../types/auth';

const UsersCRUD: React.FC = () => {
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'Juan Pérez',
      email: 'juan@parcelas.com',
      phone: '+57 300 123 4567',
      role: 'admin',
      status: 'active',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-03-15T14:30:00Z'
    },
    {
      id: '2',
      name: 'María García',
      email: 'maria@parcelas.com',
      phone: '+57 300 987 6543',
      role: 'manager', 
      status: 'active',
      createdAt: '2024-02-01T09:00:00Z',
      updatedAt: '2024-02-01T09:00:00Z'
    },
    {
      id: '3',
      name: 'Carlos López',
      email: 'carlos@parcelas.com',
      phone: '+57 301 555 7890',
      role: 'worker',
      status: 'pending',
      createdAt: '2024-03-10T16:00:00Z',
      updatedAt: '2024-03-10T16:00:00Z'
    }
  ]);

  const [filteredUsers, setFilteredUsers] = useState<User[]>(users);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Filtros
  useEffect(() => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.status === statusFilter);
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, statusFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Activo';
      case 'inactive': return 'Inactivo';
      case 'pending': return 'Pendiente';
      default: return 'Desconocido';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'manager': return 'bg-blue-100 text-blue-800';
      case 'worker': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'manager': return 'Gerente';
      case 'worker': return 'Trabajador';
      default: return 'Sin rol';
    }
  };

  const handleCreate = (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setUsers([...users, newUser]);
    setIsCreateModalOpen(false);
  };

  const handleUpdate = (userData: Omit<User, 'createdAt' | 'updatedAt'>) => {
    setUsers(users.map(user => 
      user.id === userData.id 
        ? { ...userData, updatedAt: new Date().toISOString(), createdAt: user.createdAt }
        : user
    ));
    setIsEditModalOpen(false);
    setSelectedUser(null);
  };

  const handleDelete = () => {
    if (selectedUser) {
      setUsers(users.filter(user => user.id !== selectedUser.id));
      setSelectedUser(null);
    }
  };

  // Configuración de campos del formulario
  const userFormFields = [
    {
      name: 'name',
      label: 'Nombre Completo',
      type: 'text' as const,
      required: true,
      placeholder: 'Ej: Juan Pérez'
    },
    {
      name: 'email',
      label: 'Correo Electrónico',
      type: 'email' as const,
      required: true,
      placeholder: 'correo@ejemplo.com'
    },
    {
      name: 'phone',
      label: 'Teléfono',
      type: 'text' as const,
      placeholder: '+57 300 123 4567'
    },
    {
      name: 'password',
      label: 'Contraseña',
      type: 'password' as const,
      required: !selectedUser, // Solo requerida para nuevos usuarios
      placeholder: selectedUser ? 'Dejar vacío para mantener actual' : 'Mínimo 6 caracteres'
    },
    {
      name: 'role',
      label: 'Rol',
      type: 'select' as const,
      required: true,
      options: [
        { value: 'worker', label: 'Trabajador' },
        { value: 'manager', label: 'Gerente' },
        { value: 'admin', label: 'Administrador' }
      ]
    },
    {
      name: 'status',
      label: 'Estado',
      type: 'select' as const,
      required: true,
      options: [
        { value: 'pending', label: 'Pendiente' },
        { value: 'active', label: 'Activo' },
        { value: 'inactive', label: 'Inactivo' }
      ]
    }
  ];

  // Configuración de la tabla
  const tableColumns: TableColumn<User>[] = [
    {
      key: 'user',
      header: 'Usuario',
      accessor: (user) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <UserIcon className="h-5 w-5 text-blue-600" />
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {user.name}
            </div>
            <div className="text-sm text-gray-500">
              ID: {user.id}
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'contact',
      header: 'Contacto',
      accessor: (user) => (
        <div className="space-y-1">
          <div className="flex items-center text-sm text-gray-900">
            <Mail className="w-4 h-4 mr-2 text-gray-400" />
            {user.email}
          </div>
          {user.phone && (
            <div className="flex items-center text-sm text-gray-500">
              <Phone className="w-4 h-4 mr-2 text-gray-400" />
              {user.phone}
            </div>
          )}
        </div>
      )
    },
    {
      key: 'role',
      header: 'Rol',
      accessor: (user) => (
        <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
          <Shield className="w-3 h-3 mr-1" />
          {getRoleText(user.role)}
        </span>
      )
    },
    {
      key: 'status',
      header: 'Estado',
      accessor: (user) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status || 'pending')}`}>
          {getStatusText(user.status || 'pending')}
        </span>
      )
    },
    {
      key: 'date',
      header: 'Fecha de Registro',
      accessor: (user) => (
        <div className="flex items-center text-xs text-gray-500">
          <Calendar className="w-3 h-3 mr-1" />
          {new Date(user.createdAt).toLocaleDateString('es-ES')}
        </div>
      )
    }
  ];

  const tableActions: TableAction<User>[] = [
    {
      label: 'Editar',
      icon: Edit,
      onClick: (user) => {
        setSelectedUser(user);
        setIsEditModalOpen(true);
      },
      className: 'p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors',
      title: 'Editar'
    },
    {
      label: 'Eliminar',
      icon: Trash2,
      onClick: (user) => {
        setSelectedUser(user);
        setIsDeleteModalOpen(true);
      },
      className: 'p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors',
      title: 'Eliminar'
    }
  ];


  return (
    <div className="space-y-6">
      <PageHeader
        title="Gestión de Usuarios"
        description="Administra todos los usuarios del sistema"
        buttonText="Nuevo Usuario"
        buttonColor="blue"
        onButtonClick={() => setIsCreateModalOpen(true)}
      />

      <SearchAndFilter
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Buscar por nombre, correo o rol..."
        filterValue={statusFilter}
        onFilterChange={setStatusFilter}
        filterOptions={[
          { value: 'all', label: 'Todos los estados' },
          { value: 'active', label: 'Activos' },
          { value: 'inactive', label: 'Inactivos' },
          { value: 'pending', label: 'Pendientes' }
        ]}
      />

      <DataTable
        data={filteredUsers}
        columns={tableColumns}
        actions={tableActions}
        keyExtractor={(user) => user.id}
        emptyState={{
          icon: UserIcon,
          title: 'No hay usuarios',
          description: searchTerm || statusFilter !== 'all' 
            ? 'No se encontraron usuarios con los filtros aplicados'
            : 'Comienza creando tu primer usuario'
        }}
      />

      {/* Modales */}
      <DynamicFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreate}
        title="Nuevo Usuario"
        fields={userFormFields}
        submitButtonColor="blue"
      />

      <DynamicFormModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedUser(null);
        }}
        onSubmit={handleUpdate}
        title="Editar Usuario"
        fields={userFormFields}
        initialData={selectedUser || undefined}
        submitButtonColor="blue"
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedUser(null);
        }}
        onConfirm={handleDelete}
        title="Eliminar Usuario"
        message={`¿Estás seguro de que deseas eliminar al usuario "${selectedUser?.name}"? Esta acción no se puede deshacer.`}
        type="danger"
        confirmText="Eliminar"
        cancelText="Cancelar"
      />
    </div>
  );
};



export default UsersCRUD;