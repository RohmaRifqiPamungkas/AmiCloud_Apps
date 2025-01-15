import { useState } from 'react';
import useSWR from 'swr';
import axios from '@/lib/axios';
import { useAuth } from '@/hooks/auth';

// Fetch all users with search and pagination
export const useUsers = (page, perPage, search = '') => {
  const fetcher = async (url) => {
    const response = await axios.get(url, {
      params: { page, perPage, search },
    });
    return response.data.users;
  };

  const { data, error, isLoading, mutate } = useSWR(
    () => (page && perPage ? `/api/v1/users?page=${page}&perPage=${perPage}&search=${search}` : null),
    fetcher,
    { revalidateOnFocus: false, shouldRetryOnError: false }
  );

  return {
    users: data?.data || [],
    pagination: data?.links || {},
    isLoading,
    isError: !!error,
    mutateUsers: mutate,
  };
};

// Create a new user
export const useCreateUser = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const createUser = async (userData) => {
    if (!user) throw new Error('Unauthorized: User not authenticated');

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post('/api/v1/users', userData);
      return response.data.user;
    } catch (err) {
      setError(err.response?.data.errors || err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { createUser, isLoading, error };
};

// Fetch user details for editing
export const useUserForEdit = (id) => {
  const fetcher = async (url) => {
    const response = await axios.get(url);
    return response.data;
  };

  const { data, error, isLoading } = useSWR(
    id ? `/api/v1/users/${id}/edit` : null,
    fetcher
  );

  return {
    user: data?.user || null,
    roles: data?.roles || [],
    hasRoles: data?.hasRoles || [],
    isLoading,
    isError: !!error,
  };
};

// Update a user by ID
export const useUpdateUser = (id) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateUser = async (userData) => {
    if (!id) throw new Error('Invalid ID: ID cannot be null');

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.put(`/api/v1/users/${id}`, userData);
      return response.data.user;
    } catch (err) {
      setError(err.response?.data.errors || err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { updateUser, isLoading, error };
};

// Delete a user by ID
export const useDeleteUser = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteUser = async (id) => {
    if (!id) throw new Error('Invalid ID: ID cannot be null');

    setIsLoading(true);
    setError(null);

    try {
      await axios.delete(`/api/v1/users/${id}`);
      return id;
    } catch (err) {
      setError(err.response?.data.errors || err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { deleteUser, isLoading, error };
};
