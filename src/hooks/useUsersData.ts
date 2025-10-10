import { useState, useEffect } from 'react';
import { usersService, type UpdateUserRequest } from '../services/usersService';
import type { User } from '../types/auth';

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async (includeDeleted = false) => {
    try {
      setLoading(true);
      const data = await usersService.getAllUsers(includeDeleted);
      setUsers(data);
      setError(null);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar los usuarios';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const getUserById = async (id: number) => {
    try {
      const user = await usersService.getUserById(id);
      return user;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener el usuario';
      setError(errorMessage);
      throw err;
    }
  };

  const updateUser = async (id: number, userData: UpdateUserRequest) => {
    try {
      await usersService.updateUser(id, userData);
      // Refetch data since API returns 204 No Content
      await fetchUsers();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar el usuario';
      setError(errorMessage);
      throw err;
    }
  };

  const deleteUser = async (id: number) => {
    try {
      await usersService.deleteUser(id);
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar el usuario';
      setError(errorMessage);
      throw err;
    }
  };

  const restoreUser = async (id: number) => {
    try {
      await usersService.restoreUser(id);
      // Refetch data since API returns 204 No Content
      await fetchUsers();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al restaurar el usuario';
      setError(errorMessage);
      throw err;
    }
  };

  return {
    users,
    loading,
    error,
    refetch: fetchUsers,
    getUserById,
    updateUser,
    deleteUser,
    restoreUser,
  };
};